var mongoose = require('mongoose');

// Schema Definition
var Schema = mongoose.Schema;

var HighScoreSchema = new Schema (
    {
        name: {type: String, required: true, maxlength: 100},
        score: {type: Number, required: true},
        size: {type: Number, required: true}
    }
);

module.exports = mongoose.model('HighScore', HighScoreSchema);