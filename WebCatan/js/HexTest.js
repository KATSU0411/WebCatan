$(function(){

	// var width = 800;
	// var height = 500;
	
	//画面サイズ取得
	var width = $(window).width();
	var height = $(window).height();

	//グラデーション
	var color = d3.scale
		.linear()
		.domain([0, 20])
		.range(["white", "green"])
	 	.interpolate(d3.interpolateLab);

	//描画領域確保
	var svg = d3.select("#MyGraph").append("svg")
		.attr("width", width)
		.attr("height", height);


	//マウス動かしたとき
	svg.on("mousemove", function(){
		var position = d3.mouse(this);

		var points = [];
		for (var i=0; i<=800; i++){
			points.push(
				[d3.random.normal(position[0], 80)(), d3.random.normal(position[1], 80)()]
			);
		};

		var hexbin = d3.hexbin()
			.radius(20);

		d3.selectAll(".hexagon").remove();

		var heatmap = svg.append("g")
			.attr("class", "hexagon")
			.selectAll("path")
			.data(hexbin(points))
			.enter()
			.append("path")
			.attr("d", hexbin.hexagon())
			.attr("transform", function(d,i){
				return "translate(" + d.x + "," + d.y + ")";
			})
			.style("fill", function(d){
				if(d.length > 20) return color(20);
				else return color(d.length);
			});
	});


});
