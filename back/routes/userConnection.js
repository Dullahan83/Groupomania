const express = require ('express');
const userCtrl = require ('../controllers/userConnection');
const router = express.Router();

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
/* router.get('/get', userCtrl.get) */
module.exports = router;