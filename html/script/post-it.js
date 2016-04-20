/******************************************************************
 * post-it fucntion. j-query 2.2.1버전으로 작성됨.
 * ver 0.1 : 대화상자의 중복 생성을 막기 위해서 setclick이 true일 때만
 * 다이얼로그가 생성되도록 해놓음. 추후 css조작을 통해서 이를 해결 예정.
 ******************************************************************/

var setclick = true; //ture 일때만 다이얼로그 생상 가능.
var key_content; //키워드(문장)의 내용이 저장될 변수.

/******************************************************************
 * 다이얼로그 삭제 기능. 페이드아웃후 해당 오브젝트를 제거하도록 작동함.
 ******************************************************************/
function remove_dial(){
  $('#overlay').fadeOut(300, function(){ $(this).remove();});
  $('#card_dial').fadeOut(300, function(){ $(this).remove();});
  setclick=true;
}

/******************************************************************
 * 페이드아웃 시키기 위한 함수.
 * 기본 구성은 #anchor안에서 submit_key오브젝트와 overlay오브젝트를 찾아서
 * 클릭 이벤트를 지정시켜준다.
 * setclick이 false일 때만 작동함.
 ******************************************************************/
function fo(){
  $('#anchor').find('#submit_key').click(function(){
    if(!setclick){
      key_content = $('#card_dial input').val();
      //인풋의 내용을 key_content에 저장한다.
      remove_dial();
    }
  });

  $('#anchor').find('#overlay').click(function(){
    if(!setclick){
      remove_dial();
    }
  });
}



$(document).ready(function () {
    /**************************************************************
     * board_wrapper의 영역에서 클릭한 곳에 다이얼로그를 열어준다.
     * setclick이 true일 때만 작동함.
     **************************************************************/
    $('#board_wrapper').on('click', function(e){
      if (setclick){
        $('#anchor').append('<div id="card_dial" style="top:'+e.pageY+'px; left:'+e.pageX+'px;"><input></input><div id="c_wrapper"><div id ="c1"></div><div id ="c2"></div><div id ="c3"></div><div id ="c4"></div><div id ="c5"></div></div><div id="submit_key">submit</div></div><div id="overlay"></div>');
        setclick=false;
      }
      fo();

    });
});
