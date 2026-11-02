const User = require('./models/User');
const bcrypt = require('bcrypt');

async function createAdmin() {
    try {
        let user = await User.findOne({
            email: 'shivam@yopmail.com'
        });

        let password = await bcrypt.hash('123456', 10);

        if (user) {

            user.firstName = 'Shivam';
            user.lastName = 'Kumar';
            user.mobileNo = '8191840241';
            user.password = password;
            user.userType = 'admin';
            user.status = 'active';

            await user.save();

            console.log('Admin updated successfully...');
        } else {

            user = new User();

            user.firstName = 'Shivam';
            user.lastName = 'Kumar';
            user.mobileNo = '8191840241';
            user.email = 'shivam@yopmail.com';
            user.password = password;
            user.userType = 'admin';
            user.status = 'active';

            await user.save();

            console.log('Admin created successfully...');
        }

    } catch (err) {
        console.log(err);
    }
}

module.exports = createAdmin;