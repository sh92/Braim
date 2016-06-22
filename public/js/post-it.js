var socket = io();
var maxIdeaNum=0;
var from=0;
var to=[];
var userlistforCount=[];

/******************************************************************
 * 이미 만들어진 카드는 만들지 않기 위해 isMaxNo를 이용
 ******************************************************************/
function isMaxNo(no) {

    if (parseInt(no) > maxIdeaNum) {
        maxIdeaNum = parseInt(no);
        return true;
    }
    return false;
}

/******************************************************************
 * 클라이언트와 서버간의 동기화
 ******************************************************************/
var ideaObjects = [];
function ideaClass(idea){
        this.no = idea.no;
        this.color = idea.color;
        this.x = idea.x;
        this.y = idea.y;
        this.cnt = idea.cnt;
        this.edge = idea.edge;
        this.isdel = idea.isdel;
        this.rating = idea.rating;
        this.content = idea.content;
        this.user = idea.user;
}

function findIdeaByNo(ideaNo){
    for(var i=0; i<ideaObjects.length; i++){
        if(ideaObjects[i].no == ideaNo)
            return ideaObjects[i];
    }
}
function ideaUpdate(idea) {

    tempIdea = findIdeaByNo(idea.no);
    tempIdea.edge  = idea.edge;
}
/******************************************************************
 * 다이얼로그 삭제 기능. 페이드아웃후 해당 오브젝트를 제거하도록 작동함.
 ******************************************************************/
function remove_dial(){
    $('#overlay').fadeOut(300, function(){ $(this).remove();});
    $('#card_dial').fadeOut(300, function(){ $(this).remove();});
}

/******************************************************************
 * dialouge내부의 버튼들을 활성화하기 위한 함수.
 * 기본 구성은 #anchor안에서 submit_key오브젝트와 overlay오브젝트를 찾아서
 * 클릭 이벤트를 지정시켜 준다.
 ******************************************************************/

function fun_in_dial() {
    var color;

    $('#anchor').find('#submit_key').click(function (e) {
        var obj = $('#anchor').find('#card_dial').offset();
        var content = $('#card_dial input').val();

        x = obj.left+80;
        y = obj.top+50;
        //좌표의 중간 위치를 계산
        var cnt=0;
        var edge = [];
        create_card_db(content,maxIdeaNum,color,x,y,cnt,edge);
    });

    /******************************************************************
     *  색을 지정해줌
     ******************************************************************/

    $('#anchor').find('#overlay').click(function () {
        remove_dial();
    });
    $('#anchor').find('#c1').click(function () {
        color= '#d12823';
    });
    $('#anchor').find('#c2').click(function () {
        color= '#d18623';
    });
    $('#anchor').find('#c3').click(function () {
        color= '#65d123';
    });
    $('#anchor').find('#c4').click(function () {
        color='#2378d1';
    });
    $('#anchor').find('#c5').click(function () {
        color= '#d123b5';
    });
}

/******************************************************************
 * 아이디어 평가에 대한 소스
 ******************************************************************/

function reply(e,no) {
    var popUrl = "reply?no="+no+"";	//팝업창에 출력될 페이지 URL
    var popOption = "width=370, height=360, resizable=no, scrollbars=no, status=no;";    //팝업창 옵션(optoin)
    window.open(popUrl,"",popOption);
    e.stopPropagation();
}

function popupOpen(e,no){
    var popUrl = "popup?no="+no+"";	//팝업창에 출력될 페이지 URL
    var popOption = "width=370, height=360, resizable=no, scrollbars=no, status=no;";    //팝업창 옵션(optoin)
    window.open(popUrl,"",popOption);
    e.stopPropagation();
}



function contains(array, obj) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}

/******************************************************************
 * 아이디어 움직임
 ******************************************************************/
function moveXY(card,idea) {
    idea = findIdeaByNo(idea.no);
    idea.y  = card.style.top;
    idea.x = card.style.left;
    socket.emit('request moveXY', idea);
}
/******************************************************************
 * 아이디어 삭제
 ******************************************************************/
function removeIdea(idea){
    var remove  =confirm("아이디어를 삭제하시겠습니까");
    if(remove){
        socket.emit('request removeIdea', idea);
    }
}
/******************************************************************
 * 다이얼로그에 작성된 내용을 바탕으로 카드를 생성해주는 함수.
 * ideacards배열에 새 오브젝트를 생성하여 추가한다.
 * 이후에는 카드의 위치를 자동으로 배열해준다.
 ******************************************************************/
