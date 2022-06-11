const express = require('express');
const router = express.Router();


const auth = require('../middlewares/auth');
const comCtrl = require('../controllers/comments')


router.get('/:publication_id/comments/getAll', auth, comCtrl.getAll);
router.post('/:publication_id/comments', auth, comCtrl.create);
router.put('/:publication_id/comments/:comment_id', auth, comCtrl.modify)
router.delete('/:publication_id/comments/:comment_id', auth, comCtrl.delete)
router.post('/:publication_id/comments/:comment_id', auth, comCtrl.like)

module.exports = router;