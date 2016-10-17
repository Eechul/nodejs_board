var mysql = require('../config/db/mysql'), // 디비 모듈화
    pool = mysql.pool,
    fs = require('fs'),
    mime = require('mime')
    
exports.index = function(req, res) {
    res.render('chat')
}

exports.download = function(req, res) {
    var filename =req.params.fname;
    var typename = req.params.tname
    
    filename += "."+typename
    console.log(filename)
    var paths = 'D:/nodejs_board/public/file/'+filename
    
    var mimetype = mime.lookup(paths)
    console.log(mimetype);
    console.log(paths)
    console.log(mimetype)
    res.download(paths);
//    res.setHeader('Content-disposition', 'attachment; filename='+paths);
//    console.log('2')
//    res.setHeader('Content-type', mimetype)
//    console.log('3')
//    var filestream = fs.createWriteStream(paths);
//    filestream.pipe(res)
//    res.end();
}