var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * 전체적으로 라우팅해주는 곳
 * @param app
 */
module.exports = function(app) {

	
	app.get('/board', function(req, res) {
		res.render('board', { User : req.user});
	});


}
