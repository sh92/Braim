var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config =  require("./config");
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy

mongoose.connect('mongodb://localhost/passport_local_mongoose');
//mongoose.connect(config.getDbConnectionString())


var htmlController = require('./controllers/htmlController');
var addCardController = require('./controllers/addCardController');
var setupController = require('./controllers/setupController');
var userController = require('./controllers/userController');
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


htmlController(app);
setupController(app);
userController(app);
accountController(app);

http = require("http").createServer(app);
var io = require('socket.io').listen(http);
boardController(app,io);
addCardController(io);



io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(port, function(){
    console.log('listening on *:3001');
});

process.on('uncaughtException', function (err) {
	console.log('Caught exception: ' + err);
});
