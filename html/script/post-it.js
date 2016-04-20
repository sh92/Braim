var setclick = true;
var key_content;

function remove_dial(){
  $('#overlay').fadeOut(300, function(){ $(this).remove();});
  $('#card_dial').fadeOut(300, function(){ $(this).remove();});
  setclick=true;
}

function fo(){
  $('#anchor').find('#submit_key').click(function(){
    if(!setclick){
      key_content = $('#card_dial input').val();
      remove_dial();
    }
  });

  $('#anchor').find('#overlay').click(function(){
    if(!setclick){
      setclick=true;
      remove_dial();
    }
  });
}

$(document).ready(function () {
    $('#board_wrapper').on('click', function(e){
      if (setclick){
        $('#anchor').append('<div id="card_dial" style="top:'+e.pageY+'px; left:'+e.pageX+'px;"><input></input><div id="c_wrapper"><div id ="c1"></div><div id ="c2"></div><div id ="c3"></div><div id ="c4"></div><div id ="c5"></div></div><div id="submit_key">submit</div></div><div id="overlay"></div>');
        setclick=false;
      }
      fo();

    });
});
