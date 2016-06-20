var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Board = require('../model/board_model');

module.exports = function(app,io) {
    function save_db(idea,how) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3001/api/board');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            content: idea.content,
            no: idea.no,
            color: idea.color,
            x: idea.x,
            y: idea.y,
            cnt: idea.cnt,
            edge: idea.edge,
            isdel : idea.isdel,
            rating : idea.rating,
            how : how
        }));
    }


    function save_Edge(no, to,how) {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3001/api/edge');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            no: no,
            to: to,
            how :  how
        }));
    }

    function show_Edge() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3001/api/showEdge');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    }

    function find_Edge(no) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3001/api/findEdge');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            no: no
        }));
    }

    function create_card(idea) {
        how="create";
        save_db(idea,how);
        io.emit('card created', idea);
    }


    /******************************************************************
     * Socket 통신
     *******************************************************************/
    io.on('connection', function (socket) {
        io.sockets.connected[socket.id].emit('motd', "Welcome to chatroom");

        socket.on('send msg', function (msg) {
            console.log(msg);
            io.emit('receive msg', msg);
        });

        socket.on('request create card', function (content,no,color,x,y,cnt,edge,rating) {
            var idea = Board({
                content: content,
                no: no,
                color: color,
                x: x,
                y: y,
                cnt: cnt,
                edge: edge,
                isdel : false,
                rating : "0.0"
            });
            idea.no++;
            create_card(idea);
        });

        socket.on('request update cnt', function (idea) {
            idea.cnt++;
            how="cnt";
            save_db(idea,how);
            io.emit('update cnt', idea);
        });

        socket.on('request moveXY', function (idea) {
            how = "moveXY";
            save_db(idea,how);
        });

        socket.on('request removeIdea', function (idea) {
            idea.isdel=true;
            how ="remove";
            save_db(idea,how);
            io.emit('remove idea', idea);
        });

        socket.on('request find edge', function (no) {
            find_Edge(no);
        });
        socket.on('request EdgeAdd', function (no,to, how) {
            save_Edge(no, to, how);
        });
        socket.on('request showEdge', function (no,edge) {
            show_Edge();
        });
    });
}