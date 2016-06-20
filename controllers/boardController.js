var Board = require('../model/board_model');
var Reply = require('../model/reply_model');
var bodyParser = require('body-parser');

module.exports = function(app,io) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));


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
     * Ajax로 json형태로 값을 받는데, 동일한 no에 대한 값이 있으면 db의 값을 update를 하고, 있으면 저장을한다
     */
    var jsonParser =bodyParser.json();
    app.post('/api/board', jsonParser,function(req, res) {
        var query={no:req.body.no};
        Board.findOne({ no: req.body.no}, function (err, findedboard){
            if (err) throw err;
            function shouldUpdate() {
                return findedboard != null;
            }

            if (shouldUpdate()) {
                var update = {content: req.body.content, no: req.body.no, color:req.body.color,x:req.body.x, y:req.body.y, cnt:req.body.cnt,edge:req.body.edge,isdel:req.body.isdel, rating: req.body.rating}
                Board.findOneAndUpdate(query,update, function(err, board) {
                    if (err) throw err;
                    if(req.body.how =="moveXY") {
                        io.emit('update XY', update);
                    }
                });
            } else {

                var newBoard = Board({
                    content: req.body.content,
                    no: req.body.no,
                    color: req.body.color,
                    x: req.body.x,
                    y: req.body.y,
                    cnt: req.body.cnt,
                    edge: req.body.edge,
                    isdel:req.body.isdel,
                    rating: req.body.rating
                });
                newBoard.save(function(err) {
                    if (err) throw err;
                    //res.send('Success');
                });

            }
        });

    });


    /**
     * Post로 전달받은 것을 json형태로 reply를 받음
     */
    var jsonParser =bodyParser.json();
    app.post('/api/reply', jsonParser,function(req, res) {
        var newReply = Reply({
            no: req.body.no,
            reply: req.body.reply,
            rating: req.body.rating
        });
        newReply.save(function(err) {
            if (err) throw err;
        });

        var update ={no: req.body.no, rating:req.body.rating};
        var query={no:req.body.no};
        Board.find(query, function(err, board) {
            if (err) throw err;
            for (var i = 0; i < board.length; i++) {
                var obj = JSON.stringify(board[i]);
                var idea = JSON.parse(obj);
                var old =parseFloat(idea.rating)*parseFloat(idea.cnt);
                var newRating= parseFloat(req.body.rating)+0.0;

                var newCnt = parseFloat(idea.cnt)+1;

                idea.rating = Math.floor((old +newRating)*10 /(newCnt)) / 10 + 0.0;
                idea.cnt = newCnt;

                var update = {content: idea.content, no: idea.no, color: idea.color,x:idea.x, y:idea.y, cnt:idea.cnt,edge : idea.edge,isdel: idea.isdel, rating: idea.rating}
                Board.findOneAndUpdate(query,update, function(err, board2) {
                    if (err) throw err;
                    io.emit("update reply board", update);
                    res.render("success",{});
                });

            }
        });
    });

    /**
     * Ajax로 json형태로 edge 받음
     */
    var jsonParser =bodyParser.json();
        app.post('/api/edge', jsonParser,function(req, res) {
            var query={no:req.body.no};
            Board.find(query, function(err, board) {
                for (var i = 0; i < board.length; i++) {
                    var obj = JSON.stringify(board[i]);
                    var idea = JSON.parse(obj);
                    if(req.body.how == 'add') {
                        idea.edge.push(req.body.to);
                    }else if (req.body.how== 'cancel'){
                        io.emit("Remove edge", {});
                        idea.edge.splice(idea.edge.indexOf(req.body.to), 1);
                    }
                    // var update = {content: idea.content, no: idea.no, color: idea.color,x:idea.x, y:idea.y, cnt:idea.cnt,edge : idea.edge, isdel: idea.isdel, rating: idea.rating}
                    Board.findOneAndUpdate(query,idea, function(err, board2) {
                        if (err) throw err;
                        //res.send('Success');
                        io.emit("Apply Edge Success", idea);
                    });
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
     * from 으로 부터 to의 내용 가져옴
     */
    var jsonParser =bodyParser.json();
    app.post('/api/findEdge', jsonParser,function(req, res) {

        Board.find({no: req.body.no}, function(err, board) {
            if (err) throw err;
            for (i = 0; i < board.length; i++) {
                var obj = JSON.stringify(board[i]);
                var idea = JSON.parse(obj);
                io.emit("find edge", idea);
            }
        });
    });




    /**
     * 내용을 응답에 대해서 전부 가져오는 소스
     */
    app.get('/popup', function(req, res) {
        Reply.find({no:req.query.no}, function(err, board) {
            if (err) throw err;
            res.render('popup', { board:board});
        });
    });


    app.get('/reply', function(req, res) {
        res.render('reply', {no:req.query.no});
    });


    /**
     * 삭제할 때사용
     */
    app.delete('/api/board', function(req, res) {

        Board.findByIdAndRemove(req.body.no, function(err) {
            if (err) throw err;
            res.send('Success');
        })

    });

}