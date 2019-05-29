#!/usr/bin/env node
const express = require('express');
const app = express();
const http = require('http').Server(app);
const socket = require('socket.io')(http);
const PORT = 8000;

// IP Filtering
const ipfilter = require('express-ipfilter').IpFilter;
const ipdeniederror = require('express-ipfilter').IpDeniedError;
// const ips = ['::ffff:131.206.77.23/16'];
const ips = ['::ffff:131.206.77.23'];
app.use(ipfilter(ips, {mode: 'allow'}));
module.exports = app;

app.set('view engine', 'ejs');
app.set('views', __dirname);


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
      error: err,
    });
  });
}

// Load static files
app.use('/static', express.static(__dirname + '/public/'));

// Web page
app.get('/', function(req, res){
	res.render(__dirname + '/public/index.html');
});


// Socket
socket.on('connection', function(sock){
	sock.on('message', function(msg){
		console.log("message: "+ msg);
		console.log("sock: "+ sock);
	});
});


http.listen(PORT, function() {
    console.log((new Date()) + ' Server is listening on port ' + PORT);
});

