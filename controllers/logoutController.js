const User = require('../model/User');

// To log out a user, its refresh token is removed from the database and from the cookies
const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);   // Return response with 'status' of 204 ("No content")
 
    const refreshToken = cookies.refreshToken;
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) {
        res.clearCookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    foundUser.refreshToken = '';
    await foundUser.save();

    res.clearCookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout };
