var postNumber = 0

var Board = function( selector ) {
  var $elem = $( selector );

  function initialize() {
    $elem.on("click", newPostIt);
  };

  initialize();
};

var PostIt = function() {

  function initialize() {
    $("#board").append('<div class="post-it" id="p'+postNumber+'"><div class="header"><a class ="close" id="c'+postNumber+'" href="#">X</a></div><div contenteditable="true" class="title"> 제 목</div><div contenteditable="true" class="content">아이디어</div></div>')
    $("#p"+postNumber).css({'top': event.pageY, 'left': event.pageX});
    $(".post-it").draggable({handle: ".header"});
    $(".title").on("click", stopPostItCreation);
    $(".content").on("click", stopPostItCreation);
    $(".close").on("click", deletePostIt);


  };

  function stopPostItCreation(e){
    e.stopPropagation();
  };

  function deletePostIt(e){
    e.stopPropagation();
    var $parent = $(this.parentElement.parentElement);
    $parent.remove();
  };

  initialize();
};

$(function() {
  new Board('#board');
});

function newPostIt() {
  new PostIt;
  postNumber += 1;
};
