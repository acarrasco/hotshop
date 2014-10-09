var express = require('express');
var http = require('http');
var lodash = require('lodash');
var products = require('./products'); 
var db = require('./db');

var app = express();

// 'express.static' causes jshint warning (static is reserved word).
app.use('/public', express['static']('static'));

app.post('/user/:userId/init', function (req, res) {
    var userId = req.params.userId;
    db.userExists(userId, function (err, userExists) {
        if (err) {
            return res.json({error: '' + err, reason: 'db error checking if user exists'});
        }

        if (userExists) {
            return res.json({error: false, newUser: false});
        }

        products.getAllProducts(function (err, products) {
            if (err) {
                console.log(err);
                return res.json({error: '' + err, reason: 'devapi error retrieving products'});
            }

            console.log('products:', products);

            var productIds = lodash.pluck(products, 'Id');
            db.savePendingProducts(userId, productIds, function (err) {
                if (err) {
                    return res.json({error: '' + err, reason: 'db error saving pending products'});
                }
                return res.json({error: false, newUser: true});
            });
        });
    });
});

app.post('/user/:userId/nextproduct', function (req, res) {
    var userId = req.params.userId;
    db.nextProduct(userId, function (err, productId) {
        if (err) {
            return res.json({error: '' + err, reason: 'db error getting next product'});
        }

        products.getProductInfo(productId, function (err, productInfo) {
            if (err) {
                return res.json({error: '' + err, reason: 'devapi error retrieving product info'});
            }
            return res.json({error: false, productInfo: productInfo});
        });
    });
});

app.post('/user/:userId/have/:productId', function (req, res) {

});

app.post('/user/:userId/want/:productId', function (req, res) {

});

app.post('/user/:userId/meh/:productId', function (req, res) {

});

app.get('/user/:userId/wishlist', function (req, res) {

});

app.get('/user/:userId/inbox', function (req, res, next) {
    //people asking about products you own

    //call to action for reviews

});

app.get('/product/:productId', function (req, res) {
    var productId = req.params.productId;

    products.getProductInfo(productId, function (err, productInfo) {
        if (err) {
            return res.json({error: '' + err, reason: 'devapi error retrieving product info'});
        }
        return res.json({error: false, productInfo: productInfo});
    });
});

http.createServer(app).listen(8080, function () {
    console.log('server created');
});
