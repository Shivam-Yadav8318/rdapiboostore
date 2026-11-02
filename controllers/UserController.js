const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function doAdminLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (typeof email !== 'string' || typeof password !== 'string' ||
            !email.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "This account does not have administrator access"
            });
        }

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

        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: "This administrator account is inactive"
            });
        }

        user.lastLogin = new Date();

        await user.save();

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                userType: user.userType
            },
            process.env.JWT_SECRET || "rdec_secret_key_2024",
            { expiresIn: "7d" }
        );

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


async function getUsers(req, res) {

    try {

        const users = await User.find({});

        console.log(users);

        return res.status(200).send({
            data: users
        });

    } catch (error) {

        console.log(error);

        return res.status(500).send({
            message: "Something went wrong"
        });
    }
}


module.exports = {
    doAdminLogin,
    getUsers
};