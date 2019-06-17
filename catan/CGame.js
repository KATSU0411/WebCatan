// ----------------------------------
// ----------------------------------
const CField = require('./CField.js');
module.exports = class CGame{

	// private member variable
	// private grid: number[] = new Array(54).fill(0);
	//
	// // 道のグラフ情報
	// // -1なら設置不可、0なら設置可、既設置ならユーザID
	// private road: number[][] = new Array(54);
	// private const num: number_road=54;
	//
	// // 資源フィールドクラス
	// private Field: CField = new CField();
	//
	// // 資源とマス目の関係グラフ
	// private FGRelation: number[][] = new Array(this.Field.num);
	//
	// const num_road = 54;
	

	// public member variable


	// constructor
	constructor(){
		this.grid = new Array(54).fill(0);
		this.road = new Array(54);
		this.Field = new CField();
		this.FGRelation = new Array(this.Field.FieldNumber);
		this.num_road = 54;

		this._RoadInit();
		this._ResourceInit();
	}

	// 資源用グラフ
	// ToDo
	_ResourceInit(){
		for(let i=0; i<this.Field.FieldNumber; i++){
			this.FGRelation[i] = new Array();
		}
	}

	// グラフ情報初期化
	_RoadInit(){
		for(let i=0; i<this.num_road; i++){
			this.road[i] = new Array(54).fill(-1);
		}

		this.road[0][8] = 0;
		this.road[8][0] = 0;
		this.road[this.num_road - 1][this.num_road - 9] = 0;
		this.road[this.num_road - 9][this.num_road - 1] = 0;

		for(let i=1; i<(this.num_road/2); i++){
			this.road[i][i-1] = 0;
			this.road[i-1][i] = 0;
			this.road[i][i+1] = 0;
			this.road[i+1][i] = 0;

			let tmp = this.num_road-i-1;
			this.road[tmp][tmp-1] = 0;
			this.road[tmp-1][tmp] = 0;
			this.road[tmp][tmp+1] = 0;
			this.road[tmp+1][tmp] = 0;
			if(i%2 === 0 && (i<7)){
				this.road[i][i+8] = 0;
				this.road[i+8][i] = 0;
				this.road[this.num_road - i - 1][this.num_road -i - 9] = 0;
				this.road[this.num_road -i - 9][this.num_road - i - 1] = 0;
			}else if(i%2 == 1 && (i>6) && (i<16)){
				this.road[i][i+10] = 0;
				this.road[i+10][i] = 0;
				this.road[this.num_road - i - 1][this.num_road -i - 11] = 0;
				this.road[this.num_road -i - 11][this.num_road - i - 1] = 0;
			}else if(i%2 == 0 && i>15){
				this.road[i][i+11] = 0;
				this.road[i+11][i] = 0;
			}
			
		}
		this.road[6][7] = -1;
		this.road[7][6] = -1;
		this.road[15][16] = -1;
		this.road[16][15] = -1;
		this.road[26][27] = -1;
		this.road[27][26] = -1;
		this.road[37][38] = -1;
		this.road[38][37] = -1;
		this.road[46][47] = -1;
		this.road[47][46] = -1;
	}

	// get methods
	// ----------------------------
	// 指定されたダイス番号が与えられ、どのユーザが資源を獲得するか返す
	// 返し値:各ユーザに対して取得する資源データ
	// ex:ret = {{'t'}{'t','t'}{}{'r','t'}}
	// ----------------------------
	GetResoruce(num){
		const res = this.Field.GetResource(num);
		let ret = [];
		Object.keys(res).forEach(function(key){
			const val = this[key];
			for(let i=0; i<6; i++){
				const tmp = this.grid[this.FGRlation[parseInt(key)][i]];
				if(tmp == 0)continue;
				ret[tmp].push(val);
			}
		}, res);

		return ret;
	}

	// set methods
	// true:正常終了
	// false:異常終了
	set thief(value){
		this.Field.thief = value;
		return true;
	}

	SetRoad(to, from, user){
		if(this.road[to][from] != 0) return false;
		this.road[to][from]= user;
		this.road[from][to]= user;
		return true;
	}

	SetGrid(index, user){
		// 隣接箇所に設置されていないか
		for(let i=0; i<num_road; i++){
			if(this.road[index][i] != -1){
				if(this.grid[i] != 0) return false;
			}
		}

		if(this.grid[index] != 0) return false;
		this.grid[index] = user;
		return true;
	}


};


