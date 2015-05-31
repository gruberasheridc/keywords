var db = require('../AWSService')();
db.setup();

exports.search = function (req, res) {
    var searchKey = req.query.searchTerm;
    db.getItem(searchKey).then(function(data) {
        db.batchGetItem(["reviews", "search"]).then(function(data) {

        });

        res.send(data);
    });
};