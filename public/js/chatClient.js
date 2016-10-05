var socket = io();

var user = {
    id : 0,
    nickname : 0
}
var user_list
// 엔터키 체크
function checkEnter() {
    if(event.keyCode === 13) {
        if($("#inputMsg").val().length !== 1) {
            socket.emit('text message', $("#inputMsg").val())
            $("#inputMsg").val("")
        } else {
            $("#inputMsg").val("")
            $(".nickname").text("텍스트를 입력해 주십시오")
            $(".typingText").css("visibility", "visible")
            $(".nickname").css("visibility", "visible")
            setTimeout(function() {
                $(".typingText").css("visibility", "hidden")
                $(".nickname").css("visibility", "hidden")
            }, 1000) // 모듈화
        }
        return ;
    }    
}
// 실시간 키보드 체크
function checkKeyboard()  {
    // 입력 하면 바로바로 서버에 정보 전송
    socket.emit('keyboard typing',{ user: user })
}

$("#sendMsg").click(function() {   
    console.log($("#inputMsg").val());
    if($("#inputMsg").val().length !== 0) {
            socket.emit('text message', $("#inputMsg").val())
            $("#inputMsg").val("")
            $("#inputMsg").focus()
        } else {
            $("#inputMsg").val("")
            $("#inputMsg").focus();
            $(".nickname").text("텍스트를 입력해 주십시오")
            $(".typingText").css("visibility", "visible")
            $(".nickname").css("visibility", "visible")
            setTimeout(function() {
                $(".typingText").css("visibility", "hidden")
                $(".nickname").css("visibility", "hidden")
            }, 1000) // 모듈화
        }
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
    tagStr += '</div></div></div>'
    $('.view').append(tagStr) 
    $('.view').scrollTop(
        $('.view').prop('scrollHeight'))
    return false;
})
//
// 상대 타이핑 알림
socket.on('notice typing', function(data) {
    var typingNickname = data.user.nickname 
    var typingSocketId = data.user.id
    
    typingNickname += " 님이 타이핑 중..."
    if(user.id != typingSocketId) {
        $(".nickname").text(typingNickname)
        $(".typingText").css("visibility", "visible")
        $(".nickname").css("visibility", "visible")
        setTimeout(function() {
            $(".typingText").css("visibility", "hidden")
            $(".nickname").css("visibility", "hidden")
        }, 850) // 모듈화
    }
})


socket.emit('disconnect')
