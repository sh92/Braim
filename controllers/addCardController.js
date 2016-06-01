/**
 * Created by withGod on 5/3/16.
 */
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Board = require('../model/board_model');

module.exports = function(app,io) {

    /******************************************************************
     * Database에 Ajax를 통해 비동기적으로 데이터를 저장해주는 소스
     ******************************************************************/
    function save_db(idea,how) {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3001/api/board');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            content: idea.content,
            ib: idea.ib,
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


    function save_Edge(ib, to,how) {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3001/api/edge');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            ib: ib,
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

    function find_Edge(ib) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3001/api/findEdge');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            ib: ib
        }));
    }



    /******************************************************************
     * 다이얼로그에 작성된 내용을 바탕으로 카드를 생성해주는 함수.
     * ideacards배열에 새 오브젝트를 생성하여 추가한다.
     * 이후에는 만들어진 카드의 값들을 다시 클라이언트로 넘겨준다.
     ******************************************************************/
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
        //접속이 되었을 때 환영 메시지를보냄.

        socket.on('send msg', function (msg) {
            console.log(msg);
            io.emit('receive msg', msg);
        });
        //메시지전송요청을 받으면, 해당 메시지를 전체에 브로드캐스팅.

        socket.on('request create card', function (content,ib,color,x,y,cnt,edge,rating) {
            var idea = Board({
                content: content,
                ib: ib,
                color: color,
                x: x,
                y: y,
                cnt: cnt,
                edge: edge,
                isdel : false,
                rating : "0.0"
            });
            idea.ib++;
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

        socket.on('request find edge', function (ib) {
            find_Edge(ib);
        });
        socket.on('request EdgeAdd', function (ib,to, how) {
            save_Edge(ib, to, how);
        });
        socket.on('request showEdge', function (ib,edge) {
            show_Edge();
        });
    });
}