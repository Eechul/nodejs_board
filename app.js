var express = require('express')
var bodyParser = require('body-parser')
var routes = require('./routes/index.js')

var app = express();
app.locals.pretty = true;
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// 페이징
app.get('/', routes.board.index);
app.get('/add', routes.board.add);

app.post('/add', routes.board.addPost);

app.listen(4002, function () {
  console.log('Example app listening on port 4002!');
});
