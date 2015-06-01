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
    var websites = [];
    var searchKey = req.query.searchTerm;
    if (searchKey) {
        db.queryItems(searchKey).then(function(data) {
            // Process data and send response to the caller.
            data.Items.forEach(function(item) {
                var website = item.Url.S;
                websites.push(website);
            })

            res.send(websites);
        });
    } else {
        // No search term was found. Return an empty websites list.
        res.send(websites);
    }
};