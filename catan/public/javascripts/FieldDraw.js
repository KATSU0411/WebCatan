	function FieldDraw(msg){

		//画面サイズ取得
		var length = $("#mainWrapper>svg").width();
		

		var svg = d3.select("#mainWrapper>svg")
			.append("g")
			.attr('transform', "translate(15,0)");


		var radius = length / 9;

		var points = setField(radius,length);

		var hexbin = d3.hexbin()
			.radius(radius);

		//フィールド描画
		var field = svg.append("g");

		console.log(length);

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
			.attr("id", function(d,i){
				return "field" + i;
			});

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
		];

		//数字の円描画
		let dst = field.selectAll('circle')
			.data(circle)
			.enter()
			.append('circle')
			.attr('transform', function(d,i){
				return "translate(" + d[0] + "," + d[1] + ")";
			})
			.attr("r", radius/2)
			.attr("fill", '#f0f88c');

		//数字描画
		field.selectAll('text')
			.data(circle)
			.enter()
			.append('text')
			.attr('transform', function(d,i){
				return "translate(" + d[0] + "," + d[1] + ")";
			})
			.text(function(d,i) { return msg.numbers[i]; })
			.attr('text-anchor', "middle")
			.attr('font-size', "80px")
			.attr('dy', ".35em")
			.attr('fill', "black");

		var town = generateTownPos();

		//都市描画
		var citys = svg.append("g");
		var margin = 15;
		citys.attr("class", "cities")
			.selectAll('.cities>rect')
			.data(town)
			.enter()
			.append('rect')
			.attr('transform', function(d,i){
				return "translate(" + (d[0]-margin) + "," + (d[1]-margin) + ")";
			})
			.attr('cityID', function(d,i){
				return i;
			})
			.attr( 'width', radius/3)
			.attr( 'height', radius/3)
			.attr( 'fill', "rgba(0,0,0,0)");

		//開拓地描画
		var towns = svg.append("g");
		towns.attr("class", "towns")
			.selectAll('.towns>circle')
			.data(town)
			.enter()
			.append('circle')
			.attr('transform', function(d,i){
				return "translate(" + d[0] + "," + d[1] + ")";
			})
			.attr('townID', function(d,i){
				return i;
			})
			.attr( 'r', radius/5)
			.attr( 'fill', "rgba(0,0,0,0)");
	}

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

	function generateTownPos() {	//開拓地(ゴリゴリ押し)

		var town = [];
		var xInit = [138,70,2,2,70,138];	//初期値
		var y = 44+36;

		var xSlice = 68;		//x方向の刻み幅
		var ySlice = 82+36;	//y方向の刻み幅（2種類）

		var xSlices = [7,9,11,11,9,7];	//横方向の頂点数

		var sliceCount = 0;	//横方向のフラグ

		var count = 0;
		let flg=0;
		do{
			var x = xInit[sliceCount];

			for(var i=0; i<xSlices[sliceCount]; i++){
				if(i%2 == flg){
					town.push([x,y]);
				}else{
					town.push([x,y-36]);
				}
				x += xSlice;
				count++;
			}
			if(count === 27) flg=1;

			y += ySlice;
			sliceCount++;
		}while(count != 54);

		return town;
	}
