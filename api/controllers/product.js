const mongoose = require('mongoose');
const Product = require('../models/product');

exports.get_product = (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: 'http://192.168.0.111:3000/' + doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://192.168.0.111:3000/products/' + doc._id
                        }
                    }
                })
            }
            // console.log(docs);
            // if (docs.length >= 0 ) {
            res.status(200).json(response);
            // } else {
            //     res.status(404).json({
            //         message: 'No Entries found'
            //     });
            // }            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

exports.create_product = (req, res, next) => {        
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save()
        .then(result => {            
            res.status(200).json({
                message: 'Succesful created product',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://192.168.0.111:3000/products/' + result._id
                    }
                }
            })
        })
        .catch(err => console.log(err));
}

exports.get_product_byId = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name, price, _id, productImage')
        .exec()
        .then(doc => {
            console.log("From Database", doc);
            if(doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://192.168.0.111:3000/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid for entry found for provider product_id'
                })
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
}

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for ( const ops of req.body ) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'Update successfully',
                request: {
                    type: 'GET',
                    url: 'http://192.168.0.111:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        })
}

exports.delete_product = (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Deleted successfully',
                request: {
                    type: 'POST',
                    url: 'http://192.168.0.111:3000/products',
                    body: {
                        name: 'String',
                        price: 'Number'
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
}