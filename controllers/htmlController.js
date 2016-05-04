var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app) {

	app.get('/person/:user_id', function(req, res) {
		res.render('person', { ID: req.params.id, Qstr: req.query.qstr });
	});

	app.post('/person', urlencodedParser, function(req, res) {
		res.send('Thank you!');
		console.log(req.body.username);
		console.log(req.body.password);
	});

	var jsonParser =bodyParser.json();
	app.post('/personjson', jsonParser, function(req, res) {
		res.send('Thank you for Json!');
		console.log(req.body.username);
		console.log(req.body.password);
	});

	app.get('/board', function(req, res) {
		res.render('board');
	});

	app.post('/boardjson', jsonParser, function(req, res) {
		res.send('Thank you for Json!');
		console.log(req.body.content);
	});

}
