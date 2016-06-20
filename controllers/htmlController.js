var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app) {
	app.get('/board', function(req, res) {
		res.render('board', { User : req.user});
	});
}
