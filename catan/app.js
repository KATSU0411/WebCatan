const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 8000;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


// -----------------------------------------------
// サーバ立てる準備
// -----------------------------------------------

// port setting
// app.listen(port);
http.listen(port, function(){
	console.log(console.log((new Date()) + ' Server is listening on port ' + port));
});

// IP filtering
const ipfilter = require('express-ipfilter').IpFilter;
const ipdeniederror = require('express-ipfilter').IpDeniedError;
// const ips  = ['::ffff:131.206.77.23'];
const ips  = ['::ffff:131.206.77.23/16'];
app.use(ipfilter(ips, {mode: 'allow'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// denied IP
if (app.get('env') === 'development') {
  app.use((err, req, res, _next) => {
    console.log('Error handler', err);
    if (err instanceof ipdeniederror) {
      res.status(401);
    } else {
      res.status(err.status || 500);
    }
 
    res.render('error', {
      message: 'You IP address is no permission'
      // error: "Error",
    });
  });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


// -----------------------------------------------
// ソケット通信（メイン処理）
// -----------------------------------------------
const CGame = require('./CGame.js');
let Game = new CGame(4);

let User = [];

// socket
io.on('connection', function(socket){
	console.log('[connected]', socket.id);

	socket.on('message', function(msg){
		console.log('message: ' + msg);
		io.to(socket.id).emit('receiveMessage', msg);
	});

	// --------------------------
	// ユーザとIDの紐づけ
	// --------------------------
	socket.on('login', function(msg){

	});
});











