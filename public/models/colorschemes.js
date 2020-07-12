var mongoose = require('mongoose');

// Schema Definition
var Schema = mongoose.Schema;

var ColorSchemeSchema = new Schema (
    {
        name: {type: String, required: true, maxlength: 100},
        colors: {type: Array, required: true}
    }
);

module.exports = mongoose.model('ColorScheme', ColorSchemeSchema);