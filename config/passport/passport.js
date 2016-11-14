module.exports = function(app) {
    var users = require('../db/model.js')()
    var passport = require('passport')
    var LocalStrategy = require('passport-local').Strategy
    var hasher = require('../hasher/pbkfd2_password')()
    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser(function(user, done) {
        console.log("serializeUser", "시리얼라이즈유저");
        done(null, user.username);
    })
    passport.deserializeUser(function(id, done) {
        for(var i=0; i<users.length; i++) {
            if(id === users[i].username) {
                var user = users[i]
                console.log("deserializeUser", "디시리얼라이즈유저");
                done(null, user)
            }
        }
    })
    passport.use(new LocalStrategy(
        function(username, password, done) {
            var uname = username,
                    pwd = password
                var user
                // 전체 유저의 아이디 비교해서
                // 같으면, 유저정보에서 salt 가져와서 입력한 pwd와 암호화하고
                // 그 결과가 유저정보의 pwd(hash)값과 같으면 로그인 성공
                for(var i=0; i<users.length; i++) {
                    if(uname === users[i].username) {
                        user = users[i]
                        break;
                    }
                }
                if(!user) {
                    done(null, false)
                } else {
                     return hasher({password: pwd, salt:user.salt}, function(err, pass, salt, hash) {
                        if(hash === user.password) {
                            done(null, user)
                        } else {
                            done(null, false)
                        }
                    })
                }
        }
    ))
    console.log("1111");
    return passport
}
