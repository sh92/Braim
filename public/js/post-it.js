/******************************************************************
 * post-it fucntion. j-query 2.2.1버전으로 작성됨.
 * ver0.1.1:setclick의 사용 없이 대화상자의 중복 생성을 막음.
 * ver 0.1 : 대화상자의 중복 생성을 막기 위해서 setclick이 true일 때만
 * 다이얼로그가 생성되도록 해놓음. 추후 css조작을 통해서 이를 해결 예정.
 ******************************************************************/
var socket = io();
var maxIdeaNum=0;
var from=0;
var to=[];

function isMaxNo(no) {

    if (no > maxIdeaNum) {
        maxIdeaNum = no;
        return true;
    }
    return false;
}


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
}

function findIdeaByNo(ideaNo){
    for(var i=0; i<ideaObjects.length; i++){
        if(ideaObjects[i].no == ideaNo)
            return ideaObjects[i];
    }
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
        socket.emit('request create card',content,maxIdeaNum,color,x,y,cnt,edge);
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

function moveXY(card,idea) {
    idea = findIdeaByNo(idea.no);
    idea.y  = card.style.top;
    idea.x = card.style.left;
    socket.emit('request moveXY', idea);
}

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
                '<h1>'+idea.no+': '+idea.content+'</h1>' +
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
            $("#from").text(from);
            alert("시작 지점 선택 : "+from);
            event.stopPropagation();
        }else{

            if(from==this.id){
                $(this).toggleClass('selected');
                alert("시작 지점 취소 : "+this.id);
                from=0;
                to = [];
                $("#from").text("지정 안됨");
                $("#to").text("지정 안됨");
                
            }else{
                if(contains(to,this.id)){
                     var done = confirm("연결 해제 하시겠습니까?");
                     if(done) {
                        alert("도착 지점 취소 : " + this.id);
                        to.splice($.inArray(this.id, to), 1);
                        $("#to").text(to);
                         applyEdge(this.id,"cancel");

                     }
                }else{
                     var done = confirm("연결 하시겠습니까?");
                     if(done){
                         to.push(this.id);
                         alert("도착 지점 선택 : "+to);
                        $("#to").text(to);
                         applyEdge(this.id,"add");

                     }
                }
            }

            event.stopPropagation();
            return;
        }
    });
}

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
function ideaUpdate(idea) {

    tempIdea = findIdeaByNo(idea.no);
    tempIdea.edge  = idea.edge;


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
        // 이미 만들어진 카드는 만들지 않기 위해 isMaxNo를 이용 이곳에서 실질적으로 데이터를 가져와 만들기도 하고, 새로운 값이 DB에 들어가면 화면상에 표시하기 위해 사용
        if(isMaxNo(idea.no)) {
            create_card(idea);
        }
    });

});
