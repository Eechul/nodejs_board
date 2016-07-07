var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var conn = mysql.createConnection({
  host      : 'localhost',
  user      : 'root',
  password  : 'dongdb',
  database  : 'mysql'
})
conn.connect();
var app = express();
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/board/add', function (req, res) {
  res.render('add'); // test
});

app.get('/board/delete/:number', function (req, res) {
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
});

app.post('/board/edit', function (req, res) {
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
});

app.get('/board/edit/:number', function (req, res) {
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
});

// board main
app.get(['/board', '/board/:number'], function (req, res) {
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
        res.render('view', {boards:boards})
      }
    }
  });
});

app.post('/board/add', function (req, res) {
  var sql="insert into board(title, author, content, date) values(?, ?, ?, DATE_FORMAT(NOW(),'%m-%d-%Y'))";
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
});

app.get('/', function (req, res) {
  res.send('Hello World!'); // test
});



app.listen(4002, function () {
  console.log('Example app listening on port 4000!');
});
