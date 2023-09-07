const allowedOrigins = require('./corsconfig');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('CORS SAID FUCK YOU'))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions