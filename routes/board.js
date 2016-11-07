var mysql = require('../config/db/mysql') // 디비 모듈화
    pool = mysql.pool
// var mysql = require('mysql'),
//     pool = mysql.createPool({
//         // connectionLimit : 15,
//         host      : 'localhost',
//         user      : 'root',
//         password  : 'dongdb',
//         database  : 'mysql'
//     })
// 이것만 되는 상태. connection pool 시험작업 완료
// cursor = pool.cursor()
exports.index = function (req, res) {
    var id = req.params.id
    var updateSql= "UPDATE board_tb SET HIT_CNT = HIT_CNT+1 WHERE BOARD_NO=" +id
    var selectSql = "SELECT *, lpad(BOARD_NO, 5, '0') as 'FOMAT_BOARD_NO' "
        selectSql += "FROM board_tb WHERE BOARD_NO = "+id;
        pool.getConnection(function(err, conn) {
            if(!id) {
                var sql  = "SELECT lpad(BOARD_NO, 5, '0') as 'BOARD_NO', USER_CD, TITLE_NM, LIKE_CNT, CONTENT_TX, DATE_DT, HIT_CNT FROM board_tb"
                conn.query(sql, function(err, boards, fields) {
                    if(err) throw err;
                    else {
                        res.render('board_list', {boards : boards})
                    }
                })
            } else {
                conn.query(updateSql, function(err, s, fields) {
                    if(err) throw err;
                    else {
                        conn.query(selectSql, function(err, board, fields) {
                            if(err) throw err;
                            else {
                                console.log(board);
                                res.render('board_view', {board : board[0]});
                            }
                        })
                    }
                })
            }
            conn.release()
        })
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
    res.render('board_add');
}
//
//
// /add
exports.addPost = function(req, res) {
    // var todayDate = require('../config/dateFormat') 보류
    var sql = "insert into board_tb(TITLE_NM, USER_CD, CONTENT_TX) values(?, ?, ?)"
    var title = req.body.title;
    var author = req.body.author;
    var content = req.body.content;
    pool.getConnection( function(err, conn ) {
        conn.query(sql, [title, author, content], function(err, boards, fields){
            if(err) {
              console.log(err);
              res.status(500).send('Internal Server Error');
            }
            else {
                res.redirect('/board');
            }
        })
    })
}
// Add comment
exports.addComment = function(req, res) {
    var id = req.body.id,
    name = req.body.name,
    password = req.body.pswd,
    content = req.body.content;

    console.log(id, name, password, content);
    var comment_userInfo = {
        COMMENT_PASSWORD_TX: password,
        BOARD_NO: id,
        USER_CD: name,
        COMMENT_TX: content
    }
    // var comment_userInfo = [password, id, name, content]
    pool.getConnection(function(err, conn) {
        var insertSql = 'INSERT INTO board_comment_tb(COMMENT_PASSWORD_TX, BOARD_NO, USER_CD, COMMENT_TX) VALUES(?, ?, ?, ?)'
        conn.query(insertSql, [password, id, name, content], function(err, board, fields) {
            if(err) {
              console.log(err);
              res.status(500).send('Internal Server Error');
            }
            else {
                // res.render('board_view', {comment : comment_userInfo});
                res.send({result:comment_userInfo});
            }
        })
    })
    res.end()
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
// exports.delete = function (req, res) {
// 	var number = req.params.number;
// 	var sql = 'delete from board where number = ?';
// 	conn.query(sql, [number], function(err, board, fields) {
// 		if(err) {
//             console.log(err);
//             res.status(500).send('Internal Server Error');
//         }
//         else {
//             res.redirect('/board');
//         }
//     });
// }

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
// exports.editPost = function (req, res) {
//   var sql = 'update board set title = ?, author = ?, content = ? where number = ?'
//   var number = req.body.number;
//   var title = req.body.title;
//   var author = req.body.author;
//   var content = req.body.content;
//
//   conn.query(sql, [title, author, content, number], function(err, board, fields) {
//   	if(err) {
// 			console.log(err);
// 			res.status(500).send('Internal Server Error');
//   	}
//   	else {
//   		console.log(board);
//   		res.redirect('/board/'+number);
//   	}
//   });
// }

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
// exports.editView = function (req, res) {
//   var number = req.params.number;
//   var sql = 'select number,title,author,content,date,hit from board where number= ?'
//   conn.query(sql, [number], function(err, board, fields){
//     if(err) {
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//     }
//     else {
//       console.log(board);
//       res.render('edit', {board:board[0]});
//     }
//   });
// }
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
