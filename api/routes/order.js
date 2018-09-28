const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const orderControllers = require('../controllers/order');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', checkAuth, orderControllers.get_order)

router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product) {
                return res.status(404).json({
                    message: "Product not found"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
            return order.save()                            
        })
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://192.168.0.111:3000/orders/' + result._id
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: 'Order failed'
            })
        })    
})


//populate digunakan untuk menampilkan data pada collections yang berbeda yang telah direlasi idnya
router.get('/:orderId', checkAuth, (req, res, next) => {    
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        if(!order) {
            res.status(404).json({
                order: 'Order not found'
            })
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://192.168.0.111:3000/orders'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
})

router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.remove({_id: req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    url: 'http://192.168.0.111:3000/orders',
                    body: { productId: 'ID', quantity: 'Number' }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router;