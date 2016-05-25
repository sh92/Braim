/******************************************************************
 * post-it fucntion. j-query 2.2.1버전으로 작성됨.
 * ver0.1.1:setclick의 사용 없이 대화상자의 중복 생성을 막음.
 * ver 0.1 : 대화상자의 중복 생성을 막기 위해서 setclick이 true일 때만
 * 다이얼로그가 생성되도록 해놓음. 추후 css조작을 통해서 이를 해결 예정.
 ******************************************************************/
var socket = io();

/******************************************************************
 * 아이디어를 차례대로 중복없이 가져오기 위해 사용
 ******************************************************************/
var maxib=0;
var from=0;
var to=[];
function isMaxIb(ib) {

    if (ib > maxib) {
        maxib = ib;
        return true;
    }
    return false;
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

        //인풋의 내용을 key_content에 저장한다.
        x = obj.left+80;
        y = obj.top+50;
        //좌표의 중간 위치를 계산
        var cnt=0;
        var edge = [];
        //socket으로 card를 생성할 것을 요청
        socket.emit('request create card',content,maxib,color,x,y,cnt,edge);
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

function reply(e,ib) {
    var content = prompt("의견:","");
    if(content !== undefined && content !=null) {
        socket.emit('reply', ib, content);
    }
    e.stopPropagation();
}

function popupOpen(e,ib){
    var popUrl = "popup?ib="+ib+"";	//팝업창에 출력될 페이지 URL
    var popOption = "width=370, height=360, resizable=no, scrollbars=no, status=no;";    //팝업창 옵션(optoin)
    window.open(popUrl,"",popOption);
    e.stopPropagation();
}

function boundaryCard(e) {
    alert("아이디어 카드가 겹칩니다. 다른 곳을 지정해 주세요");

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

function moveXY(card,idea) {
    idea.y  = card.style.top;
    idea.x = card.style.left;
    socket.emit('request moveXY', idea);
}
/******************************************************************
 * 다이얼로그에 작성된 내용을 바탕으로 카드를 생성해주는 함수.
 * ideacards배열에 새 오브젝트를 생성하여 추가한다.
 * 이후에는 카드의 위치를 자동으로 배열해준다.
 ******************************************************************/
function create_card(idea){

    remove_dial();
    //$('#board_wrapper').append('<div class="boundary" onclick="createCard(event)" id="'+idea.ib+'"><div class="ideacard">' +
    $('#board_wrapper').append('<div  class="ideacard" id="'+idea.ib+'">' +
                '<div class="dragboard" id="d'+idea.ib+'"></div><div class="marker"></div>' +
                '<h1>'+idea.ib+': '+idea.content+'</h1>' +
                '<div class="bottom_idea">' +
                    '<input class="inline-block" type="button" value="의견보기" onclick="popupOpen(event,'+idea.ib+')"/>' +
                    '<input class="inline-block" type="button" value="의견입력" onclick="reply(event,'+idea.ib+')"/>' +
                    '<img class="good" src="assets/img/good.png" id="good'+idea.ib+'"/>' +
                    '<h3 id="cnt'+idea.ib+'" class="cntIb" >'+idea.cnt+'</h3>' +
                '</div>' +
            '</div>');
    $(".ideacard").draggable({handle: ".dragboard"});

    $('#board_wrapper').find('#'+idea.ib+' .marker').css('background',idea.color);
    $('#board_wrapper').find('#d'+idea.ib+'').mouseup(function() {
        moveXY(this.parentNode,idea);
    });
    place_card(idea);



    $('#'+idea.ib+'').find('#good'+idea.ib+'').click(function(){
        socket.emit('request update cnt', idea);
        event.stopPropagation();
    });
}


/******************************************************************
 * 해당카드를 빈 공간을 찾아 자동을 배치해주는 함수.
 * 아직 미구현.
 ******************************************************************/
function place_card(idea){
    $('#board_wrapper').find('#'+idea.ib+'').css('left',idea.x);
    $('#board_wrapper').find('#'+idea.ib+'').css('top',idea.y);
    $('#board_wrapper').find('#'+idea.ib+'').click(function(){

        if(from==0) {

            $(this).toggleClass('selected');
            from = this.id;
            $("#from").text(from);
            alert("시작 지점 정함 : "+from);
            event.stopPropagation();
        }else{

            if(from==this.id){
                $(this).toggleClass('selected');
                alert("시작지점 해제 : "+this.id);
                from=0;
                to = [];
                $("#from").text("지정 안됨");
                $("#to").text("지정 안됨");
            }else{
                if(contains(to,this.id)){
                    alert(this.id+" 연결 해제");
                    to.splice($.inArray(this.id, to),1);
                    $("#to").text(to);
                }else{
                    to.push(this.id);
                    alert("to: "+to);
                    $("#to").text(to);
                }
            }

            event.stopPropagation();
            return;
        }
    });
}

function applyEdge() {
    if(from==0){
        alert('card가 선택되지 않았습니다');
    }else {
        socket.emit("request EdgeAdd", from, to);
    }
}
function showEdge(){
    if(maxib<2){
        alert('edge가 없습니다');
    }else{
        socket.emit("request showEdge");
    }
}

function createEdge(idea) {
    for (var i = 0; i < idea.edge.length; i++) {


        var isAlredy = document.getElementById("'" + idea.edge[i] + 'edgeTo' + idea.ib + "'");
        if (isAlredy !== "undefined") {
            $("#" + idea.edge[i] + 'edgeTo' + idea.ib).remove();
        }


        $('#board_wrapper').append('<canvas  width="1000" height="800" id="' + idea.edge[i] + 'edgeTo' + idea.ib + '"></canvas>');

        $("#" + idea.edge[i] + 'edgeTo' + idea.ib).css('position', 'absolute');
        x = $('#board_wrapper').find('#' + idea.edge[i]).offset().left;
        y = $('#board_wrapper').find('#' + idea.edge[i]).offset().top


        fromX=parseInt(idea.x);
        fromY=parseInt(idea.y)
        toX=parseInt(x);
        toY=parseInt(y);

        var canvas = $("#" + idea.edge[i] + 'edgeTo' + idea.ib)[0];
        var ctx = canvas.getContext('2d');
        if(fromX<toX && fromY <toY){ // from이 왼쪽 위에 있을 때
            ArrowLineFunction(fromX+160,fromY-8,toX,toY-40,ctx);
        }else if(fromX<toX && fromY >toY){  // from이 왼쪽 아래 있을 때
            ArrowLineFunction(fromX+160,fromY-80,toX,toY-40,ctx);
        }else if(fromX>toX && fromY <toY){ // from이 오른쪽 위에 있을 때
            ArrowLineFunction(fromX+10,fromY-40,toX+80,toY-80,ctx);
        }else{ // from이 오른쪽 아래있거나 그 외
            ArrowLineFunction(fromX,fromY-40,toX+80,toY,ctx);
        }

        event.stopPropagation();
    }
}


function ArrowLineFunction(fromX,fromY,toX,toY,context) {
    function Line(x1,y1,x2,y2){
        this.x1=x1;
        this.y1=y1;
        this.x2=x2;
        this.y2=y2;
    }
    Line.prototype.drawWithArrowheads=function(ctx){

        // arbitrary styling
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


    }
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
    }
    // create a new line object
    var line=new Line(fromX,fromY,toX,toY);
    // draw the line
    line.drawWithArrowheads(context);
}
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

    socket.on('update cnt',function(idea){
        $('#'+idea.ib+'').find('#cnt'+idea.ib+'').text(idea.cnt);
    });

    socket.on('update XY',function(idea){
        $('#'+idea.ib+'').css({top: idea.y, left: idea.x});
    });

    socket.on('Apply Edge Success',function(idea){
        createEdge(idea);
    });

    socket.on('card created',function(idea){
        // 이미 만들어진 카드는 만들지 않기 위해 isMaxIb를 이용 이곳에서 실질적으로 데이터를 가져와 만들기도 하고, 새로운 값이 DB에 들어가면 화면상에 표시하기 위해 사용
        if(isMaxIb(idea.ib)) {
            create_card(idea);
            $('#'+idea.ib+'').find('#cnt'+idea.ib+'').text(idea.cnt);
        }
    });


});
