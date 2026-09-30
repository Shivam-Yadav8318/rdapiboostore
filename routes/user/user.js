const express = require("express");

const router = express.Router();

const {
  createUser,
  loginUser,
} = require('../../controllers/user/UserController');

// Create account
router.post("/create/user", createUser);

// Login
router.post("/login/user", loginUser);

module.exports = router;