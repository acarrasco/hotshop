var config = require('./config');
var request = require('request');
var lodash = require('lodash');

function getFreshGoodReviewsFor(productIds, since, callback) {
    var url = ['https://stg.api.bazaarvoice.com/data/reviews.json?apiversion=5.4',
        '&passkey=', config.rrkey,
        '&limit=100',
        '&filter=ProductId:', productIds.join(','),
        '&filter=Rating:', 5,
        '&filter=SubmissionDate:gt:', since].join('');

    request.get(url, function (error, response, body) {
        try {
            body = JSON.parse(body);
        } catch (e) {
            error = error || e;
        }
        if (error) {
            return callback(error, null);
        }

        callback(null, body.Results);
    });
}

function getFreshUnansweredQuestionsFor(productIds, since, callback) {
    var url = ['https://stg.api.bazaarvoice.com/data/questions.json?apiversion=5.4',
        '&passkey=', config.rrkey,
        '&limit=100',
        '&filter=ProductId:', productIds.join(','),
        '&filter=Rating:', 5,
        '&filter=SubmissionDate:gt:', since].join('');

    request.get(url, function (error, response, body) {
        try {
            body = JSON.parse(body);
        } catch (e) {
            error = error || e;
        }
        if (error) {
            return callback(error, null);
        }

        callback(null, body.Results);
    });
}


module.exports = {
    getFreshGoodReviewsFor: getFreshGoodReviewsFor,
    getFreshUnansweredQuestionsFor: getFreshUnansweredQuestionsFor
};