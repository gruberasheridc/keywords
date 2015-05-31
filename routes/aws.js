/**
 * Created by asher on 18/04/15.
 */
var Promise = require('bluebird');

var s3 = require('../AWSService')();
s3.setup();

exports.search = function (req, res) {
    var searchKey = req.query.word;
    s3.getItem(searchKey).then(function(data) {
        res.send(data);
    });
};