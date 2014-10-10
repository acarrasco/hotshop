var express = require('express');
var http = require('http');
var lodash = require('lodash');
var products = require('./products');
var ugc = require('./ugc');
var db = require('./db');
var path = require('path');
var app = express();

// 'express.static' causes jshint warning (static is reserved word).
app.use('/public', express['static']('static'));

// root route
app.get('/', function(req, res) {
    // load the single view file (angular will handle the page changes on the front-end)
    res.sendFile(path.join(__dirname, '../static', 'index.html'));
});

// static content routes
app.get('/vendor/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../static', req.path));
});
app.get('/styles/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../static', req.path));
});
app.get('/js/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../static', req.path));
});

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
    db.ownProduct(req.params.userId, req.params.productId, function (err) {
        if (err) {
            return res.json({error: '' + err, reason: 'db error saving ownership list'});
        }
        res.json({error: false});
    });
});

app.post('/user/:userId/want/:productId', function (req, res) {
    db.wantProduct(req.params.userId, req.params.productId, function (err) {
        if (err) {
            return res.json({error: '' + err, reason: 'db error saving wish list'});
        }
        res.json({error: false});
    });
});

app.post('/user/:userId/meh/:productId', function (req, res) {
    db.ignoreProduct(req.params.userId, req.params.productId, function (err) {
        if (err) {
            return res.json({error: '' + err, reason: 'db error saving ignore list'});
        }
        res.json({error: false});
    });
});

app.get('/user/:userId/wishlist', function (req, res) {
    db.getWishList(req.params.userId, function (err, wishList) {
        if (err) {
            return res.json({error: '' + err, reason: 'db error getting wish list'});
        }
        res.json({error: false, wishList: wishList});
    });
});

app.get('/user/:userId/ownlist', function (req, res) {
    db.getOwnList(req.params.userId, function (err, ownList) {
        if (err) {
            return res.json({error: '' + err, reason: 'db error getting own list'});
        }
        res.json({error: false, ownList: ownList});
    });
});


app.get('/user/:userId/reviews', function (req, res) {
    var userId = req.params.userId;
    db.getReviewsDate(userId, function (err, since) {
        since = since || Math.round(Date.now()/1000 - (60 * 60 * 24 * 365 * 5));
        db.getWishList(userId, function (err, productIds) {
            if (err) {
                return res.json({error: '' + err, reason: 'db error getting wish list'});
            }
            ugc.getFreshGoodReviewsFor(productIds, since, function (err, reviews) {
                if (err) {
                    return res.json({error: '' + err, reason: 'devapi error getting reviews list'});
                }
                res.json({error: false, reviews: reviews});
            });
        });
    });
});

app.get('/user/:userId/questions', function (req, res) {
    var userId = req.params.userId;
    db.getQuestionsDate(userId, function (err, since) {
        since = since || Math.round(Date.now()/1000 - (60 * 60 * 24 * 365 * 5));
        db.getOwnList(userId, function (err, productIds) {
            if (err) {
                return res.json({error: '' + err, reason: 'db error getting own list'});
            }
            ugc.getFreshUnansweredQuestionsFor(productIds, since, function (err, questions) {
                if (err) {
                    return res.json({error: '' + err, reason: 'devapi error getting reviews list'});
                }
                res.json({error: false, questions: questions});
            });
        });
    });
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
