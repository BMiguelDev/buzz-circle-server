const jwt = require('jsonwebtoken');

const User = require('../model/User');

// Generate a new access token if refresh token is valid
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(401);

    const refreshToken = cookies.refreshToken;
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403);     // Return response with 'status' of 403 ("Forbidden")

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.UserInfo.username) return res.sendStatus(403);
            
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id": decoded.UserInfo.id,
                        "username": decoded.UserInfo.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '300s' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken };
