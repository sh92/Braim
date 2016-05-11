/******************************************************************
 * post-it fucntion. j-query 2.2.1버전으로 작성됨.
 * ver0.1.1:setclick의 사용 없이 대화상자의 중복 생성을 막음.
 * ver 0.1 : 대화상자의 중복 생성을 막기 위해서 setclick이 true일 때만
 * 다이얼로그가 생성되도록 해놓음. 추후 css조작을 통해서 이를 해결 예정.
 ******************************************************************/

var socket = io();

var maxib=0;

function isMaxIb(ib) {

    if (ib >= maxib) {
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
 * 클릭 이벤트를 지정시켜준다.
 ******************************************************************/
function fun_in_dial(color) {
    var color;

    $('#anchor').find('#submit_key').click(function (e) {
        var obj = $('#anchor').find('#card_dial').offset();
        var key_content = $('#card_dial input').val();

        //인풋의 내용을 key_content에 저장한다.
        x = obj.left + 100;
        y = obj.top + 50;
        //좌표의 중간 위치를 계산
        maxib++;
        console.log("@"+maxib);

        socket.emit('request create card', null, key_content, maxib ,color,x,y);
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
 * 다이얼로그에 작성된 내용을 바탕으로 카드를 생성해주는 함수.
 * ideacards배열에 새 오브젝트를 생성하여 추가한다.
 * 이후에는 카드의 위치를 자동으로 배열해준다.
 ******************************************************************/
function create_card(content,ib,color,x,y){

    remove_dial();
    $('#board_wrapper').append('<div class="ideacard" id="'+ib+'"><div class="marker"></div><h1>'+content+'</h1></div>');
    $('#board_wrapper').find('#'+ib+' .marker').css('background',color);
    place_card(ib,x,y);
}


/******************************************************************
 * 해당카드를 빈 공간을 찾아 자동을 배치해주는 함수.
 * 아직 미구현.
 ******************************************************************/
function place_card(card,x,y){
    $('.ideacard').click(function(){
        $(this).toggleClass('selected');
    });
    $('#board_wrapper').find('#'+card+'').css('left',x);
    $('#board_wrapper').find('#'+card+'').css('top',y);
}

$(document).ready(function () {
    /**************************************************************
     * board_wrapper의 영역에서 클릭한 곳에 다이얼로그를 열어준다.
     **************************************************************/
    $('#board_wrapper').on('click', function(e){

        $('#anchor').append('<div id="card_dial" style="top:'+e.pageY+'px; left:'+e.pageX+'px;"><input/><div id="c_wrapper"><div id ="c1"></div><div id ="c2"></div><div id ="c3"></div><div id ="c4"></div><div id ="c5"></div></div><div id="submit_key">submit</div></div><div id="overlay"></div>');

        fun_in_dial();
    });


    socket.on('card created',function(content,ib,color,x,y){
        console.log(ib);
        console.log(maxib);
        if(isMaxIb(ib)){
            console.log(maxib);
            create_card(content, ib, color, x, y);
        }
    });

});
