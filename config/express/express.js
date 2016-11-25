module.exports = function() {
    var express = require('express'),
        session = require('express-session'),
        MySQLStore = require('express-mysql-session')(session),
        passport = require('passport'),
        bodyParser = require('body-parser'),
        ejs = require('ejs'),
        path = require('path'),
        app = express()
        multer = require('multer')


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
    app.use(multer({ dest: './uploads/'}))
    
    return app
}
