const express = require ('express');
const router = express.Router();
const rateLimit = require('express-rate-limit')


const userCtrl = require ('../controllers/userConnection');
const signup = require('../middlewares/signup')
const login = require('../middlewares/login')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limite le nombre requète par IP
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


router.post('/signup',signup, userCtrl.signup);
router.post('/login',login, limiter, userCtrl.login);

module.exports = router;