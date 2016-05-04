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

//
// app.use('/', function (req, res, next) {
//     console.log('Request Url:' + req.url);
//
//     // get all the users
//     Person.find({}, function(err, users) {
//         if (err) throw err;
//
//         // object of all the users
//         console.log(users);
//     });
//
//     next();
// });
