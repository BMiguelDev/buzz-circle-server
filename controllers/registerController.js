const bcrypt = require('bcrypt');

const User = require('../model/User');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });

    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409);   // Return response with 'status' of 409 ("Conflict")

    try {
        const hashedPassword = await bcrypt.hash(pwd, 10);  // Encrypt and salt the received password using 'bcrypt'.

        await User.create({ 
            'username': user,
            'password': hashedPassword 
        });

        res.status(201).json({ 'success': `New user ${user} created successfully` });    // Set response with 'status' of 201 ("Created")
    } catch (err) {
        res.status(500).json({ 'message': err.message });   // Set response with 'status' of 500 ("Server Error")
    }
}

module.exports = { handleNewUser };
