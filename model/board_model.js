var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var boardSchema = new Schema({
    content : String,
    no : String,
    color : String,
    x : String,
    y : String,
    cnt : String,
    edge : [String],
    isdel : Boolean,
    rating : String,
    user : String
});

var Board = mongoose.model('Board', boardSchema);

module.exports=Board;