function create_card(ideaData){

    ideaObjects.push(new ideaClass(ideaData));
    var len = ideaObjects.length;
    var idea = ideaObjects[len-1];

    remove_dial();
    $('#board_wrapper').append('<div  class="ideacard" id="'+idea.no+'">' +
                '<div class="dragboard" id="d'+idea.no+'"></div>' +
                '<div class="marker"></div>' +
                '<a class="close" id="close'+idea.no+'" href="#">X</a>'+
                '<h1>'+idea.user+': '+idea.content+'</h1>' +
                '<div class="bottom_idea">' +
                    '<input class="inline-block" type="button" value="의견입력" onclick="reply(event,'+idea.no+')"/>' +
                    '<input class="inline-block" type="button" value="의견보기" onclick="popupOpen(event,'+idea.no+')"/>' +
                    '<h3 id="rating'+idea.no+'" class="rating inline-block" >'+idea.rating+'</h3>' +
                '</div>' +
            '</div>');
    $(".ideacard").draggable({handle: ".dragboard"});

    $('#board_wrapper').find('#'+idea.no+' .marker').css('background',idea.color);
    $('#board_wrapper').find('#d'+idea.no+'').mouseup(function() {
        moveXY(this.parentNode,idea);
    });
    $('#board_wrapper').find('#close'+idea.no+'').click(function() {
        removeIdea(findIdeaByNo(idea.no));
        event.stopPropagation();
    });
    place_card(idea);


}


/******************************************************************
 * 해당카드를 빈 공간을 찾아 자동을 배치해주는 함수.
 * 아직 미구현.
 ******************************************************************/
function place_card(idea){
    idea = findIdeaByNo(idea.no);
    $('#board_wrapper').find('#'+idea.no+'').css('left',idea.x);
    $('#board_wrapper').find('#'+idea.no+'').css('top',idea.y);
    $('#board_wrapper').find('#'+idea.no+'').click(function(){
        if(from==0) {
            $(this).toggleClass('selected');
            from = this.id;
            findEdge(from);
            alert("카드를 선택하셨습니다! 연결할 카드를 선택하세요");
            event.stopPropagation();
        }else{

            if(from==this.id){
                $(this).toggleClass('selected');
                alert("카드 선택 취소!")
                from=0;
                to = [];
            }else{
                if(contains(to,this.id)){
                     var done = confirm("연결 해제 하시겠습니까?");
                     if(done) {
                         alert("연결을 해제 하였습니다");
                        to.splice($.inArray(this.id, to), 1);
                         applyEdge(this.id,"cancel");

                     }
                }else{
                     var done = confirm("연결 하시겠습니까?");
                     if(done){
                         to.push(this.id);
                         // alert("도착 지점 선택 : "+to);
                         alert("연결할 카드를 선택하셨습니다.");
                        // $("#to").text(to);
                         applyEdge(this.id,"add");

                     }
                }
            }

            event.stopPropagation();
            return;
        }
    });
}

/******************************************************************
 * 아이디어간의 관계선에 대한 소스
 ******************************************************************/
function findEdge(no){
    socket.emit("request find edge", no);
}
function applyEdge(appliedTo, how) {
    if(from==0){
        alert('card가 선택되지 않았습니다');
    }else {
        socket.emit("request EdgeAdd", from, appliedTo, how);
    }
}

function showEdge(){
    if(maxIdeaNum>1){
        socket.emit("request showEdge");
    }
}

function removeEdge() {
    $('#board_wrapper').find(".edgeGroup").remove();
}
function removeEdgeNo(no) {
    $('#board_wrapper').find(".edgeClass"+no+"").remove();
}

function createEdge(idea) {
    removeEdgeNo(idea.no);
    if (idea.edge != null) {
        for (var i = 0; i < idea.edge.length; i++) {

            var isAlredy = document.getElementById("'" + idea.edge[i] + 'edgeTo' + idea.no + "'");
            if (isAlredy !== "undefined") {
                $("#" + idea.edge[i] + 'edgeTo' + idea.no).remove();
            }


            $('#board_wrapper').append('<canvas  width="1000" height="800" class="edgeGroup edgeClass' + idea.no + '" id="' + idea.edge[i] + 'edgeTo' + idea.no + '"></canvas>');

            $("#" + idea.edge[i] + 'edgeTo' + idea.no).css('position', 'absolute');
            x = $('#board_wrapper').find('#' + idea.edge[i]).offset().left;
            y = $('#board_wrapper').find('#' + idea.edge[i]).offset().top


            fromX = parseInt(idea.x);
            fromY = parseInt(idea.y)
            toX = parseInt(x);
            toY = parseInt(y);

            var canvas = $("#" + idea.edge[i] + 'edgeTo' + idea.no)[0];
            var ctx = canvas.getContext('2d');
            if (fromX < toX && fromY < toY) { // from이 왼쪽 위에 있을 때
                ArrowLineFunction(fromX + 160, fromY - 8, toX, toY - 80, ctx);
            } else if (fromX < toX && fromY > toY) {  // from이 왼쪽 아래 있을 때
                ArrowLineFunction(fromX + 160, fromY - 80, toX, toY - 10, ctx);
            } else if (fromX > toX && fromY < toY) { // from이 오른쪽 위에 있을 때
                ArrowLineFunction(fromX, fromY - 10, toX + 160, toY - 80, ctx);
            } else { // from이 오른쪽 아래있거나 그 외
                ArrowLineFunction(fromX, fromY - 80, toX + 160, toY -10, ctx);
            }

        }
    }
    event.stopPropagation();
}


