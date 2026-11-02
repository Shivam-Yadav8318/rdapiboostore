const express = require("express");
const TransactionController = require("../controllers/PaymentController");

const router = express.Router();

// Protect this route with admin authentication
router.get(
  "/transactions",
  TransactionController.getTransactions
);


module.exports = router;