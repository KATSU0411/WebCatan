createsvg();

function createsvg() {
	var svg = d3.select("#example").append("svg")
		.attr({
			width: 640,
			height: 480
		});
	
	var carray = [];
	carray.push([100, 90, 30, "green"]);
	carray.push([200, 120, 20, "red"]);
	

	// var c1 = [100, 90, 30, "green"];
	// var c2 = [200, 120, 20, "red"];
	// var carray = [c1, c2];

	var color = d3.scale.category10();

	var g = svg.selectAll('g')
		.data(carray).enter().append('g')
		.attr({
			transform: function(d){
				return "translate(" + d[0] + "," + d[1] + ")";
			}
		});

	g.append('circle')
		.attr({
			'r': function(d) { return d[2]; },
			'fill': function(d,i) { return d[3]; }
		});

	g.append('text')
		.attr({
			'text-anchor': "middle",
			'font-size': "20px",
			'dy': ".35em",
			'fill': "white"
		})
		.text(function(d,i) { return i+1; });

};
