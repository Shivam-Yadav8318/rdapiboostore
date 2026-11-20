
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function doAdminLogin(req, res) {

    try {

        console.log("========== ADMIN LOGIN ==========");

        const { email, password } = req.body;

        // Validate email and password
        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check admin access
        if (user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "This account does not have administrator access"
            });
        }

        // Check account status
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: "This administrator account is inactive"
            });
        }

        // Verify password
        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Update last login
        user.lastLogin = new Date();

        await user.save();

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                userType: user.userType
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Successful login response
        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType,
                token
            }
        });

    } catch (err) {

        console.error("Admin login failed:", err);

        return res.status(500).json({
            success: false,
            message: "Unable to log in right now. Please try again."
        });
    }
}


// ===================================
// GET ALL USERS
// ===================================

async function getUsers(req, res) {

    try {

        const users = await User.find({}).select('-password');

        return res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {

        console.error("Get users error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}


// ===================================
// EXPORT FUNCTIONS
// ===================================

module.exports = {
    doAdminLogin,
    getUsers
};
