const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const orderController = require('../controllers/order');

router.get('/', checkAuth, orderController.get_order)

router.post('/', checkAuth, orderController.post_order)


//populate digunakan untuk menampilkan data pada collections yang berbeda yang telah direlasi idnya
router.get('/:orderId', checkAuth, orderController.get_order_byId)

router.delete('/:orderId', checkAuth, orderController.delete_order)

module.exports = router;