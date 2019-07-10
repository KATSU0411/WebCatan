createsvg();

function createsvg() {
	var svg = d3.select("#example").append("svg")
		.attr({
			width: 640,
			height: 480
		});
	

	var c1 = [100, 90, 30];
	var c2 = [200, 120, 20];

	var c3 = [300, 100, 20];
	// var carray = [c1, c2, c3];
	var carray = [c1, c3, c2];


	var line = d3.svg.line()
		.interpolate('basis')
		.x(function(d) { return d[0]; })
		.y(function(d) { return d[1]; });

	var path = svg.append('path')
		.attr({
			'd': line(carray),
			'stroke': 'lightgreen',
			'stroke-width': 5,
			'fill': 'none'
		});
};
