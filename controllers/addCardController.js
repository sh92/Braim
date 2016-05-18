/**
 * Created by withGod on 5/3/16.
 */
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(app,io) {

    /******************************************************************
     * Database에 Ajax를 통해 비동기적으로 데이터를 저장해주는 소스
     ******************************************************************/
    function save_db(content,ib,color,x,y,cnt) {

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3001/api/board');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            content: content,
            ib: ib,
            color: color,
            x: x,
            y: y,
            cnt: cnt
        }));
    }

    /******************************************************************
     * 다이얼로그에 작성된 내용을 바탕으로 카드를 생성해주는 함수.
     * ideacards배열에 새 오브젝트를 생성하여 추가한다.
     * 이후에는 만들어진 카드의 값들을 다시 클라이언트로 넘겨준다.
     ******************************************************************/
    function create_card(parent,content,ib,color,x,y,cnt){
        ideacards.push(new ideacard(null,content,color,cnt));
        //var ib = 'ib'+ideacards[ideacards.length-1].keyId;
        save_db(content,ib,color,x,y,cnt);
        io.emit('card created', content,ib,color,x,y,cnt);
    }



    /******************************************************************
     * Socket 통신
     *******************************************************************/
    io.on('connection', function(socket){
        io.sockets.connected[socket.id].emit('motd',"Welcome to chatroom");
        //접속이 되었을 때 환영 메시지를보냄.

        socket.on('send msg', function(msg){
            console.log(msg);
            io.emit('receive msg', msg);
        });
        //메시지전송요청을 받으면, 해당 메시지를 전체에 브로드캐스팅.

        socket.on('request create card',function(parent,content,ib,color,x,y,cnt){
            ib++;
            create_card(parent, content,ib,color,x,y,cnt);
        });

        socket.on('request update cnt',function(parent,content,ib,color,x,y,cnt){
            cnt++;
            save_db(content,ib,color,x,y,cnt);
            io.emit('update cnt', content,ib,color,x,y,cnt);
        });

    });





    /** 이 아래있는 코드는  지금은 사용하지 않는 코드이지만, 부모 자식간의 관계를 나타낼 때 참고용 (추후 삭제 예정)**/
    /******************************************************************
     * 프로그램 메인 코드
     ******************************************************************/

    var ideacards = []; //키워드(문장)의 내용이 저장될 변수.
    var key_id = 0;

    /******************************************************************
     * keyword의 클래스.
     * 부모 오브젝트, 값, 칼라, id, 깊이값을 속성으로 갖는다.
     ******************************************************************/
    function ideacard(p,v,c){
        this.parentKey = p;
        this.keyValue = v;
        this.keyColor = c;
        this.keyId = get_key_id();
        this.diff = get_key_diff();
        /****************************************************************
         * keyword의 깊이를 구해주는 메소드.
         * 재귀적으로 부모 오브젝트를 따라 올라가면서 갯수를 체크함.
         ****************************************************************/
        function get_key_diff(){
            if (this.parentKey == null){
                return 1;
            }
            else {
                return 1 + get_key_diff(this.parentKey);
            }
        }
        /******************************************************************
         * keyword의 id를 지정해주는 메소드.
         * 실질적으로는 데이터베이스와의 연동을 통해서 값을 받아와야함.
         * 현재는 데모의 구현을 위해 임시로 전역변수의 값을 변동시킴.
         ******************************************************************/
        function get_key_id(){
            return (++key_id)-1;
        }
    }

}