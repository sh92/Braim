/**
 * Created by Sanghee on 5/4/16.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var personSchema = new Schema({
    user_id : String,
    username: String,
    password: String
});

var Person = mongoose.model('Person', personSchema);

module.exports=Person;
