var redis = require('redis');

var client = redis.createClient();

function userExists(userId, callback) {
    client.exists('pending_' + userId, callback);
}

function savePendingProducts(userId, productIds, callback) {
    client.sadd('pending_' + userId, productIds, callback);
}

function nextProduct(userId, callback) {
    client.srandmember('pending_' + userId, callback);
}

function wantProduct(userId, productId, callback) {
    client.smove('pending_' + userId, 'want_' + userId, productId, callback);
}

function ownProduct(userId, productId, callback) {
    client.smove('pending_' + userId, 'own_' + userId, productId, callback);
}

function ignoreProduct(userId, productId, callback) {
    client.smove('pending_' + userId, 'ignored_' + userId, productId, callback);
}

module.exports = {
    userExists: userExists,
    savePendingProducts: savePendingProducts,
    nextProduct: nextProduct,
    wantProduct: wantProduct,
    ignoreProduct: ignoreProduct
};