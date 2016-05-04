/**
 * Created by withGod on 5/4/16.
 */
var Person = require('../model/person_model');
module.exports = function (app) {
    app.get('/api/setupPerson',function (req,res) {
        var starterPerson = [
            {
                user_id: "sang",
                username: "sang",
                password: "hee"
            },
            {
                user_id: "hang",
                username: "dd",
                password: "ttt"
            }
        ];
        Person.create(starterPerson,function (err,results) {
            res.send(results);
        });

    });
}
