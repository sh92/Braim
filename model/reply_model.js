var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var replySchema = new Schema({
    no : String,
    reply : String,
    rating : String,
    user : String
});

var Reply = mongoose.model('Reply', replySchema);

module.exports=Reply;