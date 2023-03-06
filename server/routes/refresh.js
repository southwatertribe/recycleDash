const express = require("express")
const router = express.Router()
const refreshTokenController = require('../controllers/refreshTokenController')
router.get('/', refreshTokenController.handlRefreshToken);

module.exports = router