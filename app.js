var express = require('express')
var bodyParser = require('body-parser')
var routes = require('./routes/index.js')

var path = require('path');

var fs = require('fs');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// 실험
var ss = require('socket.io-stream');

app.locals.pretty = true;
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

var name = 0 // 임시 아이디
var userInfo = {
    id : 0, // 소켓 아이디
    nickname: 0,
    users : [] 
    // 구조
//    {
//        id
//        nickname
//    }
} // 아이디 객체 리터럴

// 채팅 => 모듈화 필요
io.on('connection', function(socket) {
    console.log('a user connected')
    userInfo.id = socket.id
    
    userInfo.nickname = name
    var user = {
        id : socket.id,
        nickname : name
    }
    socket.nickname = name;
    
    userInfo.users.push(user) // 아이디 삽입
    name++
     // 아이디 1증가 (임시임)
    // 아이디를 클라이언트들에게 전송
     io.emit('user list', {user: userInfo})
    
    socket.on('message', function(data) {
          userInfo.users.forEach( function(value, index) {
            if(value.id === socket.id) {
                if(typeof data === "object") {
                    var msgData = data.msgData;
                    io.emit('message', {msg : msgData, user : value})
                    return false;
                } else {
                    io.emit('message', {msg : data, user : value})
                    return false;
                }
            }
          }) 
          return ;
    })
    
    socket.on('keyboard typing', function(data) {
        io.emit('notice typing', {user: data.user})
        return true
    })
    socket.on('disconnect', function() {
        console.log('user disconnected')
        userInfo.users.forEach( function(value, index) {
            if(value.id === socket.id) {
                userInfo.users.splice(index, 1)
                io.emit('user list', {user: userInfo})
                return true
            }
            return false
        })
        // 중복 메소드 => 모듈화
    })
    ss(socket).on('file', function(stream, data) {
       stream.pipe(fs.createWriteStream("public/file/"+data.name))
    })
})

// 게시판
app.get('/', routes.board.index);
app.get('/add', routes.board.add);
app.post('/add', routes.board.addPost);

// 채팅
app.get('/chat', routes.chatting.index)

// 인스타 테스트
app.get('/instar', routes.instar.index);
http.listen(4002, function () {
  console.log('Example app listening on port 4002!');
});
