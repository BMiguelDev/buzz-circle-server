const jwt = require('jsonwebtoken');

// Verify if an access token is valid 
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // A correctly formed authorization header must have the format "Bearer <token>" 
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);     // If authorization header isn't valid, return response with 'status' of 401 ("Unauthorized")

    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {     // This callback has the 'decoded' information from the jwt
            if (err) return res.sendStatus(403);     // If token received is invalid, return response with 'status' of 403 ("Forbidden")
            req.user_id = decoded.UserInfo.id;
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT;
