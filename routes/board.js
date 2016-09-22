var mysql = require('mysql'),
    conn = mysql.createConnection({
      host      : 'localhost',
      user      : 'root',
      password  : 'dongdb',
      database  : 'mysql'
    })
conn.connect();

//app.get('/add', function (req, res) {
//  res.render('add'); // test
//});

exports.add = function(req, res) {
    res.render('add');
}

//
// /add
exports.addPost = function(req, res) {
    var todayDate = require('../config/dateFormat')
    var sql="insert into board(title, author, content, date) values(?, ?, ?, "+todayDate+"))";
    var title = req.body.title;
    var author = req.body.author;
    var content = req.body.content;
    // g와 i는 정규식
    // g : 발생할 모든 패턴에 대한 전역검색ㅜ
    // i : 대/소문자 구분안함
    conn.query(sql, [title, author, content], function(err, boards, fields){
        if(err) {
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        else {
            res.redirect('/board/');
        }
    })
}

//app.post('/add', function (req, res) {
//  var sql="insert into board(title, author, content, date) values(?, ?, ?, DATE_FORMAT(NOW(),'%m-%d-%Y'))";
//  var title = req.body.title;
//  var author = req.body.author;
//  var content = req.body.content;
//  // g와 i는 정규식
//  // g : 발생할 모든 패턴에 대한 전역검색ㅜ
//  // i : 대/소문자 구분안함
//  conn.query(sql, [title, author, content], function(err, boards, fields){
//    if(err) {
//      console.log(err);
//      res.status(500).send('Internal Server Error');
//    }
//    else {
//        res.redirect('/board/');
//    }
//  })
//});
//app.get('/delete/:number', function (req, res) {
//	var number = req.params.number;
//	var sql = 'delete from board where number = ?';
//	conn.query(sql, [number], function(err, board, fields) {
//		if(err) {
//   		console.log(err);
//    	res.status(500).send('Internal Server Error');
//    }
//    else {
//    	res.redirect('/board');
//    }
//	});
//});
exports.delete = function (req, res) {
	var number = req.params.number;
	var sql = 'delete from board where number = ?';
	conn.query(sql, [number], function(err, board, fields) {
		if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        else {
            res.redirect('/board');
        }
    });
}

//app.post('/edit', function (req, res) {
//  var sql = 'update board set title = ?, author = ?, content = ? where number = ?'
//  var number = req.body.number;
//  var title = req.body.title;
//  var author = req.body.author;
//  var content = req.body.content;
//
//  conn.query(sql, [title, author, content, number], function(err, board, fields) {
//  	if(err) {
//			console.log(err);
//			res.status(500).send('Internal Server Error');
//  	}
//  	else {
//  		console.log(board);
//  		res.redirect('/board/'+number);
//  	}
//  });
//});
exports.editPost = function (req, res) {
  var sql = 'update board set title = ?, author = ?, content = ? where number = ?'
  var number = req.body.number;
  var title = req.body.title;
  var author = req.body.author;
  var content = req.body.content;

  conn.query(sql, [title, author, content, number], function(err, board, fields) {
  	if(err) {
			console.log(err);
			res.status(500).send('Internal Server Error');
  	}
  	else {
  		console.log(board);
  		res.redirect('/board/'+number);
  	}
  });
}

//app.get('/edit/:number', function (req, res) {
//  var number = req.params.number;
//  var sql = 'select number,title,author,content,date,hit from board where number= ?'
//  conn.query(sql, [number], function(err, board, fields){
//    if(err) {
//      console.log(err);
//      res.status(500).send('Internal Server Error');
//    }
//    else {
//      console.log(board);
//      res.render('edit', {board:board[0]});
//    }
//  });
//});
exports.editView = function (req, res) {
  var number = req.params.number;
  var sql = 'select number,title,author,content,date,hit from board where number= ?'
  conn.query(sql, [number], function(err, board, fields){
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else {
      console.log(board);
      res.render('edit', {board:board[0]});
    }
  });
}

exports.index = function (req, res) {
  var sql='select * from board';
  conn.query(sql, function(err, boards, fields) {
    var number = req.params.number;
    if(number) {
        var hitSql= 'update board set hit = hit+1 where number= ?'
        conn.query(hitSql, [number], function(err, data, fields) {
          if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          }
          else {
            var sql = 'select number,title,author,content,date,hit from board where number =?'
            conn.query(sql, [number], function(err, board, fields){
              if(err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
              }
              else {
                res.render('content', {board:board[0]});
              }
            });
          }
        });
    }
    else{
      if(err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      else {
          console.log(boards)
          res.render('view', {boards:boards})
        
      }
    }
  });
}
// board main
//app.get(['/', '/:number'], function (req, res) {
//  var sql='select * from board';
//  conn.query(sql, function(err, boards, fields) {
//    var number = req.params.number;
//    if(number) {
//        var hitSql= 'update board set hit = hit+1 where number= ?'
//        conn.query(hitSql, [number], function(err, data, fields) {
//          if(err) {
//            console.log(err);
//            res.status(500).send('Internal Server Error');
//          }
//          else {
//            var sql = 'select number,title,author,content,date,hit from board where number =?'
//            conn.query(sql, [number], function(err, board, fields){
//              if(err) {
//                console.log(err);
//                res.status(500).send('Internal Server Error');
//              }
//              else {
//                res.render('content', {board:board[0]});
//              }
//            });
//          }
//        });
//    }
//    else{
//      if(err) {
//        console.log(err);
//        res.status(500).send('Internal Server Error');
//      }
//      else {
//          console.log(boards)
//          res.render('view', {boards:boards})
//        
//      }
//    }
//  });
//});
