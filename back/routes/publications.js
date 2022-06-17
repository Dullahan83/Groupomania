const express = require ('express');
const router = express.Router();



const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth');
const publiCtrl = require('../controllers/publications')


router.get('/getAll', auth, publiCtrl.getAll);
router.post('/',auth, multer, publiCtrl.create);
router.delete('/:publication_id', auth, publiCtrl.delete);
router.put('/:publication_id',auth, multer, publiCtrl.modify);
router.post('/:publication_id',auth, publiCtrl.like)
router.post('/:publication_id/bookmark', auth, publiCtrl.addFavorites);
router.delete('/:publication_id/bookmark', auth, publiCtrl.deleteBookmark)






module.exports = router