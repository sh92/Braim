/**
 * Created by withGod on 5/4/16.
 */
var Board = require('../model/board_model');
var bodyParser = require('body-parser');

module.exports = function(app,io) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //내용 검색을 하는 소스
    app.get('/api/board/:content', function(req, res) {

        Board.find({ content: req.params.content }, function(err, board) {
            if (err) throw err;

            res.send(board);
        });

    });


    /**
     * 내용을 전부 가져오는 소스
     */
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

    /**
     * Ajax로 json형태로 값을 받는데, 동일한 id에 대한 값이 있으면 db의 값을 update를 하고, 있으면 저장을한다
     */
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

    /**
     * 삭제할 때사용
     */
    app.delete('/api/board', function(req, res) {

        Board.findByIdAndRemove(req.body.ib, function(err) {
            if (err) throw err;
            res.send('Success');
        })

    });

}