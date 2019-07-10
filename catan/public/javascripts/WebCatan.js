$(function(){

	var hsize = 720;
	var wsize = 1080;

	// var hsize = $(window).height();
	// var wsize = $(window).width();

	$('#mainWrapper').css({
		'height': hsize + 'px',
		'width': wsize + 'px',
		'text-align': 'center'
	});

	var length;
	if(hsize >= wsize){
		length = wsize;
	}else{
		length = hsize;
	}

	$('#mainWrapper').append('<svg></svg>');
	$('#mainWrapper>svg').css({
		'height': length + 'px',
		'width': length + 'px',
		'border': 'solid',
		'border-color': 'black'

	});


	// -----------------------
	// katsu
	// -----------------------
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

	let flgFirst = false;

	socket = io.connect();
	$('#dice').hide();
	$('#Set').hide();

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

	$('#SCamp').on('click', function(){
		const grid = $('#CCamp').val();
		socket.emit('create camp', grid);
	});

	$('#SRoad').on('click', function(){
		const to = $('#CRoadto').val();
		const from = $('#CRoadfrom').val();
		socket.emit('create road', {to: to, from: from});
	});

	$('#Set').on('click', function(){
		const to = $('#CRoadto').val();
		const from = $('#CRoadfrom').val();
		const grid = $('#CCamp').val();
		socket.emit('put camp', {grid:grid, to:to, from:from});
	});

	// ----------------------------------------
	// get action
	// ----------------------------------------
	socket.on('id', function(uid){
		log('id',uid);
		userid = uid;
	});

	socket.on('turn', function(msg){
		log('turn',msg);
		turn = msg;
	});
	socket.on('Field Info', function(msg){
		log('Field',msg);
		FieldDraw(msg.field);
	});




	// ----------------------------------------
	// sockets action
	// ----------------------------------------

	socket.on('game start', function(msg){
		log('game start', msg);
		// turn = msg.turn;
		$('#start').hide();
		socket.emit('get FieldInfo');
		socket.emit('get turn');
	});

	socket.on('your turn', function(msg){
		log('your turn', msg);
		$('#dice').show();
	});

	socket.on('add resource', function(msg){
		log('add resource', msg);
		resources.t += msg.t;
		resources.r += msg.r;
		resources.b += msg.b;
		resources.s += msg.s;
		resources.w += msg.w;
		RShow();
	});

	socket.on('result dice', function(msg){
		log('result dice', msg);
		socket.emit('resource add');
	});

	socket.on('you move thief', function(msg){
		log('you move thief', msg);
	});

	socket.on('join success', function(msg){
		log('join success', msg);
		$('#join').hide();
	});

	// 初ターンの設置するやつ
	socket.on('put camp', function(msg){
		flgFirst = true;
		$('#Set').show();
	});

	socket.on('myerror', function(msg){
		log('Error', msg);
	});

	// ---------------------------------------
	// other user announce
	// ---------------------------------------
	socket.on('create camp', function(msg){
		console.log(msg);
		if(flgFirst){
			flgFirst = false;
			$('#Set').hide();
		}
	});

	socket.on('update city', function(msg){
		console.log(msg);
	});

	socket.on('create road', function(msg){
		console.log(msg);
	});

});

