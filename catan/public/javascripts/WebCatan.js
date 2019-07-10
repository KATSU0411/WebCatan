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
});

