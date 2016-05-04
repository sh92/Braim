var express = require('express');
var app = express();
var mongoose = require('mongoose');
var config =  require("./config");

//mongoose.connect('mongodb://localhost/passport_local_mongoose');
mongoose.connect(config.getDbConnectionString())




var htmlController = require('./controllers/htmlController');
var addCardController = require('./controllers/addCardController');
var setupController = require('./controllers/setupController');
var userController = require('./controllers/userController');
var boardController = require('./controllers/boardController');



var port = process.env.PORT || 3000;
app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


htmlController(app);
setupController(app);
userController(app);
boardController(app);

http = require("http").createServer(app);
var io = require('socket.io').listen(http);
addCardController(io);


io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(port, function(){
    console.log('listening on *:3000');
});

