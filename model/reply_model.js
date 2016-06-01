/**
 * Created by withGod on 5/18/16.
 */
/**
 * Created by withGod on 5/4/16.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var replySchema = new Schema({
    ib : String,
    reply : String,
    rating : String
});

var Reply = mongoose.model('Reply', replySchema);

module.exports=Reply;