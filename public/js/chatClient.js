var socket = io();

var user = {
    id : 0,
    nickname : 0
}
var user_list

var inputMsg = $("#inputMsg")
var fileUploadBox = $(".fileUploadBox")
// 엔터키 체크
function checkEnter() {
    if(event.keyCode === 13) {
        if(!fileUploadBox.is(":hidden")) {
            console.log(fileInfo)
            var storage_name = fileInfo.storage_name
            var type = fileInfo.type
            var size = fileInfo.size
            fileInfo.fileObj.forEach( function(v, i) {
                console.log("ccc",storage_name)
                var stream = ss.createStream()
                ss(socket).emit('file', stream, {name: storage_name[i], size: size[i] })
                ss.createBlobReadStream(v).pipe(stream)
                blobStream = ss.createBlobReadStream(v)
            })
        }
        if(inputMsg.val().length !== 1) {
                socket.emit('message', inputMsg.val())
                inputMsg.val("")
        } else {
            inputMsg.val("")
            $(".nickname").text("텍스트를 입력해 주십시오")
            $(".typingText").css("visibility", "visible")
            $(".nickname").css("visibility", "visible")
            setTimeout(function() {
                $(".typingText").css("visibility", "hidden")
                $(".nickname").css("visibility", "hidden")
            }, 1000) // 모듈화
        }     
    }
        return ;
    }    
// 실시간 키보드 체크
function checkKeyboard()  {
    // 입력 하면 바로바로 서버에 정보 전송
    socket.emit('keyboard typing',{ user: user })
}

$("#sendMsg").click(function() {   
    console.log(inputMsg.val());
    if(inputMsg.val().length !== 0) {
            socket.emit('message', inputMsg.val())
            inputMsg.val("")
            inputMsg.focus()
        } else {
            inputMsg.val("")
            inputMsg.focus();
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

socket.on('message', function(data) {
    var msg = data.msg
    var receive_user_info = data.user
    console.log(receive_user_info)
    var target
    if(receive_user_info.id === user.id) {
        target = ["my_content", "my_name", "my_message", user.nickname]
    } else {
        target = ["you_content", "you_name", "you_message", receive_user_info.nickname]
    }
    // 만약에 파일이 포함 되있다면
    // target 배열에 구분할만한 변수를 더 실고
    // 
    
    // 파일 없을때
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
    
    // 파일 있을때 
    // ** 코드으
})

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
