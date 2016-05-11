/**
 * Created by withGod on 5/4/16.
 */
var Board = require('../model/board_model');
var bodyParser = require('body-parser');

module.exports = function(app,io) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/api/board/:content', function(req, res) {

        Board.find({ content: req.params.content }, function(err, board) {
            if (err) throw err;

            res.send(board);
        });

    });

    app.get('/api/board/:id', function(req, res) {

        Board.findById({ _id: req.params.id }, function(err, board) {
            if (err) throw err;

            res.send(board);
        });

    });
    //replaceAll prototype 선언
    String.prototype.replaceAll = function(org, dest) {
        return this.split(org).join(dest);
    }
    app.post('/load', function(req, res) {
        Board.find({}, function(err, board) {
            if (err) throw err;
            for (i = 0; i < board.length; i++) {
                var obj = JSON.stringify(board[i]);
                var idea = JSON.parse(obj);
                io.emit('card created', idea.content,idea.ib,idea.color,idea.x,idea.y);
            }
        });
    });
    
    var jsonParser =bodyParser.json();
    app.post('/api/board', jsonParser,function(req, res) {

        if (req.params.id) {
            Board.findByIdAndUpdate(req.params.id, {content: req.body.content, ib:req.body.ib , color: req.body.color,x: req.body.x,y: req.body.y}, function(err, board) {
                if (err) throw err;
                //res.send('Success');
            });
        }
        else {

            var newBoard = Board({
                content: req.body.content,
                ib: req.body.ib,
                color: req.body.color,
                x: req.body.x,
                y: req.body.y,
            });
            newBoard.save(function(err) {
                if (err) throw err;
                //res.send('Success');
            });

        }
        res.render('board', {  Content: req.body.content });

    });

    app.delete('/api/board', function(req, res) {

        Board.findByIdAndRemove(req.body.ib, function(err) {
            if (err) throw err;
            res.send('Success');
        })

    });

}