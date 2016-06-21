var bodyParser = require('body-parser');
var turnQueue=[]
module.exports = function(app) {
	app.get('/board', function(req, res) {
		if(turnQueue.indexOf(req.user)!=-1){
			turnQueue.push(req.user);
		}
		res.render('board', { User : req.user});
	});
}
