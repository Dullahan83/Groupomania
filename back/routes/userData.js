const express = require('express');
const userDataCtrl = require('../controllers/userData')
const auth = require('../middlewares/auth')
const router = express.Router();


router.get('/:username', auth, userDataCtrl.getProfile);
router.put('/:username', userDataCtrl.modifyProfile)
router.delete('/:username', userDataCtrl.deleteProfile)


module.exports = router;