const express = require('express');
const userDataCtrl = require('../controllers/userData')
const auth = require('../middlewares/auth')
const router = express.Router();


router.get('/:username', auth, userDataCtrl.getProfile);
router.put('/:username', auth, userDataCtrl.modifyProfile);
router.delete('/:username', auth, userDataCtrl.deleteProfile);
router.get('/:username/publications', auth, userDataCtrl.getUserPosts);
router.get('/:username/comments', auth, userDataCtrl.getUserComments);
router.get('/:username/friendlist', auth, userDataCtrl.getUserFriendlist);
router.get('/:username/favorites', auth, userDataCtrl.getUserFavorites);





module.exports = router;