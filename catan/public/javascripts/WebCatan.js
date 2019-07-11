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
	let camp;
	let road = {
		to:0,
		from:0,
	};

	let flgFirst = false;
	let flg = {
		roadto:false,
		roadfrom: false,
		camp: false,
		city: false
	};

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
		$('#Set').hide();
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
		console.log(flg);
		console.log(flgFirst);
		console.log(camp);
		console.log(road);
		if(flgFirst){
			socket.emit('put camp', {grid:camp, to:road.to, from:road.from});
		}else if(flg.camp){
			socket.emit('create camp', camp);
		}else if(flg.city){
			socket.emit('update city', camp);
		}else if(flg.roadfrom){
			socket.emit('create road', {to: road.to, from: road.from});
		}
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
		// socket.emit('get turn');
	});

	socket.on('your turn', function(msg){
		log('your turn', msg);
		$('#dice').show();
		$('#Set').show();
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
		if(msg.sum !== 7) socket.emit('resource add');
	});

	socket.on('you move thief', function(msg){
		log('you move thief', msg);
	});

	socket.on('join success', function(msg){
		log('join success', msg);
		userid = msg;
		$('#join').hide();
	});

	// 初ターンの設置するやつ
	socket.on('put camp', function(msg){
		flgFirst = true;
		$('#Set').show();
	});

	socket.on('myerror', function(msg){
		console.log('error');
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

		const target = $('[townID = ' + msg.index + ']');
		town[msg.index] = msg.user;
		changeColor(target, msg.user);
	});

	socket.on('update city', function(msg){
		console.log(msg);
		const city = $('[cityID = ' + msg.index + ']');
		const target = $('[townID = ' + msg.index + ']');
		
		town[msg.index] = (msg.user + 10);
		target.remove();
		changeColor(city, msg.user);
	});

	socket.on('create road', function(msg){
		console.log(msg);
	});


	//======================================================
	//	開拓地・都市建設
	//------------------------------------------------------
	//	描画順より、開拓地(circle)の方が前面にきている(そうしている)ため
	//	circleクリック時に動作するようにしている
	//======================================================
	//開拓地建設状況
	var town = [
		 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0, 0, 0, 0,
		 0, 0, 0, 0, 0, 0
	];

	$(document).on('click', ".towns>circle", function(){
		let target = $(event.target);
		const grid = target.attr("townID");

		if(flg.camp){
			//開拓地建てる
			if(town[grid] === 0){
				// socket.emit('create camp', grid);
				camp = grid;
				console.log('camp:' + camp);
			}
		}else if(flg.city){
			//都市にアップグレード
			if(town[target.attr("townID")] == user){
				// socket.emit('update city', grid);
				camp = grid;
				console.log('camp:' + camp);
			}
		}else if(flg.roadto){
			road.to = grid;
			flg.roadto = false;
			flg.roadfrom = true;
			console.log('roadto:' + road.to);
		}else if(flg.roadfrom){
			road.from = grid;
			console.log('roadfrom:' + road.from);
		}
	});

	$('input[name=ex]:radio').on('change', function(){
		const val = $(this).val();
		console.log(val);
		if(val === "camp") {
			flg.camp=true;
			flg.roadto=false;
			flg.roadfrom=false;
			flg.city=false;
		}else if(val === 'city'){
			flg.camp=false;
			flg.roadto=false;
			flg.roadfrom=false;
			flg.city=true;
		}else if(val === 'road'){
			flg.camp=false;
			flg.roadto=true;
			flg.roadfrom=false;
			flg.city=false;
		}

	});

});

