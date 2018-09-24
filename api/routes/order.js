const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {    
    res.status(200).json({
        message: 'order sucessfully'
    })
})

router.post('/', (req, res, next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(200).json({
        message: 'order sucessfully',
        order
    })
})

router.get('/:orderId', (req, res, next) => {    
    res.status(200).json({
        message: 'order fetch by id',
        orderId: req.params.orderId,
    })
})

router.delete('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'order deleted',
        orderId: req.params.orderId
    })
})

module.exports = router;