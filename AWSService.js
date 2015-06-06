module.exports = function () {
    var Promise = require('bluebird');
    var AWS = require('aws-sdk');

    function setup() {
        // The AWS Credentials are loaded from the credential local file which is defined as best practice.
        AWS.config.region = 'eu-west-1';
    }

    function getItem(key) {
        return new Promise(function(resolve, reject){
            var params = {
                TableName: 'InvertedIndex',
                Key: {
                    "Word" : {
                        "S" : key
                    }
                }
            }

            var db = new AWS.DynamoDB();
            db.getItem(params, function(err, data) {
                if (err) {
                    // an error occurred
                    reject(error);
                }
                else {
                    // successful response
                    resolve(data);
                }
            });
        });
    }

    function batchGetItem(keys) {
        return new Promise(function(resolve, reject) {
            // Define the basic params object.
            var params = {
                RequestItems : {
                    InvertedIndex : {
                        Keys : []
                    }
                }
            }

            // Fill keys according to the given input.
            keys.forEach(function(key) {
               params.RequestItems.InvertedIndex.Keys.push({ Word : { S : key } });
            });

            var db = new AWS.DynamoDB();
            db.batchGetItem(params, function(err, data) {
                if (err) {
                    // an error occurred
                    reject(error);
                }
                else {
                    // successful response
                    resolve(data);
                }
            });
        });
    }

    function batchWriteItem() {
        return new Promise(function(resolve, reject) {
            // Define the basic params object.
            var params = {
                RequestItems: { /* required */
                    WordUrlRank: [
                        {
                            PutRequest: {
                                Item: { /* required */
                                    Word: { /* AttributeValue */
                                        S: 'home'
                                    },
                                    Url: {
                                        S: 'http://recode.net'
                                    },
                                    Rank: {
                                        N: '12'
                                    }
                                }
                            },
                            PutRequest: {
                                Item: { /* required */
                                    Word: { /* AttributeValue */
                                        S: 'learn'
                                    },
                                    Url: {
                                        S: 'http://www.nytimes.com'
                                    },
                                    Rank: {
                                        N: '4'
                                    }
                                }
                            }
                        }
                    ]
                }
            };

            var db = new AWS.DynamoDB();
            db.batchWriteItem(params, function(err, data) {
                if (err) {
                    // an error occurred
                    reject(error);
                }
                else {
                    // successful response
                    resolve(data);
                }
            });
        });
    }

    function queryItems(key) {
        return new Promise(function(resolve, reject) {
            // Define the basic params object.
            var params = {
                TableName : "WordUrlRank",
                IndexName : "Word-Rank-index",
                KeyConditions : {
                    Word : {
                        ComparisonOperator: "EQ",
                        AttributeValueList: [
                            { S: key }
                        ]
                    }
                },
                ScanIndexForward : false
            }

            var db = new AWS.DynamoDB();
            db.query(params, function(err, data) {
                if (err) {
                    // an error occurred
                    reject(error);
                }
                else {
                    // successful response
                    resolve(data);
                }
            });
        });
    }

    return {
        setup : setup,
        getItem : getItem,
        batchGetItem : batchGetItem,
        batchWriteItem : batchWriteItem,
        queryItems : queryItems
    };

};