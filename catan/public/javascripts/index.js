$(function(){

	let socket, emit;
	socket = io.connect();

	$('#Btest').on('click', function(){
		socket.emit('message', 'test');
	});
	

	socket.on('receiveMessage', function(msg){
		console.log('Receive: ' + msg);
	});

});
