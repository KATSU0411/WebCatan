
	function changeColor(target,user) {
		var color;

		switch(user){
			case 1:
				color = "rgba(255,0,0,1)";
				break;
			case 2:
				color = "rgba(0,255,0,1)";
				break;
			case 3:
				color = "rgba(0,0,255,1)";
				break;
			case 4:
				color = "rgba(255,255,0,1)";
				break;


		}

		target
			.attr( "fill", color)
			.attr("stroke", "black")
			.attr("stroke-width", 1 );
	}
