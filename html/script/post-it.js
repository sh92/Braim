/******************************************************************
 * post-it fucntion. j-query 2.2.1버전으로 작성됨.
 * ver0.1.1:setclick의 사용 없이 대화상자의 중복 생성을 막음.
 * ver 0.1 : 대화상자의 중복 생성을 막기 위해서 setclick이 true일 때만
 * 다이얼로그가 생성되도록 해놓음. 추후 css조작을 통해서 이를 해결 예정.
 ******************************************************************/

var ideacards = []; //키워드(문장)의 내용이 저장될 변수.
var key_id = 0;
var tmp_color;


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

/******************************************************************
 * 다이얼로그 삭제 기능. 페이드아웃후 해당 오브젝트를 제거하도록 작동함.
 ******************************************************************/
function remove_dial(){
  $('#overlay').fadeOut(300, function(){ $(this).remove();});
  $('#card_dial').fadeOut(300, function(){ $(this).remove();});
  setclick=true;
}

/******************************************************************
 * dialouge내부의 버튼들을 활성화하기 위한 함수.
 * 기본 구성은 #anchor안에서 submit_key오브젝트와 overlay오브젝트를 찾아서
 * 클릭 이벤트를 지정시켜준다.
 ******************************************************************/
function fun_in_dial(){
  $('#anchor').find('#submit_key').click(function(){
    key_content = $('#card_dial input').val();
    //인풋의 내용을 key_content에 저장한다.
    create_card(null,key_content,tmp_color);
    remove_dial();
  });

  $('#anchor').find('#overlay').click(function(){
    remove_dial();
  });

  $('#anchor').find('#c1').click(function(){
    tmp_color = '#d12823';
  });
  $('#anchor').find('#c2').click(function(){
    tmp_color = '#d18623';
  });
  $('#anchor').find('#c3').click(function(){
    tmp_color = '#65d123';
  });
  $('#anchor').find('#c4').click(function(){
    tmp_color = '#2378d1';
  });
  $('#anchor').find('#c5').click(function(){
    tmp_color = '#d123b5';
  });
}

/******************************************************************
 * 다이얼로그에 작성된 내용을 바탕으로 카드를 생성해주는 함수.
 * ideacards배열에 새 오브젝트를 생성하여 추가한다.
 * 이후에는 카드의 위치를 자동으로 배열해준다.
 ******************************************************************/
function create_card(parent,content,color){
  ideacards.push(new ideacard(null,content,color));
  var thisCard = ideacards[ideacards.length-1];
  var ib = 'ib'+thisCard.keyId;
  $('#board_wrapper').append('<div class="ideacard" id="'+ib+'"><div class="marker"></div><h1>'+thisCard.keyValue+'</h1></div>');
  $('#board_wrapper').find('#'+ib+' .marker').css('background',thisCard.keyColor);
  //place_card(ib);
}


/******************************************************************
 * 해당카드를 빈 공간을 찾아 자동을 배치해주는 함수.
 * 아직 미구현.
 ******************************************************************/
function place_card(card){
  $('.ideacard').click(function(){
    $(this).toggleClass('selected');
  });


}

$(document).ready(function () {
  /**************************************************************
   * board_wrapper의 영역에서 클릭한 곳에 다이얼로그를 열어준다.
   **************************************************************/
  $('#board_wrapper').on('click', function(e){
    $('#anchor').append('<div id="card_dial" style="top:'+e.pageY+'px; left:'+e.pageX+'px;"><input></input><div id="c_wrapper"><div id ="c1"></div><div id ="c2"></div><div id ="c3"></div><div id ="c4"></div><div id ="c5"></div></div><div id="submit_key">submit</div></div><div id="overlay"></div>');
    fun_in_dial();
  });

});
