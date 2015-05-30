/**
 * Created by asher on 18/04/15.
 */
var Promise = require('bluebird');

var s3 = require('../AWSService')();
s3.setup();

exports.search = function (req, res) {
    // Get AWS status information.
    s3.getItem().then(function(data) {
        res.send(data);
    });
};