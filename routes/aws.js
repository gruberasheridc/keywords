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
                wordSitesMap.set(word, sites);
            });

            // Generate items for insert to the InvertedIndex Table (item contains Word, Sites).
            var invertedIndexItems = [];
            wordSitesMap.entries().forEach(function(entry) {
                var word = entry[0];
                var sites = entry[1];

                var item = {
                    Item: {
                        Word: {
                            S: word
                        },
                        sites: {
                            S: sites
                        }
                    }
                };

                invertedIndexItems.push(item);
            });

            // Generate items for insert to the WordUrlRank. Each item contains Word, Url, Rank.
            // We will access the inverted index table only for getting the rank of URLs (it is possible that some ranks
            // exist in the Inverted Index table that are not in the map (if this is a case of update).
            var rankItems = [];
            wordSitesMap.entries().forEach(function(entry) {
                var word = entry[0];
                if (validator.isURL(word)) {
                    // Urls words are only inserted as keys to the InvertedIndex table.
                    // We will perform a lookup to the InvertedIndex table for getting their rank.
                    return;
                }

                var sites = entry[1]; // We get the sites from the map.
                var sitesList = sites.split(",");
                sitesList.forEach(function(site) {
                    // Generate an item for every Word, Site, Site Rank.
                    var siteRank = wordSitesMap.get(site)
                    if (!siteRank) {
                        // If site is not in map.
                        siteRank = 0;
                    }

                    var item = {
                        Item: {
                            Word: {
                                S: word
                            },
                            Url: {
                                S: site
                            },
                            Rank: {
                                N: siteRank
                            }
                        }
                    };

                    rankItems.push(item);
                });

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