$(function(){

	let socket, emit;
	let userid;
	let turn;
	let resources={
		t:0,
		w:0,
		b:0,
		s:0,
		r:0
	}
	socket = io.connect();
	$('#dice').hide();

	// show update
	function RShow(){
		$('#r').html('r:' + resources.r);
		$('#t').html('t:' + resources.t);
		$('#w').html('w:' + resources.w);
		$('#b').html('b:' + resources.b);
		$('#s').html('s:' + resources.s);
	}

	function log(act, msg){
		$('#log').append(act + ':' + msg + '<br>');
		console.log(msg);
	}

	// ----------------------------------------
	// click action
	// ----------------------------------------
	$('#join').on('click', function(){
		const username = $('#username').val();
		socket.emit('join', username);
	});
	

	$('#getid').on('click', function(){
		socket.emit('get userid');
	});

	$('#start').on('click', function(){
		socket.emit('game start');
	});

	$('#dice').on('click', function(){
		socket.emit('roll dice');
		$(this).hide();
	});

	$('#end').on('click', function(){
		socket.emit('turn end');
	});

	// ----------------------------------------
	// sockets action
	// ----------------------------------------
	socket.on('id', function(uid){
		log('id',uid);
		userid = uid;
	});

	socket.on('game start', function(msg){
		log('game start', msg);
		turn = msg.turn;
	});

	socket.on('your turn', function(msg){
		log('your turn', msg);
		$('#dice').show();
	});

	socket.on('add resource', function(msg){
		log('add resource', msg);
		resource.t += msg.t;
		resource.r += msg.r;
		resource.b += msg.b;
		resource.s += msg.s;
		resource.w += msg.w;
		RShow();
	});

	socket.on('result dice', function(msg){
		log('result dice', msg);
	});

	socket.on('you move thief', function(msg){
		log('you move thief', msg);
	});

	socket.on('join success', function(msg){
		log('join success', msg);
	});
});
