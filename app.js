var express = require('express');
var app = express();

app.use(express.static('public'));

var aws = require('./routes/aws');

app.get('/keyword', aws.search);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('app listening at http://%s:%s', host, port);
});
