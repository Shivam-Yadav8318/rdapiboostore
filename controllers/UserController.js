const User = require('../models/User');
const bcrypt = require('bcrypt');

async function doAdminLogin(req, res) {

    try {

        console.log("========== ADMIN LOGIN ==========");
        console.log("Request body:", req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: email });

        console.log("User found:", user);

        if (!user) {
            console.log("❌ USER NOT FOUND");

            return res.status(400).send({
                success: false,
                message: "Invalid email or password"
            });
        }

        console.log("Stored password:", user.password);

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        console.log("Password valid:", validPassword);

        if (!validPassword) {
            console.log("❌ PASSWORD DOES NOT MATCH");

            return res.status(400).send({
                success: false,
                message: "Invalid email or password"
            });
        }

        console.log("✅ PASSWORD MATCHED");

        user.lastLogin = new Date();

        await user.save();

        return res.status(200).send({
            success: true,
            message: "Admin login successful",
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType
            }
        });

    } catch (err) {

        console.log("❌ ADMIN LOGIN ERROR:", err);

        return res.status(500).send({
            success: false,
            message: err.message
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