var Board = require('../model/board_model');
var Reply = require('../model/reply_model');
var Account = require('../model/account_model');
var bodyParser = require('body-parser');

module.exports = function(app,io) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));


    /**
     * 해당 아이디어에 대해서 존재하면 Update 존재하지 않으면 생성을 한다
     */
    var jsonParser =bodyParser.json();
    app.post('/api/board', jsonParser,function(req, res) {
        var query={no:req.body.no};
        Board.findOne(query, function (err, findedboard){
            if (err) throw err;
            function shouldUpdate() {
                console.log(findedboard);
                return findedboard != null;
            }

            function addNumIdeaCount(num) {
                var query2 = {username: req.body.user};
                Account.findOne(query2, function (err, myaccount) {
                    if (err) throw err;
                    if (myaccount != null) {
                        var count = parseInt(myaccount.IdeaCount)+num;
                        var update2 = {username:req.body.user,IdeaCount: count};
                        Account.findOneAndUpdate(query2, update2, function (err, myaccount2) {
                            if (err) throw err;
                            io.emit('update IdeaCount', update2);
                        });

                    }
                });
            }

            if (shouldUpdate()) {
                var update = {content: req.body.content, no: req.body.no, color:req.body.color,x:req.body.x, y:req.body.y, cnt:req.body.cnt,edge:req.body.edge,isdel:req.body.isdel, rating: req.body.rating, user: req.body.user};
                if(req.body.isdel==true){
                    addNumIdeaCount(-1);
                }
                Board.findOneAndUpdate(query,update, function(err, board) {
                    if (err) throw err;
                    if(req.body.how =="moveXY") {
                        io.emit('update XY', update);
                    }
                });
            } else {
                addNumIdeaCount(1);
                var newBoard = Board({
                    content: req.body.content,
                    no: req.body.no,
                    color: req.body.color,
                    x: req.body.x,
                    y: req.body.y,
                    cnt: req.body.cnt,
                    edge: req.body.edge,
                    isdel:req.body.isdel,
                    rating: req.body.rating,
                    user: req.body.user
                });
                newBoard.save(function(err) {
                    if (err) throw err;
                    //res.send('Success');
                });
            }
        });

    });


    /**
     * 해당 아이디어에 대한 평가에 대한 내용을 가진 객체를 받아 생성을 하고 해당 아이디어 대해서 평점을 업데이트 한다
     */
    var jsonParser =bodyParser.json();
    app.post('/api/reply', jsonParser,function(req, res) {
        var newReply = Reply({
            no: req.body.no,
            reply: req.body.reply,
            rating: req.body.rating,
            user: req.body.user
        });
        newReply.save(function(err) {
            if (err) throw err;
        });

        var update ={no: req.body.no, rating:req.body.rating, user:req.body.user};
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

                var update = {content: idea.content, no: idea.no, color: idea.color,x:idea.x, y:idea.y, cnt:idea.cnt,edge : idea.edge,isdel: idea.isdel, rating: idea.rating, user: idea.user};
                Board.findOneAndUpdate(query,update, function(err, board2) {
                    if (err) throw err;
                    io.emit("update reply board", update);
                    res.render("success",{});
                });

            }
        });
    });

    /**
     * 아이디어간의 관계를 추가한다
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
                    Board.findOneAndUpdate(query,idea, function(err, board2) {
                        if (err) throw err;
                        io.emit("Apply Edge Success", idea);
                    });
                }

            });

    });


    /**
     * 해당 아이디어간의 관계를 보여준다
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
     * 특정 아이디어에 대해서 연결된 관계선을 전부 가져온다.
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
     * 아이디어에 대한 평가를 가져옴
     */
    app.get('/popup', function(req, res) {
        Reply.find({no:req.query.no}, function(err, board) {
            if (err) throw err;
            res.render('popup', { board:board});
        });
    });


    /**
     * 아이디어 평가에 대한 화면으로 라우팅
     */
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