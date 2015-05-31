var s3 = require('../AWSService')();
s3.setup();

exports.search = function (req, res) {
    var searchKey = req.query.searchTerm;
    s3.getItem(searchKey).then(function(data) {
        res.send(data);
    });
};