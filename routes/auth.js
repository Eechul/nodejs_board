var hasher  = require('../config/hasher/pbkfd2_password')()
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var users = require('../config/db/model.js')()


exports.login = function(req, res) {
    var output = `
        <form action="/auth/login" method="post">
            <p>
                <input type="text" name="username" placeholder="username"/>
            </p>
            <p>
                <input type="password" name="password" placeholder="password"/>
            </p>
            <p>
                <input type="submit" value="로그인"/>
                <a href="/auth/register">가입</a>
            </p>
        </form>
    `;
    res.send(output);
}
exports.loginPost = passport.authenticate(
    'local',
    {
        successRedirect: '/welcome',
        failureRedirect: '/login',
        failureFlash: false
    }
)
// exports.loginPost = function(req, res) {
//     var uname = req.body.username,
//         pwd = req.body.password
//     var user
//     // 전체 유저의 아이디 비교해서
//     // 같으면, 유저정보에서 salt 가져와서 입력한 pwd와 암호화하고
//     // 그 결과가 유저정보의 pwd(hash)값과 같으면 로그인 성공
//     for(var i=0; i<users.length; i++) {
//         if(uname === users[i].username) {
//             user = users[i]
//             break;
//         }
//     }
//     if(!user) {
//         res.send('Who are you? <a href="/auth/login">login</a>');
//     } else {
//         return hasher({password: pwd, salt:user.salt}, function(err, pass, salt, hash) {
//             if(hash === user.password) {
//                 req.session.displayName = user.displayName;
//                 req.session.save(function(){
//                     res.redirect("/welcome");
//                 })
//             } else {
//                 res.send('Who are you? <a href="/auth/login">login</a>');
//             }
//         })
//     }
// }
 exports.welcome = function(req, res) {
    if(req.user && req.user.displayName) {
        res.send(`
            <h1>Hello, ${req.user.displayName}
            <a href="/auth/logout">logout</a>
            `);
    } else {
        res.send(`
            <h1>Welcome</h1>
            <a href="/auth/login">Login</a>
            `);
    }
 }

 exports.logout = function(req, res) {
    req.logout();
    req.session.save(function() {
        res.redirect('/welcome');
    })
 }

 exports.register = function(req, res) {
    res.render('auth/auth_register')
 }

// 이부분 다시
 exports.registerPost = function(req, res) {
    var user = {
        username : req.body.username,
        password : req.body.password,
        displayName :req.body.displayName
    }
    var userInfo
    for(var i=0; i<users.length; i++) {
        if(user.username === users[i].username) {
            userInfo = users[i]
            res.redirect('/auth/register')
        }
    }
    // 중복이 없다면 해쉬 수행
    if(!userInfo) {
        hasher({password: user.password}, function(err, pass, salt, hash) {
            user.password = hash
            user.salt = salt
            users.push(user) // 유저 추가
            res.redirect('/welcome')
        })
    }
 }
