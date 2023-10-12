const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        //  If the 'origin' domain is in the 'allowedOrigins', it will be allowed to make requests to the server
        if(allowedOrigins.indexOf(origin) !== -1 /* || !origin */) {    // The "!origin" condition is only for development (to allow domains like "localhost:3500")
            callback(null, true);
        } else callback(new Error('Not allowed by CORS'));
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;
