var mysql = require('../config/db/mysql') // 디비 모듈화
    pool = mysql.pool
exports.index = function(req, res) {
    var offset = req.query.offset,
        max =  req.query.max
    pool.getConnection(function(err, conn) {
        var sql  = "SELECT lpad(BOARD_NO, 5, '0') as 'BOARD_NO', USER_CD, TITLE_NM, LIKE_CNT, CONTENT_TX, DATE_DT, HIT_CNT FROM board_tb ORDERS LIMIT 2"
        // LIMIT 2는 곧 동적으로 바뀔것임
        var boardCountSql = "SELECT NUMBERING_NO FROM board_count_number_tb WHERE NAME_NM = 'board_tb'"
        // conn.query(sql, function(err, boards, fields) {
            if(!offset && !max) {
                // 게시판 리스트 출력
                conn.query(sql, function(err, boards, fields) {
                    if(err) throw err;
                    else {
                        conn.query(boardCountSql, function(err, number, fields) {
                            if(err) throw err;
                            else {
                                res.render('board_list', {boards : boards, number: number[0]})
                            }
                        })
                    }
                })
            } else {
                // 페이징일때
                var paggingSql  = "SELECT lpad(BOARD_NO, 5, '0') as 'BOARD_NO', USER_CD, TITLE_NM, LIKE_CNT, CONTENT_TX, DATE_DT, HIT_CNT FROM board_tb ORDERS LIMIT "+offset+","+max
                conn.query(paggingSql, function(err, boards, fields) {
                    if(err) throw err;
                    else {
                        conn.query(boardCountSql, function(err, number, fields) {
                            if(err) throw err;
                            else {
                                res.render('board_list', {boards : boards, number: number[0]})
                            }
                        })
                    }
                })
            }
    conn.release()
    })
}
exports.view = function (req, res) {
    var id = req.params.id
    var boardUpdateSql= "UPDATE board_tb SET HIT_CNT = HIT_CNT+1 WHERE BOARD_NO=" +id
    var boardSelectSql = "SELECT *, lpad(BOARD_NO, 5, '0') as 'FOMAT_BOARD_NO' "
        boardSelectSql += "FROM board_tb WHERE BOARD_NO = "+id;
        // 회원정보 추가 될 때, boardSelectSql 대신에 밑에 코드 삽입 필요
        // SELECT *, lpad(BOARD_NO, 5, '0') as 'FOMAT_BOARD_NO', LIKE_FL
        // FROM board_tb , board_like_tb
        // WHERE board_tb.BOARD_NO = board_like_tb.BOARD_NO
        //  AND	BOARD_NO = '00018' AND  USER_CD = /*유저세션비교*/
    var commentSelectSql = "SELECT * FROM board_comment_tb WHERE BOARD_NO = "+id
        pool.getConnection(function(err, conn) {
                conn.query(boardUpdateSql, function(err, s, fields) {
                    if(err) throw err;
                    else {
                        conn.query(boardSelectSql, function(err, board, fields) {
                            if(err) throw err;
                            else {
                                var sql = "SELECT * FROM board_comment_tb WHERE BOARD_NO = ?"
                                conn.query(commentSelectSql, function(err, comments, fields) {
                                    if(err) throw err;
                                    else {
                                        // 여기서 like_FL 정보를 뿌린다
                                        res.render('board_view', {board : board[0], comments : comments});

                                    }
                                })

                            }
                        })
                    }
                })
            conn.release()
        })
}
// add
exports.add = function(req, res) {
    res.render('board_add');
}
// add Post
exports.addPost = function(req, res) {
    // var todayDate = require('../config/dateFormat') 보류
    var sql = "INSERT INTO board_tb(TITLE_NM, USER_CD, CONTENT_TX) VALUES(?, ?, ?)"
    var addCountSql = "UPDATE board_count_number_tb SET NUMBERING_NO = NUMBERING_NO + 1 WHERE NAME_NM = 'board_tb'"
    var title = req.body.title;
    var author = req.body.author;
    var content = req.body.content;
    pool.getConnection( function(err, conn ) {
        conn.query(sql, [title, author, content], function(err, boards, fields){
            if(err) throw err;
            else {
                conn.query(addCountSql, function(err, numbering, fields){
                    res.redirect('/board/list');
                })
            }
        conn.release()
        })
    })
}
exports.search = function(req, res) {
    var search_title = Number(req.query.search_title),
        keyword = req.query.keyword,
        page = req.query.page
    pool.getConnection( function(err, conn) {
        if(!page) {
            // 검색햇는데 페이징은 아닐때(검색 초기화면)
            // TITLE 1 번호
            // TITLE 2 제목 (기본값)
            // TITLE 3 제목+내용
            // TITLE 4 작성자
            var sql;
            switch (search_title) {
                case 0:
                    sql = "SELECT * FROM board_tb WHERE BOARD_NO LIKE '%"+keyword+"%'"
                    break;
                case 1:
                    sql = "SELECT * FROM board_tb WHERE TITLE_NM LIKE '%"+keyword+"%' "
                    break;
                case 2:
                    sql = "SELECT * FROM board_tb WHERE CONTENT_TX LIKE '%"+keyword+"%' OR TITLE_NM = '%"+keyword+"%'"
                    break;
                case 3:
                    sql = "SELECT * FROM board_tb WHERE USER_CD LIKE '%"+keyword+"%'"
                    break;
                default:
                    console.error("error: 검색 value값 불일치");
                    res.end();
                    break;
            }
            // if(search_title === 3) {
            //     keyword = [keyword, keyword];
            // }
            conn.query(sql, function(err, result, fields) {
                if(err) throw err;
                else {
                    res.render('board_list', {boards : result})
                }

            })
        } else {
            // 검색해서 페이징일때, 추후에 함
        }
        conn.release()
    })
}
// Add comment
exports.addComment = function(req, res) {
    var id = req.body.id,
    name = req.body.name,
    password = req.body.pswd,
    content = req.body.content;
    var comment_userInfo = {
        COMMENT_PASSWORD_TX: password,
        BOARD_NO: id,
        USER_CD: name,
        COMMENT_TX: content
    }
    // var comment_userInfo = [password, id, name, content]
    console.log("1");
    pool.getConnection(function(err, conn) {
        console.log("2");
        var insertSql = 'INSERT INTO board_comment_tb(COMMENT_PASSWORD_TX, BOARD_NO, USER_CD, COMMENT_TX) VALUES(?, ?, ?, ?)'
        conn.query(insertSql, [password, id, name, content], function(err, board, fields) {
            console.log("3")
            if(err) throw err;
            else {
                console.log("4");
                var selectSql = "SELECT * FROM board_comment_tb WHERE BOARD_NO = ?"
                conn.query(selectSql, [id], function(err, board, fields) {
                    res.send({result : true});
                });
                // res.render('board_view', {comment : comment_userInfo});
            }
        })
    })
}
// Count like_number
exports.addLike = function(req, res) {
    var board_id = req.body.id
    // var sessionInfo = session
    pool.getConnection(function(err, conn) {
        var updateSql = "UPDATE board_tb SET LIKE_CNT = LIKE_CNT+1 WHERE BOARD_NO ="+id
        // 만약 세션에 유저가 있다면 좋아요 기능을 수행 할 수 있게 해야함
        var selectLikeSql = "SELECT BOARD_NO, USER_CD, LIKE_FL FROM board_like_tb WHERE BOARD_NO = ? AND USER_CD = ?"
        coon.query(selectLikeSql, [board_id, (세션)], function(err, likes, fields) {
            var like = likes[0];
            //만약에 , 좋아요 내역이 존재한다면
            if(like) {
                //좋아요가 눌려있지 않다면,
                if(!like.LIKE_FL) {
                    // like.LIKE_FL를 '1'로 UPDATE
                    var updateYesLikeSql = "UPDATE board_like_tb SET LIKE_FL = 1 WHERE BOARD_NO = ? AND USER_CD = ?"
                    conn.query(updateYesLikeSql, [board_id, (세션)], function(err, fields){
                        res.send({result : true, like : true})
                    })
                } else {
                    //만약에 좋아요가 눌려있다면,
                    // like.LIKE_FL를 '0'로 UPDATE
                    var updateNoLikeSql = "UPDATE board_like_tb SET LIKE_FL = 0 WHERE BOARD_NO = ? AND USER_CD = ?"
                    conn.query(updateNoLikeSql, [board_id, (세션)], function(err, fields){
                        res.send({result : true, like : false})
                    })
                }
            }
        })
        // conn.query(updateSql, function(err, board, fields) {
        //     if(err) throw err;
        //     else {
        //             res.send({result : true});
        //     }
        // })
        // conn.release()
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
