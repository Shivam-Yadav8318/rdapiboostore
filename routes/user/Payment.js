const express = require("express");
const router = express.Router();

const {
  makePayment,
  verifyPayment,
  getMyOrder,
  updateShippingDetails,
  cancelOrder,
  hideOrder,
} = require("../../controllers/user/PaymentController");

router.post("/create-order", makePayment);
router.post("/verify-payment", verifyPayment);
router.post("/myorders", getMyOrder);
router.patch("/:transactionId/shipping", updateShippingDetails);
router.post("/:transactionId/cancel", cancelOrder);
router.delete("/:transactionId", hideOrder);

module.exports = router;