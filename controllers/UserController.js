const User = require('../models/User');
const bcrypt = require('bcrypt');
<<<<<<< HEAD
const jwt = require('jsonwebtoken');

async function doAdminLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (typeof email !== 'string' || typeof password !== 'string' ||
            !email.trim() || !password) {
            return res.status(400).json({
=======

async function doAdminLogin(req, res) {

    try {

        console.log("========== ADMIN LOGIN ==========");
        console.log("Request body:", req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
>>>>>>> f32b891442c72627b49becb71c877c978e89778a
                success: false,
                message: "Email and password are required"
            });
        }

<<<<<<< HEAD
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
=======
        const user = await User.findOne({ email: email });

        console.log("User found:", user);

        if (!user) {
            console.log("❌ USER NOT FOUND");

            return res.status(400).send({
>>>>>>> f32b891442c72627b49becb71c877c978e89778a
                success: false,
                message: "Invalid email or password"
            });
        }

<<<<<<< HEAD
        if (user.userType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "This account does not have administrator access"
            });
        }
=======
        console.log("Stored password:", user.password);
>>>>>>> f32b891442c72627b49becb71c877c978e89778a

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

<<<<<<< HEAD
        if (!validPassword) {
            return res.status(401).json({
=======
        console.log("Password valid:", validPassword);

        if (!validPassword) {
            console.log("❌ PASSWORD DOES NOT MATCH");

            return res.status(400).send({
>>>>>>> f32b891442c72627b49becb71c877c978e89778a
                success: false,
                message: "Invalid email or password"
            });
        }

<<<<<<< HEAD
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: "This administrator account is inactive"
            });
        }
=======
        console.log("✅ PASSWORD MATCHED");
>>>>>>> f32b891442c72627b49becb71c877c978e89778a

        user.lastLogin = new Date();

        await user.save();

<<<<<<< HEAD
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
=======
        return res.status(200).send({
>>>>>>> f32b891442c72627b49becb71c877c978e89778a
            success: true,
            message: "Admin login successful",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
<<<<<<< HEAD
                userType: user.userType,
                token
=======
                userType: user.userType
>>>>>>> f32b891442c72627b49becb71c877c978e89778a
            }
        });

    } catch (err) {
<<<<<<< HEAD
        console.error("Admin login failed:", err);

        return res.status(500).json({
            success: false,
            message: "Unable to log in right now. Please try again."
=======

        console.log("❌ ADMIN LOGIN ERROR:", err);

        return res.status(500).send({
            success: false,
            message: err.message
>>>>>>> f32b891442c72627b49becb71c877c978e89778a
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