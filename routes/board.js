var mysql = require('../config/db/mysql'), // 디비 모듈화
    pool = mysql.pool
console.log(1);
// 이것만 되는 상태. connection pool 시험작업 완료
exports.index = function (req, res) {
    // console.log("id : ", req.params.id);
    if(req.params.id) {
        var id = req.params.id
        var updateSql= 'UPDATE board_tb SET HIT_CNT = HIT_CNT+1 WHERE BOARD_NO = '+id
        var selectSql = 'SELECT * FROM board_tb WHERE BOARD_NO = "'+id+'"'
            pool.getConnection(function(err, conn) {
                conn.query(updateSql, function(err, s, fields) {
                    if(err) throw err;
                    else {
                        conn.query(selectSql, function(err, board, fields) {
                            if(err) throw err;
                            else {
                                console.log("SUCCESS1", board[0])
                                res.render('board_view', board[0]);
                            }
                        })
                        console.log("SUCCESS2")
                    }
                    conn.release()
                })
            })
    }
    else {
        res.render('view')
    }
    //
    // res.render('view');
}

// exports.view = function(req, res) {
//
// }


//  conn.query(sql, function(err, boards, fields) {
//    var number = req.params.no;
//    if(number) {
//        var hitSql= 'update board_tb set hit = hit+1 where number= ?'
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
//          res.send(boards)
//          res.render('view', {boards:boards})

//      }
//    }
//  })
//}

exports.add = function(req, res) {
    res.render('add');
}


// /add
exports.addPost = function(req, res) {
    var todayDate = require('../config/dateFormat')
    var sql="insert into board(title, author, content, date) values(?, ?, ?, "+todayDate+"))";
    var title = req.body.title;
    var author = req.body.author;
    var content = req.body.content;
    // g와 i는 정규식
    // g : 발생할 모든 패턴에 대한 전역검색
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
// exports.index = function(req, res) {
//     var sql = 'select * from board_tb'
//     conn.query(sql, function(err, boards, fields) {
//         if(err) {
//             console.log(err)
//         }
//         else {
//             console.log(boards)
//         }
//     })
// }
// 좋아요 클릭 과정 sql
// select *
// from BOARD_LIKE_TB
// where board_no = ?
//     and user_cd = ?
//
//     존재하는 row 없다? => insert BOARD_LIKE_TB(board_no, user_no)
//      values(?, ?); [ like_fl 기본값 '1' (추천 상태)]
//     존재하는 row 있다?(다시눌럿다는건 취소를 말함) => update board_tb set like_fl = 0 where board_no = ? and user_cd = ?
//     존재하는 row있으면서 fl값 0이면 => update board_tb set like_fl = 1 where board_no = ? and user_cd = ?
//     간단하다..! 트랜젝션 적용해야함. 같이 변하게
