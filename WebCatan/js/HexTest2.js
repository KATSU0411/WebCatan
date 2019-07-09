$(function(){

	//画面サイズ取得
	var length = $("#mainWrapper>svg").width();

	// // json受け取り
	// socket.on('ivent',function(msg){
	// 	CreateFiled(msg);
	// });
	
	var msg = {
		resources: [
			't', 't', 's',
			'b', 'w', 's',
			't', 'r', 's',
			'w', 'w', 'b',
			'b', 'r', 'w',
			't', 'r', 's'
		],
		numbers: [
			9, 11,  3,  9,
			12, 10, 10, 11,
			4,  8,  6,  2,
			8,  5,  3,  5,
			4,  6
		]
	}

	var svg = d3.select("#mainWrapper>svg")
		.append("g");


	var radius = length / 9;

	var points = setField(radius,length);

	var hexbin = d3.hexbin()
		.radius(radius);

	//フィールド描画
	var field = svg.append("g");

	field.attr("class", "hexagon")
		.selectAll("path")
		.data(hexbin(points))
		.enter()
		.append("path")
		.attr("d", hexbin.hexagon())
		.attr("fill", function(d,i) { 
			if(i==18){
				return FieldColor("d"); 
			}else{
				return FieldColor(msg.resources[i]);
			}
		})
		.attr("transform", function(d){
			return "translate(" + d.x + "," + d.y + ")";
		})

	//フィールドの数字配置場所（ごり押し）
	var circle = [
		//1段目
		[205,115],
		[345,115],
		[485,115],
		//2段目
		[135,235],
		[275,235],
		[415,235],
		[555,235],
		//3段目
		[65,355],
		[205,355],
		[485,355],
		[625,355],
		//4段目
		[135,475],
		[275,475],
		[415,475],
		[555,475],
		//5段目
		[205,595],
		[345,595],
		[485,595],
	]

	field.selectAll('circle')
		.data(circle)
		.enter()
		.append('circle')
		.attr('transform', function(d,i){
			return "translate(" + d[0] + "," + d[1] + ")";
		})
		.attr({
			'r': radius/2,
			'fill': '#f0f88c'
		});

	field.selectAll('text')
		.data(circle)
		.enter()
		.append('text')
			.attr({
				'text-anchor': "middle",
				'font-size': "80px",
				'dy': ".35em",
				'fill': "black"
			})
		.attr('transform', function(d,i){
			return "translate(" + d[0] + "," + d[1] + ")";
		})
		.text(function(d,i) { return msg.numbers[i]; });
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
		if(i==0){
			continue;
		}
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

	//中心
	var y = radius * 0 * 2 + (length/2);
	points.push([radius * 0 * 2 + (length/2), y]);

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
