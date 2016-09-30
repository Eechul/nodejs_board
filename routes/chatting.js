var mysql = require('../config/db/mysql'), // 디비 모듈화
    pool = mysql.pool

exports.index = function(req, res) {
    res.render('chat')
}