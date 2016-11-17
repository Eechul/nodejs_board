var hasher  = require('../config/hasher/pbkfd2_password')()
var passport = require('passport')
// var LocalStrategy = require('passport-local').Strategy
var pool = require('../config/db/mysql').pool
var Promise = require('promise')

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
                <input type="submit" value="Log in"/>
                <a href="/auth/register">Register</a>
            </p>
            <p>
                <a href="/auth/facebook">Facebook Log in</a>

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
    if(req.user && req.user.NICKNAME_NM) {
        res.send(`
            <h1>Hello, ${req.user.NICKNAME_NM}
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
    var userCode = require('../config/etc/userCode').getUserCode(),
        email = req.body.username,
        pswd = req.body.password,
        nickname = req.body.nickname
    var user = {
        USER_CD : userCode,
        EMAIL_NM : email,
        SALT_CD : 0,
        PASSWORD_PW : pswd,
        NICKNAME_NM : nickname,
    } // 대문자로 한 이유는 DB와 네이밍을 일치하기 위함임
    console.log(user.USER_CD);
    // 중복이 없다면 해쉬 수행
    var hashAndSaltPromise = function() {
        return new Promise(function(resolve, reject) {
            console.log("1",user);
            hasher({password: user.PASSWORD_PW}, function(err, pass, salt, hash) {
                user.PASSWORD_PW = hash
                user.SALT_CD = salt
                resolve('first: hasher ')
            })
        })
    }

    var addUserPromise = function() {
        return new Promise(function(resolve, reject) {
            console.log("3");
            pool.getConnection(function(err, conn) {
                if(err) throw err
                var insertSql = 'INSERT INTO user_tb SET ?'
                conn.query(insertSql, user, function(err, result, fields) {
                    if(err) throw err
                })
                conn.release()
                resolve('second: insert db user information ')
            })
        })
    }
    hashAndSaltPromise()
    .then(addUserPromise)
    .then(function() {
        req.login(user, function() {
            return req.session.save( function() {
                res.redirect('/welcome')
            })
        })
    })
}
