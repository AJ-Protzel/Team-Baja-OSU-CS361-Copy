var express  = require("express"),
    app      = express(),
    mongoose = require("mongoose"),
    port     = process.env.PORT || 4000;

// TEMPORARY
// This code is used to show the game on Heroku
// without using a view renderer, such as handlebars.
// We will use React later on and this needs to change accordingly. 
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile('views/index.html', {root: __dirname })
});

app.listen(port, function() {
    console.log('server is listening');
});