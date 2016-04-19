
/*
var Board = function( selector ) {
  var $elem = $( selector );

  function initialize() {
    $elem.on("click", newPostIt);
  };

  initialize();
};
*/
/*
var PostIt = function() {

  function initialize() {
    $("#board_wrapper").append('<div id="card_dial"><input></input><div id="c_wrapper"><div id ="c1"></div><div id ="c2"></div><div id ="c3"></div><div id ="c4"></div><div id ="c5"></div></div><div id="submit"></div></div>')
    $("#card_dial").css({'top': event.pageY, 'left': event.pageX});
  };

  function deletePostIt(e){
    e.stopPropagation();
    var $parent = $(this.parentElement.parentElement);
    $parent.remove();
  };

  initialize();
};
*/
var setclick = true;
var key_content;

$(document).ready(function () {

      $('#submit_key').on('click', function(e){
        key_content = $('#card_dial input').val();
        $('#overlay').fadeOut('slow');
        setclick=true;
      });

    $('#board_wrapper').on('click', function(e){
      if (setclick){
        $('#anchor').append('<div id="overlay"><div id="card_dial" style="top:'+e.pageY+'px; left:'+e.pageX+'px;"><input></input><div id="c_wrapper"><div id ="c1"></div><div id ="c2"></div><div id ="c3"></div><div id ="c4"></div><div id ="c5"></div></div><div id="submit_key">submit</div></div></div>');
        setclick=false;
      }
    });

});
/*
$(function() {
  new Board('#board_wrapper');
});

function newPostIt() {
  new PostIt;
  postNumber += 1;
};
*/
