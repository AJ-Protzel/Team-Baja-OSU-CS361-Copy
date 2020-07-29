var express          = require("express"),
    app              = express(),
    mongoose         = require("mongoose"),
    mongoDB          = 'mongodb+srv://main:cs361summer2020@cluster0.ennpr.mongodb.net/bajas2048?retryWrites=true&w=majority',
    port             = process.env.PORT || 4001;
    bodyParser       = require('body-parser');

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

//used for catching entries from server and serve them up in the right format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile('views/index.html', {root: __dirname })
});
app.post('/getDB', function(req, res, next){
    let context = {};
    var query = req.body;
    let dbQuery;
    console.log("inside getDB");
    console.log(query.size);
    let topScores = {};
    
    /*
    var dbQuery = HighScoreModel.find({});
    dbQuery instanceof mongoose.Query;
    doc = await query;
    */
   
    //console.log(dbQuery);

});

app.post('/sendDB', function(req, res, next){
    // client request top 10 lists and/or update scores
    context = {};
    var query = req.body;
    console.log(query);
    var addedScore = new HighScoreModel({name: query.name, score: query.score , size :query.size});
    addedScore.save(function (err) {
        if (err) return handleError(err);
        // saved!
    }); 
})

app.listen(port, function() {
    console.log("Server is running on Port: " + port);
});

app.use(function(req,res){
    res.status(404);
    console.log("404");
  });
  
  app.use(function(err, req, res, next){
    console.error(err.stack);
  });
  