const express = require ('express');
const userCtrl = require ('../controllers/userConnection');
const router = express.Router();
const signup = require('../middlewares/signup')
const login = require('../middlewares/login')
router.post('/signup',signup, userCtrl.signup);
router.post('/login',login, userCtrl.login);
/* router.get('/get', userCtrl.get) */
module.exports = router;