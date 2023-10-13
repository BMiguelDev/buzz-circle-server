const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User');

// Generate a new access and refresh token if the received user credentials are correct
const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });    // Return response with 'status' of 400 ("Bad Request")

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401);     // Return response with 'status' of 401 ("Unauthorized")

    const isPasswordMatch = await bcrypt.compare(pwd, foundUser.password);
    if (isPasswordMatch) {
        const roles = Object.values(foundUser.roles).filter(Boolean);

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "id": foundUser._id,    // The user's id is also encoded in the token so that we can make authorization verifications in the controllers (e.g. when deleting/updating a post, to check if the user's id is the same as the author's id)
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '900s' }
        );

        const refreshToken = jwt.sign(
            {
                "UserInfo": { 
                    "id": foundUser._id,
                    "username": foundUser.username,
                }
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        // The access token and refresh token are sent in the response. In the frontend, the access token should only be stored in memory (application state)
        res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken })
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };
