const allowedOrigins = require('../config/cors_options');

const credentials = (req, res, next) => {
    const origin = req.headers.origin
    if (allowedOrigins == origin) {
        res.header('Access-Control-Allow-Credentials', origin)
    }
    next()
}

module.exports = credentials