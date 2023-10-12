const allowedOrigins = require('../config/allowedOrigins');

// Check if the origin sending a request is on the 'allowedOrigins' list; if so, set the 'Access-Control-Allow-Credentials' header in the response to true
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if(allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials;
