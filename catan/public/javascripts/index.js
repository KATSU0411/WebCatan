$(function(){

	let socket, emit;
	socket = io.connect();

	$('#Btest').on('click', function(){
		const = $('#userid').value();
		socket.emit('join', const);
	});
	

	socket.on('receiveMessage', function(msg){
		console.log('Receive: ' + msg);
	});

});
