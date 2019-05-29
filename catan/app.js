const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http').Server(app);
const socket = require('socket.io')(http);
const port = 8000;

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// port setting
app.listen(port);

// IP filtering
const ipfilter = require('express-ipfilter').IpFilter;
const ipdeniederror = require('express-ipfilter').IpDeniedError;
const ips  = ['::ffff:131.206.77.23'];
app.use(ipfilter(ips, {mode: 'allow'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
      // message: 'You shall not pass',
      error: "Error",
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
