$(function(){

	//画面サイズ取得
	var length = $("#mainWrapper>svg").width();

	// // json受け取り
	// socket.on('ivent',function(msg){
	// 	CreateFiled(msg);
	// });
	

	var svg = d3.select("#mainWrapper>svg")
		.append("g");


	var radius = 20;

	var hexbin = d3.hexbin()
		.size([100,100])
		// .extent([[length/4.0,0],[length*3/4.0,length]])
		.radius(radius);

	var points = [
		[100,100],
		[200,100]
	]

	//フィールド描画
	var field = svg.append("g");

	field.attr("class", "hexagon")
		.selectAll("path")
		.data(hexbin(points))
		.enter()
		.append("path")
		.attr("d", hexbin.hexagon())
		.attr("fill", "green")
		.attr("transform", function(d){
			return "translate(" + d.x + "," + d.y + ")";
		});

	// hexbin.size();
	console.log(hexbin.centers());
	console.log(hexbin.centers());

	// var number = svg.selectAll('circle')
	// field.selectAll('circle')
	// 	.data(circle)
	// 	.enter()
	// 	.append('circle')
	// 	.attr('transform', function(d,i){
	// 		return "translate(" + d[0] + "," + d[1] + ")";
	// 	})
	// 	.attr({
	// 		'r': radius/2,
	// 		'fill': 'black'
	// 	});

		// .append('text')
		// 	.attr({
		// 		'text-anchor': "middle",
		// 		'font-size': "20px",
		// 		'dy': ".35em",
		// 		'fill': "white"
		// 	})
		// .text(function(d,i) { return msg.numbers[i]; });
});

function setField(radius, length) {

	var points = [];

	//1段目
	var y = radius * (-1.5) * 2 + (length/2);
	for(var i=-1; i<=1; i++){
		points.push([radius * i * 2 + (length/2), y]);
	}

	//2段目
	var y = radius * (-1) * 2 + (length/2);
	for(var i=-1.5; i<=-0.5; i++){
		points.push([radius * i * 2 + (length/2), y]);
	}
	for(var i=0; i<=1; i++){
		points.push([radius * i * 2 + (length/2), y]);
	}
	
	//3段目
	var y = radius * 0 * 2 + (length/2);
	for(var i=-2; i<=2; i++){
		points.push([radius * i * 2 + (length/2), y]);
	}

	//4段目
	var y = radius * 1 * 2 + (length/2);
	for(var i=-1.5; i<=-0.5; i++){
		points.push([radius * i * 2 + (length/2), y]);
	}
	for(var i=0; i<=1; i++){
		points.push([radius * i * 2 + (length/2), y]);
	}

	//5段目
	var y = radius * 1.5 * 2 + (length/2);
	for(var i=-1; i<=1; i++){
		points.push([radius * i * 2 + (length/2), y]);
	}

	return points;

};


function FieldColor(resources) {
	switch(resources){
		case 't':	//木材
			return "darkgreen";
			break;

		case 's':	//羊
			return "lightgreen";
			break;

		case 'w':	//小麦
			return "yellow";
			break;

		case 'b':	//レンガ
			return "brown";
			break;

		case 'r':	//石
			return "gray";
			break;

		case 'd':	//荒野
			return "orange";
			break;
	}
}
