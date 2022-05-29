const express = require ('express');
const router = express.Router();



const multer = require('../middlewares/multer-config')
const auth = require('../middlewares/auth');
const publiCtrl = require('../controllers/publications')


router.get('/', auth, publiCtrl.getAll);
router.get('/:id',auth, publiCtrl.getOne);
router.post('/',auth, multer, publiCtrl.create);
router.delete('/:id', auth, publiCtrl.delete);
router.put('/:id',auth, multer, publiCtrl.modify);
router.post('/:id/like',auth, publiCtrl.like)






module.exports = router