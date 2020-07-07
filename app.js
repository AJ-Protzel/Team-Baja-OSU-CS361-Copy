var express = require("express"),
    app     = express(),
    port    = process.env.PORT || 4000;

app.get('/', function(req, res) {
    res.send(JSON.stringify('heroku setup successful'))
});

app.listen(port, function() {
    console.log('server is listening');
});