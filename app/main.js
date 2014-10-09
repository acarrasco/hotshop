var express = require('express');

var app = express();

app.configure(function () {
    app.use(express.methodOverride()); // Allow browsers to simulate PUT etc.
    app.use(textHandler); // Handle text POSTs
    app.use(express.bodyParser()); // Support POST form bodies. Why would someone ever *not* want this?
    app.use(express.cookieParser('c98wrytiasghaos')); // Support yummy signed cookies
    // 'express.static' causes jshint warning (static is reserved word).
    app.use('/public', express['static']('static'));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.use(app.router);
});

app.post('/user/:userId/nextproduct', function(req, res, next) {

});

app.post('/user/:userId/search/', function(req, res, next) {

});

app.post('/user/:userId/like/:productId', function(req, res, next) {

});

app.post('/user/:userId/want/:productId', function(req, res, next) {

});

app.get('/user/:userId/wishlist', function(req, res, next) {

});

app.post('/user/:userId/dontlike/:productId', function(req, res, next) {

});

app.get('/user/:userId/inbox', function(req, res, next) {
    //people asking about products you own

    //call to action for reviews

});

