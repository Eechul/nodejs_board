var socket = io();

var user = {
    id : 0,
    nickname : 0
}
var user_list

var msgData = {
    file : [],
    message : ""
}
var inputMsg = $("#inputMsg")
var fileUploadBox = $(".fileUploadBox")


function msgDataAndViewInit() {
    msgData.file = [];
    msgData.message = ""
    $(".fileUploadBox").empty()
    $(".fileUploadBox").css("display", "none")
    inputMsg.val("")
}
// 엔터키 체크
function checkEnter() {
    if(event.keyCode === 13 || event.click) {
        if(!fileUploadBox.is(":hidden")) {
            var storage_name = fileInfo.storage_name
            var type = fileInfo.type
            var size = fileInfo.size
            var upload_count = 0;
            var textMsg = inputMsg.val();
            fileInfo.fileObj.forEach( function(v, i) {
                var progress_size = 0;
                
                var stream = ss.createStream()
                console.log('st', storage_name)
                console.log('si', size)
                ss(socket).emit('file', stream, {name: storage_name[i], size: size[i] })
                console.log('v', v)
                blobStream = ss.createBlobReadStream(v)
                blobStream.pipe(stream);
                    
                blobStream.on('data', function(chunk) {
                    progress_size += chunk.length;
                    var per = Math.floor(progress_size / size[i] * 100)
                    if(per == 100) {
                        console.log(upload_count)
                        upload_count += 1;
                        if(upload_count === storage_name.length) {
                            msgData.file = storage_name
                            msgData.message = textMsg
                            socket.emit('message', {msgData: msgData})
                        }
                    }
                });
            })
            msgDataAndViewInit();
        } else {
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
    }
        return ;
    }    
// 실시간 키보드 체크
function checkKeyboard()  {
    // 입력 하면 바로바로 서버에 정보 전송
    socket.emit('keyboard typing',{ user: user })
}

$("#sendMsg").click(function() {   
    checkEnter();
//    console.log(inputMsg.val());
//    if(inputMsg.val().length !== 0) {
//            socket.emit('message', inputMsg.val())
//            inputMsg.val("")
//            inputMsg.focus()
//        } else {
//            inputMsg.val("")
//            inputMsg.focus();
//            $(".nickname").text("텍스트를 입력해 주십시오")
//            $(".typingText").css("visibility", "visible")
//            $(".nickname").css("visibility", "visible")
//            setTimeout(function() {
//                $(".typingText").css("visibility", "hidden")
//                $(".nickname").css("visibility", "hidden")
//            }, 1000) // 모듈화
//        }
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
    var msg, 
        file
    var receive_user_info = data.user
    var target
    if(receive_user_info.id === user.id) {
        target = ["my_content", "my_name", "my_message", user.nickname]
    } else {
        target = ["you_content", "you_name", "you_message", receive_user_info.nickname]
    }
    // 만약에 파일이 포함 되있다면
    if(!data.msg.file) {
        target.push(false)
        msg = data.msg
    } else {
        target.push(true)
        msg = data.msg.message
        file = data.msg.file
    }
    
    // 파일 있+없 소스코드 통합
    var tagStr = '<div class="'+target[0]+'">'
    tagStr += '<strong class="'+target[1]+'">'+target[3]+'</strong>'
    tagStr += '<div class="'+target[2]+'">'
    if(target[4]) {
        file.forEach( function(v, i) {
            var fileName = v
             console.log("4")
            var fileSrc = "./file/"+fileName
            tagStr +=  '<div class="image">'
            tagStr += '<img src="'+fileSrc+'" alt="'+fileName+'" class="receive_img" width="30%" height="100px;">'
            tagStr += '<div class="file_download">'
            tagStr += '<span><a href="#">'+fileName+'</a></span>'
            tagStr += '</div></div>'
        })
        
    }
    console.log('msg',typeof msg)
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
