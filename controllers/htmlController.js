var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 * 전체적으로 라우팅해주는 곳
 * @param app
 */
module.exports = function(app) {

	
	app.get('/board', function(req, res) {
		res.render('board');
	});

	/* 현재 사용하지 않는 코드로 나중에 필요할 때 문법을 가져와서 사용 (추후 삭제 예정)
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
	 });*/

}
