/**
 * Created by withGod on 5/4/16.
 */
var Board = require('../model/board_model');
var Reply = require('../model/reply_model');
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
    app.get('/load', function(req, res) {
        Board.find({isdel:false}, function(err, board) {
            if (err) throw err;
            for (i = 0; i < board.length; i++) {
                var obj = JSON.stringify(board[i]);
                var idea = JSON.parse(obj);
                io.emit('card created', idea);
            }
        });
    });
    
    /**
     * 내용을 전부 가져오는 소스
     */
    app.post('/load', function(req, res) {
        Board.find({isdel:false}, function(err, board) {
            if (err) throw err;
            for (i = 0; i < board.length; i++) {
                var obj = JSON.stringify(board[i]);
                var idea = JSON.parse(obj);
                io.emit('card created', idea);
            }
        });
    });

    /**
     * Ajax로 json형태로 값을 받는데, 동일한 ib에 대한 값이 있으면 db의 값을 update를 하고, 있으면 저장을한다
     */
    var jsonParser =bodyParser.json();
    app.post('/api/board', jsonParser,function(req, res) {
        var query={ib:req.body.ib};
        Board.findOne({ ib: req.body.ib}, function (err, findedboard){
            if (err) throw err;
            if (findedboard!=null) {
                var update = {content: req.body.content, ib: req.body.ib, color:req.body.color,x:req.body.x, y:req.body.y, cnt:req.body.cnt,edge:req.body.edge,isdel:req.body.isdel}
                Board.findOneAndUpdate(query,update, function(err, board) {
                    if (err) throw err;
                    //res.send('Success');
                });
            } else {

                var newBoard = Board({
                    content: req.body.content,
                    ib: req.body.ib,
                    color: req.body.color,
                    x: req.body.x,
                    y: req.body.y,
                    cnt: req.body.cnt,
                    edge: req.body.edge,
                    isdel:req.body.isdel
                });
                newBoard.save(function(err) {
                    if (err) throw err;
                    //res.send('Success');
                });

            }
        });

    });


    /**
     * Ajax로 json형태로 reply를 받음
     */
    var jsonParser =bodyParser.json();
    app.post('/api/reply', jsonParser,function(req, res) {
        var newReply = Reply({
            ib: req.body.ib,
            reply: req.body.reply
        });
        newReply.save(function(err) {
            if (err) throw err;
            //res.send('Success');
        });
    });

    /**
     * Ajax로 json형태로 edge 받음
     */
    var jsonParser =bodyParser.json();
    app.post('/api/edge', jsonParser,function(req, res) {
        var query={ib:req.body.ib};
        Board.find(query, function(err, board) {
            for (var i = 0; i < board.length; i++) {
                var obj = JSON.stringify(board[i]);
                var idea = JSON.parse(obj);
                var update = {content: idea.content, ib: idea.ib, color: idea.color,x:idea.x, y:idea.y, cnt:idea.cnt,edge:req.body.edge}
                Board.findOneAndUpdate(query,update, function(err, board2) {
                    if (err) throw err;
                    //res.send('Success');
                });
                io.emit("Apply Edge Success", update);
            }

        });

    });


    /**
     * Ajax로 Edge들을 보여주기 위해 이렇게 사용
     */
    var jsonParser =bodyParser.json();
    app.get('/api/showEdge', jsonParser,function(req, res) {
        Board.find({}, function(err, board) {
            if (err) throw err;
            for (i = 0; i < board.length; i++) {
                var obj = JSON.stringify(board[i]);
                var idea = JSON.parse(obj);
                io.emit("Apply Edge Success", idea);
            }
        });
    });


    /**
     * 내용을 응답에 대해서 전부 가져오는 소스
     */
    app.get('/popup', function(req, res) {
        Reply.find({ib:req.query.ib}, function(err, board) {
            if (err) throw err;
            res.render('popup', { board:board});
        });
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