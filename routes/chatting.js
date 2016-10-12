var mysql = require('../config/db/mysql'), // 디비 모듈화
    pool = mysql.pool,
    fs = require('fs'),
    mime = require('mime')
    
exports.index = function(req, res) {
    res.render('chat')
}

exports.download = function(req, res) {
    var fname =req.body.fname;
    console.log(fname)
    var paths = './file/'+fname
    mimetype = mime.lookup(paths)
    console.log(paths)
    console.log(mimetype)
    
    res.setHeader('Content-disposition', 'attachment; filename='+paths);
    console.log('2')
    res.setHeader('Content-type', mimetype)
    console.log('3')
    var filestream = fs.createWriteStream('/file/'+fname);
    filestream.pipe(res)
    console.log('4')
}