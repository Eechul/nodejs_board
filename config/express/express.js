module.exports = function() {
    var express = require('express')
    var session = require('express-session')
    var MySQLStore = require('express-mysql-session')(session)
    var passport = require('passport')
    var bodyParser = require('body-parser')
    var ejs = require('ejs');
    var path = require('path');
    var app = express();
    app.locals.pretty = true;
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        store: new MySQLStore({
            host      : 'localhost',
            user      : 'root',
            password  : 'dongdb',
            database  : 'mysql',
            dateStrings:true
        })
    }))
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(passport.initialize())
    app.use(passport.session())
    
    return app
}
