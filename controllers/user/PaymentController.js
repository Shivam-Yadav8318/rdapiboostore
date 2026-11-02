 const Razorpay = require('razorpay');
const Transaction = require('../../models/Transaction');
const crypto = require('crypto');

 const normalizeEmail = email =>
   typeof email === 'string' ? email.trim().toLowerCase() : '';

 const escapeRegex = value =>
   value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

 const findCustomerOrder = (transactionId, email) => {
   const normalizedEmail = normalizeEmail(email);
   if (!transactionId || !normalizedEmail) return null;

   return Transaction.findOne({
     transactionId,
     email: new RegExp(`^${escapeRegex(normalizedEmail)}$`, 'i')
   });
 };

 // ==============================
 // MAKE PAYMENT
 // ==============================
const makePayment = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const transaction = new Transaction({
      ...req.body,
      email: normalizeEmail(req.body.email),
      pincode: req.body.pinCode || req.body.pincode,
      products: Array.isArray(req.body.products) ? req.body.products : []
    });

    const options = {
      amount: Math.round(Number(req.body.amount) * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    if (!Number.isSafeInteger(options.amount) ||
        options.amount <= 0) {
      return res.status(400).json({
        message: 'Invalid payment amount'
      });
    }

    const order = await razorpay.orders.create(options);

    transaction.transactionId = order.id;
    transaction.status = 'Pending';

    await transaction.save();

    return res.status(200).json(order);

  } catch (err) {
    console.error('Payment order creation failed:', err);

    if (err.statusCode === 429) {
      return res.status(429).json({
        message: 'Payment provider rate limit reached. Please wait before trying again.'
      });
    }

    return res.status(500).json({
      message: 'Payment order creation failed'
    });
  }
};

// ==============================
// VERIFY PAYMENT
// ==============================
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: 'Missing payment details'
      });
    }

    const sign =
      razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac(
        'sha256',
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(sign)
      .digest('hex');

    const receivedBuffer = Buffer.from(
      razorpay_signature,
      'hex'
    );

    const expectedBuffer = Buffer.from(
      expectedSign,
      'hex'
    );

    const isValid =
      receivedBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(
        receivedBuffer,
        expectedBuffer
      );

    if (!isValid) {
      return res.status(400).json({
        message: 'Invalid signature, payment failed!'
      });
    }

    const transaction = await Transaction.findOne({
      transactionId: razorpay_order_id
    });

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found'
      });
    }

    transaction.status = 'Completed';
    transaction.paymentId = razorpay_payment_id;

    await transaction.save();

    return res.status(200).json({
      message: 'Payment verified successfully',
      data:razorpay_order_id

    });

  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: 'Payment verification failed'
    });
  }
};
// ==============================
// GET MY ORDERS
// ==============================
const getMyOrder = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const myOrders = await Transaction.find({
      email: new RegExp(`^${escapeRegex(email)}$`, 'i'),
      hiddenFromCustomer: { $ne: true }
    })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: myOrders,
    });
  } catch (err) {
    console.error("Get Order Details Error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order details",
    });
  }
};

const updateShippingDetails = async (req, res) => {
  try {
    const transaction = await findCustomerOrder(
      req.params.transactionId,
      req.body.email
    );

    if (!transaction || transaction.hiddenFromCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (transaction.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Shipping details cannot be changed for a cancelled order'
      });
    }

    const fields = [
      'firstName',
      'lastName',
      'mobileNo',
      'addressLine1',
      'addressLine2',
      'city',
      'state',
      'country',
      'pincode'
    ];

    for (const field of fields) {
      const value = req.body[field];
      if (value !== undefined) {
        if (typeof value !== 'string') {
          return res.status(400).json({
            success: false,
            message: `Invalid ${field}`
          });
        }
        transaction.set(field, value.trim());
      }
    }

    await transaction.save();

    return res.status(200).json({
      success: true,
      message: 'Shipping details updated successfully',
      data: transaction
    });
  } catch (err) {
    console.error('Update Order Details Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to update shipping details'
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const transaction = await findCustomerOrder(
      req.params.transactionId,
      req.body.email
    );

    if (!transaction || transaction.hiddenFromCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (transaction.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This order is already cancelled'
      });
    }

    transaction.status = 'Cancelled';
    await transaction.save();

    return res.status(200).json({
      success: true,
      message: 'Order cancelled. No refund has been issued.',
      data: transaction
    });
  } catch (err) {
    console.error('Cancel Order Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to cancel order'
    });
  }
};

const hideOrder = async (req, res) => {
  try {
    const transaction = await findCustomerOrder(
      req.params.transactionId,
      req.body.email
    );

    if (!transaction || transaction.hiddenFromCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    transaction.hiddenFromCustomer = true;
    await transaction.save();

    return res.status(200).json({
      success: true,
      message: 'Order removed from your order list'
    });
  } catch (err) {
    console.error('Hide Order Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Unable to remove order'
    });
  }
};

module.exports = {
  makePayment,
  verifyPayment,
  getMyOrder,
  updateShippingDetails,
  cancelOrder,
  hideOrder
};