var db = require('../AWSService')();
db.setup();

exports.search = function (req, res) {
    var searchKey = req.query.searchTerm;
    db.getItem(searchKey).then(function(data) {
        db.batchGetItem(["reviews", "search"]).then(function(data) {
            res.send(data);
        });
    });
};

exports.query = function (req, res) {
    var searchKey = req.query.searchTerm;
    db.queryItems(searchKey).then(function(data) {
        // Process data and send response to the caller.
        var websites = [];
        data.Items.forEach(function(item) {
            var website = item.Url.S;
            websites.push(website);
        })

        res.send(websites);
    });
};