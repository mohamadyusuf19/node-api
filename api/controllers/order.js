const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.get_order = (req, res, next) => {    
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(data => {
        res.status(200).json({
            count: data.length,
            orders: data.map(dat => {
                return {
                    _id: dat.id,
                    product: dat.product,
                    quantity: dat.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://192.168.0.111:3000/orders/' + dat._id
                    }
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}