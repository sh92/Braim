var express = require('express');
var app = express();
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy

mongoose.connect('mongodb://localhost/ideadb');
//mongoose.connect(config.getDbConnectionString())

//controller 선언
var addCardController = require('./controllers/addCardController');
var boardController = require('./controllers/boardController');
var accountController = require('./controllers/accountController');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// passport config
app.use(passport.initialize());
app.use(passport.session());
var Account = require('./model/account_model');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


var port = process.env.PORT || 3001;
app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//controller 사용
accountController(app);

http = require("http").createServer(app);
var io = require('socket.io').listen(http);
boardController(app,io);
addCardController(app,io);



io.on('connection', function(socket){
    console.log('a user connected');

	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
	});
});

http.listen(port, function(){
    console.log('listening on *:3001');
});

process.on('uncaughtException', function (err) {
	console.log('Caught exception: ' + err);
});
