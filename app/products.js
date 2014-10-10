var config = require('./config');
var request = require('request');
var lodash = require('lodash');

function getAllProducts(callback) {
    var products = [];
    function fetch(offset) {
        var url = ['https://stg.api.bazaarvoice.com/data/products.json?apiversion=5.4',
            '&passkey=', config.rrkey,
            '&limit=100',
            '&filter=isactive:eq:true',
            '&offset=', offset].join('');

        request.get(url, function (error, response, body) {
            try {
                body = JSON.parse(body);
            } catch (e) {
                error = error || e;
            }
            if (error) {
                return callback(error, null);
            }
            products.push.apply(products, body.Results);
            if (products.length < body.TotalResults) {
                fetch(offset + 100);
            } else {
                callback(null, products);
            }
        });
    }

    fetch(0);
}


function getProductInfo(productId, callback) {
    var url = ['https://stg.api.bazaarvoice.com/data/products.json?apiversion=5.4',
        '&passkey=', config.rrkey,
        '&filter=id:eq:', productId].join('');

    request.get(url, function (error, response, body) {
        try {
            body = JSON.parse(body);
        } catch (e) {
            error = error || e;
        }
        if (error) {
            return callback(error, null);
        }

        callback(error, lodash.first(body.Results));
    });
}


module.exports = {
    getAllProducts: getAllProducts,
    getProductInfo: getProductInfo
};