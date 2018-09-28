//membuat routes menggunakan express.Router
const express = require('express');
const router = express.Router();

const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/product');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

//endpoint yang akan dipanggil, hanya /, pemanggilan routes terdapat pada app.js
//method get
router.get('/', productController.get_product)

//method post
router.post('/', checkAuth, upload.single('productImage'), productController.create_product)

//method get berdasarkan id
router.get('/:productId', productController.get_product_byId);

//method update
router.patch('/:productId', checkAuth, productController.update_product)

//method.delete
router.delete('/:productId', checkAuth, productController.delete_product)

module.exports = router;
