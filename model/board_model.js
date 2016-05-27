/**
 * Created by withGod on 5/4/16.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var boardSchema = new Schema({
    content : String,
    ib : String,
    color : String,
    x : String,
    y : String,
    cnt : String,
    edge : [String],
    isdel : Boolean
});

var Board = mongoose.model('Board', boardSchema);

module.exports=Board;