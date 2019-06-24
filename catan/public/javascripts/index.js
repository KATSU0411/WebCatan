$(function(){

	let socket, emit;
	socket = io.connect();

	$('#join').on('click', function(){
		const userid = $('#userid').val();
		console.log(userid);
		socket.emit('join', userid);
	});
	

	$('#getid').on('click', function(){
		socket.emit('get userid');
	});

	socket.on('id', function(uid){
		console.log(uid);
	});

});
