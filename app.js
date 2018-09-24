const express = require('express');
const app = express()
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./db');
//menerima routes dari api/routes/products
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/order')


mongoose.connect(config.DB, {
    useNewUrlParser: true
})
    .then(
        () => {console.log('Database is connected')},
        err => {console.log('Can not connect to the database' + err)}
    )
//function middleware: yang digunakan 
//untuk mengetahui status http verbs pada terminal(apabila menggunakan dev)
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

//control allow origin
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method==='OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT POST PATCH DELETE GET')
        return res.status(200).json({});
    }
    next();
});
//dari folder routes ditambah / + routes yang akan di fetch e.g: /products
app.use('/products', productRoutes);
app.use('/order', orderRoutes);

//jika routes tidak ada maka akan dialihkan ke sini
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error)
})

app.use((error,  req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;