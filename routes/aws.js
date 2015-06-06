var db = require('../AWSService')();
db.setup();

var fs = require('../fileSystemLayer')();
fs.setup();

var validator = require('validator');

var Map = require("collections/map");


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

exports.fillTalbe = function (req, res) {
    // Read input file.
    fs.getFile("./input/invertedindex.txt").then(function(data) {
        if (data) {
            // Prepare data for insert.
            var lines = data.split('\n');

            // Generate a word/url => Sites/Number map. To be used in order to prepare the insert statement.
            var wordSitesMap = new Map();
            lines.forEach(function(line) {
                var wordSites = spliteWordSites(line);
                var word = wordSites[0];
                var sites = wordSites[1]; // If the word is a URL sites will contain a number.
            });

            // Generate items for insert. Each item contains Word, Url, Rank.
            var items = [];
            wordSitesMap.entries().forEach(function(entry) {
                var word = entry[0];
                if (validator.isURL(word)) {
                    // Urls words are only
                    return;
                }

                var sites = entry[1];
            });
        }
/*        db.batchWriteItem().then(function(data) {
            res.send(data);
        });*/
    });
};

function spliteWordSites(line) {
    var arr = new Array();
    arr[0] = line.substring(0, line.indexOf(","));
    arr[1] = line.substring(line.indexOf(",") + 1);

    return arr;
};