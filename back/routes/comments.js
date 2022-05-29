const express = require('express');
const router = express.Router();


const auth = require('../middlewares/auth');
const comCtrl = require('../controllers/comments')


router.get('/')
router.post('/', auth, comCtrl.create);
router.put('/')
router.delete('/')



module.exports = router;