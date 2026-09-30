const User = require('../../models/User')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// CREATE USER / SIGN UP
// ==========================================

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, mobileNo, email, password, profilePhoto } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: "First name, email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : "",
      mobileNo: mobileNo || "",
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      profilePhoto: profilePhoto || "",
      userType: "user",
      status: "active",
    });

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
      },
    });

  } catch (error) {
    console.error("Create User Error:", error);
    return res.status(500).json({ message: "Server error while creating user", error: error.message });
  }
};

// ==========================================
// LOGIN USER - FIXED WITH TOKEN
// ==========================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "Your account is inactive" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.lastLogin = new Date();
    await user.save();

    // ===== FIX: GENERATE JWT TOKEN =====
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET || "rdec_secret_key_2024",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,  // <-- NOW SENDING TOKEN
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        profilePhoto: user.profilePhoto,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error while logging in", error: error.message });
  }
};

module.exports = { createUser, loginUser };