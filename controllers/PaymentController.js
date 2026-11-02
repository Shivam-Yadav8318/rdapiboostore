const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ _id: -1 });

    return res.status(200).json({
      success: true,
      message: "Transactions fetched successfully",
      data: transactions,
    });

  } catch (err) {
    console.error("Get Transactions Error:", err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch transactions",
    });
  }
};


module.exports = {
  getTransactions,
  
};