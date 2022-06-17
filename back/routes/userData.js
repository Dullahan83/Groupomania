const express = require('express');
const userDataCtrl = require('../controllers/userData')
const auth = require('../middlewares/auth')
const router = express.Router();
const multer = require('../middlewares/multer-config')

router.get('/:username', auth, userDataCtrl.getProfile);
router.put('/:username', auth, multer, userDataCtrl.modifyProfile);
router.delete('/:username', auth, userDataCtrl.deleteProfile);
router.get('/:username/publications', auth, userDataCtrl.getUserPosts);
router.get('/:username/followed', auth, userDataCtrl.getUserFollowed);
router.get('/:username/favorites', auth, userDataCtrl.getUserFavorites);
router.post('/:username/follow', auth, userDataCtrl.Follow)
router.delete('/:username/unfollow', auth, userDataCtrl.Unfollow)





module.exports = router;