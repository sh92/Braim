/**
 * Created by withGod on 5/4/16.
 */
var Person = require('../model/person_model');
var bodyParser = require('body-parser');

module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/api/person/:username', function(req, res) {

        Person.find({ username: req.params.username }, function(err, person) {
            if (err) throw err;

            res.send(person);
        });

    });

    app.get('/api/person/:id', function(req, res) {

        Person.findById({ _id: req.params.id }, function(err, person) {
            if (err) throw err;

            res.send(person);
        });

    });

    app.post('/api/person', function(req, res) {

        if (req.params.id) {
            Person.findByIdAndUpdate(req.params.id, { user_id:req.body.user_id , username: req.body.username, password: req.body.password}, function(err, person) {
                if (err) throw err;
                //res.send('Success');
            });
        }
        else {

            var newPerson = Person({
                user_id: req.body.user_id,
                username: req.body.username,
                password: req.body.password
            });
            newPerson.save(function(err) {
                if (err) throw err;
                //res.send('Success');
            });

        }
        res.render('person', { ID: req.body.user_id, UserName: req.body.username });

    });

    app.delete('/api/person', function(req, res) {

        Person.findByIdAndRemove(req.body.user_id, function(err) {
            if (err) throw err;
            res.send('Success');
        })

    });

}