var redis = require('redis');

var client = redis.createClient();

function userExists(userId, callback) {
    client.exists('pending_' + userId, callback);
}

function savePendingProducts(userId, productIds, callback) {
    console.log('productIds', productIds);
    client.sadd('pending_' + userId, productIds, callback);
}

function nextProduct(userId, callback) {
    client.spop('pending_' + userId, callback);
}

function wantProduct(userId, productId, callback) {
    client.sadd('want_' + userId, productId, callback);
}

function ownProduct(userId, productId, callback) {
    client.sadd('own_' + userId, productId, callback);
}

function ignoreProduct(user, productId) {
    client.sadd('ignored_' + userId, productId);
}

module.exports = {
    userExists: userExists,
    savePendingProducts: savePendingProducts,
    nextProduct: nextProduct,
    wantProduct: wantProduct,
    ignoreProduct: ignoreProduct
};