function ArrowLineFunction(fromX,fromY,toX,toY,context) {
    function Line(x1,y1,x2,y2){
        this.x1=x1;
        this.y1=y1;
        this.x2=x2;
        this.y2=y2;
    }
    Line.prototype.drawWithArrowheads=function(ctx){

        ctx.strokeStyle="yellow";
        ctx.fillStyle="yellow";
        ctx.lineWidth=1;

        // draw the line
        ctx.beginPath();
        ctx.moveTo(this.x1,this.y1);
        ctx.lineTo(this.x2,this.y2);
        ctx.stroke();

        // draw the starting arrowhead
       /* var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
        startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/180;
        this.drawArrowhead(ctx,this.x1,this.y1,startRadians);*/

        // draw the ending arrowhead
        var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
        endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/180;
        this.drawArrowhead(ctx,this.x2,this.y2,endRadians);


    };
    Line.prototype.drawArrowhead=function(ctx,x,y,radians){
        ctx.save();
        ctx.beginPath();
        ctx.translate(x,y);
        ctx.rotate(radians);
        ctx.moveTo(0,0);
        ctx.lineTo(5,20);
        ctx.lineTo(-5,20);
        ctx.closePath();
        ctx.restore();
        ctx.fill();
    };
    // create a new line object
    var line=new Line(fromX,fromY,toX,toY);
    // draw the line
    line.drawWithArrowheads(context);
}

/******************************************************************
 * 백그라운드 설정
 ******************************************************************/
function client_background_change(no) {
    switch(no) {
        case 1:
            $('#board_wrapper').css("background-image", "url('assets/img/braim.png')");
            break;
        case 2:
            $('#board_wrapper').css("background-image", "url('assets/img/scrum.png')");
            break;
        case 3:
            $('#board_wrapper').css("background-image", "url('assets/img/bucket.png')");
            break;
        case 4:
            $('#board_wrapper').css("background-image", "url('assets/img/retrospect.png')");
            break;
        case 5:
            $('#board_wrapper').css("background-image", "url('assets/img/retrospect2.png')");
            break;

        case 6:
            $('#board_wrapper').css("background-image", "url('assets/img/bm-canvas.jpg')");
            break;
        case 7:
            $('#board_wrapper').css("background-image", "url('assets/img/note.png')");
            break;


        default:
            $('#board_wrapper').css("background-image", "url('asserts/img/braim.png')");
    }
}

/******************************************************************
 * 소켓 통신
 ******************************************************************/
$(document).ready(function () {
    /**************************************************************
     * board_wrapper의 영역에서 클릭한 곳에 다이얼로그를 열어준다.
     **************************************************************/
    $('#board_wrapper').on('click', function(e){

        $('#anchor').append('<div id="card_dial" style="top:'+(e.pageY-100)+'px; left:'+(e.pageX-160)+'px;">' +
                '<input/>'+
                '<div id="c_wrapper">' +
                    '<div id ="c1"></div><div id ="c2"></div><div id ="c3"></div><div id ="c4"></div><div id ="c5"></div>' +
                '</div>' +
                '<div id="submit_key">submit</div>' +
            '</div>' +
            '<div id="overlay"></div>');

        fun_in_dial();
    });


    socket.on('remove idea',function(idea){
        ideaUpdate(idea);
        $('#'+idea.no+'').remove();
    });

    socket.on('update XY',function(idea){
        ideaUpdate(idea);
        $('#'+idea.no+'').css({top: idea.y, left: idea.x});
        showEdge();
    });
    
    socket.on('Remove edge',function(){
        removeEdge();
    });

    socket.on('find edge',function(idea){
        ideaUpdate(idea);
        to = idea.edge;
        $("#to").text(to);
    });
    socket.on('Apply Edge Success',function(idea){
        ideaUpdate(idea);
        createEdge(idea);
    });


    socket.on('update reply board',function(idea){
        ideaUpdate(idea);
        $('#'+idea.no+'').find('#rating'+idea.no+'').text(idea.rating);
    });

    socket.on('card created',function(idea){

        if(isMaxNo(idea.no)) {
            create_card(idea);
        }
    });
    socket.on('background changed',function(no){
        client_background_change(no);
    });

    socket.on('update IdeaCount', function(account){
        if(contains(userlistforCount,account.username)){
            var removeLI = document.getElementById("ideaFor"+account.username);
            removeLI.parentNode.removeChild(removeLI);
            var ul = document.getElementById("userIdeaCount");
            var li = document.createElement("li");
            li.setAttribute("id","ideaFor"+account.username);
            var p = document.createElement("p");
            p.textContent=account.username+":"+account.IdeaCount;
            li.appendChild(p);
            ul.appendChild(li);
        }
    });

    socket.on('show IdeaCount', function(account){
        if(contains(userlistforCount,account.username)){

        }else {
            userlistforCount.push(account.username);
            var ul = document.getElementById("userIdeaCount");
            var li = document.createElement("li");
            li.setAttribute("id","ideaFor"+account.username);
            var p = document.createElement("p");
            p.textContent = account.username + ":" + account.IdeaCount;
            li.appendChild(p);
            ul.appendChild(li);
            ul.style.visibility="hidden";
        }
    });


});
