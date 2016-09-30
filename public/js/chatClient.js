var socket = io();
var user = {
    id : 0,
    nickname : 0
}
var user_list
function checkEnter() {
    if(event.keyCode === 13) {
        socket.emit('text message', $("#inputMsg").val())
        $("#inputMsg").val("")
        return ;
    } 
}
$("#sendMsg").click(function() {
    socket.emit('text message', $("#inputMsg").val())
    $("#inputMsg").val("")
    $("#inputMsg").focus()
    return ;
})

socket.on('user list', function(data) {
    user_list = data.user.users
    if(!user.id) {
        user.id = data.user.id
        user.nickname = data.user.nickname
        console.log("fh")
    }
    
    $(".list_item").empty()
    user_list.forEach( function(value) {
        if(user.nickname == value.nickname) {
            $(".list_item").append("<li>"+value.nickname+"(나)</li>")
        } else {
            $(".list_item").append("<li>"+value.nickname+"</li>")
        }
    })
    return false;
})

socket.on('text message', function(data) {
    var msg = data.msg
    var receive_user_info = data.user
    console.log(receive_user_info)
    var target
    if(receive_user_info.id === user.id) {
        target = ["my_content", "my_name", "my_message", user.nickname]
    } else {
        target = ["you_content", "you_name", "you_message", receive_user_info.nickname]
    }
    
    var tagStr = '<div class="'+target[0]+'">'
    tagStr += '<strong class="'+target[1]+'">'+target[3]+'</strong>'
    tagStr += '<div class="'+target[2]+'">'
    tagStr += '<div class="message">'
    tagStr += ""+msg
    tagStr += '</div>'
    tagStr += '</div>'
    tagStr += '</div>'
    $('.view').append(tagStr) 
    $('.view').scrollTop(
        $('.view').prop('scrollHeight'))
    return false;
})

socket.emit('disconnect')
