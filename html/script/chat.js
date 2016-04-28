/**
 * Created by josanggyeong on 2016. 4. 28..
 */

socket.on('receive msg', function(msg) {
    $('#chat_list').append($('li').text(msg));
});

$('#send_msg').click(function () {
    socket.emit('send msg', $('#chat_msg').val());
    $('#chat_msg').val('');
});

$('#send_msg').on('keypress', function(event){
    if(event.keyCode == 13 && $('#chat_msg').val()!=''){
        socket.emit('send team msg',$('#chat_msg').val());
        $('#chat_msg').val('');
    }
});