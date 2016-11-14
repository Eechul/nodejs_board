var app = require('./config/express/express.js')()
var passport = require('./config/passport/passport')(app)
// var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var hasher = require('./config/hasher/pbkfd2_password')()
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
var ss = require('socket.io-stream');
var routes = require('./routes/index.js')



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
    // 아이디를 클라이언트들에게 전송 (사용자 리스트갱신)
    io.emit('user list', {user: userInfo})

    // message 이벤트를 받으면 메세지 전송 준비와 전송
    socket.on('message', function(data) {
          userInfo.users.forEach( function(value, index) {
            // 유저중에 한명이 보냈다면
            if(value.id === socket.id) {
                // 메세지가 파일일 경우.
                if(typeof data === "object") {
                    var msgData = data.msgData;
                    console.log("msgData", msgData)
                    io.emit('message', {msg : msgData, user : value})
                    return false;
                }
                // 메세지가 text일 경우
                else {
                    //console.log("msgData", msgData)
                    io.emit('message', {msg : data, user : value})
                    return false;
                }
            }
          })
          return ;
    })

    // 클라이언트 유저가 키보드 타이핑 이벤트를 발생 할 시 반응
    socket.on('keyboard typing', function(data) {
        io.emit('notice typing', {user: data.user})
        return true
    })

    // 클라이언트가 종료 될때 발생되는 이벤트
    socket.on('disconnect', function() {
        console.log('user disconnected')
        userInfo.users.forEach( function(value, index) {
            // 기존 유저 확인 후
            if(value.id === socket.id) {
                // 유저를 로컬데이터에서 삭제
                userInfo.users.splice(index, 1)
                io.emit('user list', {user: userInfo})
                return true
            }
            return false
        })
        // 중복 메소드 => 모듈화
    })

    // 파일을 업로드 이벤트
    ss(socket).on('file', function(stream, data) {
       // 파일을 서버에 내려받
        stream.pipe(fs.createWriteStream("public/file/"+data.name))
    })
})
// 로그인 라우터 test 단계
app.get('/auth/login', routes.auth.login)
// app.post('/auth/login', routes.auth.loginPost)
app.post(
    '/auth/login',
    passport.authenticate(
        'local',
        {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login',
            failureFlash: false
            // 인증에 실패할때 메세지를 한번 보여줌
        }
    )
    // function(req,res) {
    //     req.session.save(function() {
    //         res.redirect('/welcome')
    //     })
    // }
)
app.get('/welcome', routes.auth.welcome)
app.get('/auth/logout', routes.auth.logout)
app.get('/auth/register', routes.auth.register)
app.post('/auth/registerPost', routes.auth.registerPost)

// 게시판 라우터
app.get('/board/list', routes.board.index);
app.get('/board/list/:id', routes.board.view);

app.get('/board/search', routes.board.search)

app.get('/add', routes.board.add);
app.post('/add', routes.board.addPost);

app.get('/board/edit/:id', routes.board.edit)
app.get('/board/del/:id', routes.board.delete);

app.post('/board/edit', routes.board.editPut)
app.get('/comment/:id', routes.board.comment)


// ajax 라우터
// comment ajax routes
app.post('/ajax/comment', routes.board.addComment);
// like routes
app.post('/ajax/like', routes.board.addLike);

// 채팅 라우터
// app.get('/chat', routes.chatting.index)
// app.get('/chat/download/:fname/:tname', routes.chatting.download)

// 인스타 테스트
// app.get('/instar', routes.instar.index);
http.listen(4002, function () {
  console.log('Example app listening on port 4002!');
});
