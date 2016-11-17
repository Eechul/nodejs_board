module.exports = function(app) {
    var pool = require('../db/mysql').pool
    var passport = require('passport')
    var LocalStrategy = require('passport-local').Strategy
    var FacebookStrategy = require('passport-facebook').Strategy;
    var hasher = require('../hasher/pbkfd2_password')()
    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser(function(user, done) {
        console.log("serializeUser", "시리얼라이즈유저");
        done(null, user.USER_CD);
    })
    passport.deserializeUser(function(id, done) {
        pool.getConnection(function(err, conn) {
            var selectSql = 'SELECT * FROM user_tb'
            conn.query(selectSql, function(err, users, fields) {
                for(var i =0; i<users.length; i++) {
                    var user = users[i]
                    if(user.USER_CD === id) {
                        console.log("deserializeUser", "디시리얼라이즈유저");
                        done(null, user);
                    }
                }
            })
        })
    })
    passport.use(new LocalStrategy(
        function(username, password, done) {
            var uname = username,
                pwd = password
            // 전체 유저의 아이디 비교해서
            // 같으면, 유저정보에서 salt 가져와서 입력한 pwd와 암호화하고
            // 그 결과가 유저정보의 pwd(hash)값과 같으면 로그인 성공
            pool.getConnection(function(err, conn) {
                var selectSql = 'SELECT * FROM user_tb WHERE EMAIL_NM = ?'
                conn.query(selectSql, uname, function(err, users, fields) {
                    var user = users[0]
                    if(err) throw err // 쿼리문 에러 출력
                    else if(!user){ // user 존재하지 않을때,
                        done(null, false);
                    } else { // user 존재할때
                        return hasher({password: pwd, salt:user.SALT_CD}, function(err, pass, salt, hash) {
                            if(hash == user.PASSWORD_PW) {
                                console.log('5');
                                done(null, user)
                            } else {
                                console.log('6');
                                done(null, false)
                            }
                        })
                    }
                })
            })
        }
    ))

    passport.use(new FacebookStrategy({
        clientID: "184229931975831",
        clientSecret: "a7bd585609e6f42f289a45ad9e8671da",
        callbackURL: "http://localhost:4002/auth/facebook/callback",
        profileFields: ['email'] //This

    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        var user = {
            USER_CD : profile.id,
            EMAIL_NM :'D'
        }
    }));

    return passport
}
