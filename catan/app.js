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


// ==========================================================
// -----------------------------------------------
// ソケット通信（メイン処理）
// -----------------------------------------------
const CGame = require('./CGame.js');
let Game;

let User = [];
let us = 0;
let Turn;
let Order=[];

function Usr(name){
	for(let i=0; i<us; i++){
		if(User[i].name === name)
			return i;
	}
	return -1;
}

// socket
io.on('connection', function(socket){
	console.log('[connected]', socket.id);

	socket.on('disconnect', function(){
		console.log('[disconnected]', socket.id);
	});

	// --------------------------
	// ユーザ名とIDの紐づけ
	// --------------------------
	socket.on('join', function(msg){
		socket.name = msg;
		if(us >= 4){
			socket.emit('error', 'user capacity over');
			return;
		} 
		if(Usr(msg) === -1){
			let u = {name: msg, id: socket.id};
			User.push(u);
			Order[us] = us;
			us++;
		}
	});


	// --------------------------
	// getter
	// --------------------------
	socket.on('get userid', function(){
		socket.emit('id', Usr(socket.name)+1);
	});
	socket.on('get resource', function(){
		socket.emit('resource', Game.GetResource(Usr(socket.name)));
	});

	// --------------------------
	// game start
	// --------------------------
	socket.on('game start', function(msg){
		Game = new CGame(us);
		Turn = 1;
		for(let i=0; i<50; i++){
			let ran1 = Math.floor(Math.random() * us);
			let ran2 = Math.floor(Math.random() * us);
			let tmp;
			tmp = Order[ran1];
			Order[ran1] = Order[ran2];
			Order[ran2] = tmp;
		}

		for(let i=0; i<us; i++){
			User[Order[i]].turn = i+1;
		}

		io.emit('game start',{turn: User[Usr(socket.name)].turn});
		io.to(User[Order[0]].id).emit('your turn');
	});

	// --------------------------
	// roll dice
	// --------------------------
	let ran1, ran2, sum;
	socket.on('roll dice', function(msg){
		if(Turn !== User[(Usr(socket.name))].turn){
			socket.emit('error', 'not your turn');
			return;
		}
		ran1 = Math.floor(Math.random() * 6) + 1;
		ran2 = Math.floor(Math.random() * 6) + 1;
		sum = ran1+ran2;
		io.emit('result dice', {
			dice1: ran1,
			dice2: ran2,
			sum: sum
		});

		if(sum === 7){
			socket.emit('you move thief');
		}else{
			const change_rate = Game.RollDice(sum);
			io.emit('add resource', change_rate[Usr(socket.name)]);
		}
	});

	// --------------------------
	// move thief
	// --------------------------
	socket.on('move thief', function(msg){
		if(Turn !== User[(Usr(socket.name))].turn){
			socket.emit('error', 'not your turn');
			return;
		}
		Game.thief = msg;
	});

	// --------------------------
	// create camp
	// --------------------------
	socket.on('create camp', function(msg){
		if(Turn !== User[(Usr(socket.name))].turn){
			socket.emit('error', 'not your turn');
			return;
		}

		let ret = Game.SetCamp(msg, Usr(socket.name));
		if(ret === false){
			socket.emit('error', 'cannot create camp');
			return;
		}

		io.emit('create camp', {index: msg, user:Usr(socket.name)});
	});

	// --------------------------
	// create road
	// --------------------------
	socket.on('create road', function(msg){
		if(Turn !== User[(Usr(socket.name))].turn){
			socket.emit('error', 'not your turn');
			return;
		}

		let ret = Game.SetRoad(msg.to, msg.from, Usr(socket.name));
		if(ret === false){
			socket.emit('error', 'cannot create road');
			return;
		}

		io.emit('create camp', {index: msg, user:Usr(socket.name)});
	});


	// --------------------------
	// turn end
	// --------------------------
	socket.on('turn end', function(msg){
		if(Turn !== User[(Usr(socket.name))].turn){
			return;
		}
		Turn = ((Turn)%us) + 1;
		io.to(User[Order[Turn-1]].id).emit('your turn');
	});

});











