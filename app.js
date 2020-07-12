var express          = require("express"),
    app              = express(),
    mongoose         = require("mongoose"),
    mongoDB          = 'mongodb+srv://main:cs361summer2020@cluster0.ennpr.mongodb.net/bajas2048?retryWrites=true&w=majority',
    port             = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db               = mongoose.connection,
    ColorSchemeModel = require("./public/models/colorschemes"),
    HighScoreModel   = require("./public/models/highscores");
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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