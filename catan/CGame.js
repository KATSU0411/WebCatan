// ----------------------------------
// ----------------------------------
const CField = require('./CField.js');
const CUser = require('./CUser.js');
module.exports = class CGame{

	// constructor
	constructor(user){
		if(user > 4) user = 4;
		this.grid = new Array(54).fill(0);
		this.road = new Array(54);
		this.Field = new CField();
		this.FGRelation = new Array(this.Fnum);
		this.Rnum = 54;
		this.Users = new Array(user);
		this.flgThief = false;
		for(let i=0; i<user; i++){
			this.Users[i] = new CUser();
		}

		this._RoadInit();
		this._ResourceInit();
	}

	// =============================================================
	// init methods
	// -------------------------------
	// 資源用グラフ
	// -------------------------------
	_ResourceInit(){
		for(let i=0; i<this.Fnum/2; i++){
			this.FGRelation[i] = new Array(6).fill(-1);
			this.FGRelation[this.Fnum - i - 1] = new Array(6).fill(-1);

			for(let k=0; k<3; k++){
				if(i<3){
					this.FGRelation[i][k] = i*2 + k;
					this.FGRelation[i][3 + k] = i*2 + k + 8;
					this.FGRelation[this.Fnum - i - 1][k] = this.Rnum - (i*2 + k) - 1;
					this.FGRelation[this.Fnum - i - 1][3 + k] = this.Rnum - (i*2 + k + 8) - 1;
				}else if((i>2) && (i<7)){
					this.FGRelation[i][k] = i*2 + k + 1;
					this.FGRelation[i][3 + k] = i*2 + k + 11;
					this.FGRelation[this.Fnum - i - 1][k] = this.Rnum - (i*2 + k + 1) - 1;
					this.FGRelation[this.Fnum - i - 1][3 + k] = this.Rnum - (i*2 + k + 11) - 1;
				}else if(i>6){
					this.FGRelation[i][k] = i*2 + k + 2;
					this.FGRelation[i][3 + k] = i*2 + k + 13;
					this.FGRelation[this.Fnum - i - 1][k] = this.Rnum - (i*2 + k + 2) - 1;
					this.FGRelation[this.Fnum - i - 1][3 + k] = this.Rnum - (i*2 + k + 13) - 1;
				}
			}
		}
	}

	// -------------------------------
	// 街道用グラフ
	// -------------------------------
	_RoadInit(){
		for(let i=0; i<this.Rnum; i++){
			this.road[i] = new Array(54).fill(-1);
		}

		this.road[0][8] = 0;
		this.road[8][0] = 0;
		this.road[this.Rnum - 1][this.Rnum - 9] = 0;
		this.road[this.Rnum - 9][this.Rnum - 1] = 0;

		for(let i=1; i<(this.Rnum/2); i++){
			this.road[i][i-1] = 0;
			this.road[i-1][i] = 0;
			this.road[i][i+1] = 0;
			this.road[i+1][i] = 0;

			let tmp = this.Rnum-i-1;
			this.road[tmp][tmp-1] = 0;
			this.road[tmp-1][tmp] = 0;
			this.road[tmp][tmp+1] = 0;
			this.road[tmp+1][tmp] = 0;
			if(i%2 === 0 && (i<7)){
				this.road[i][i+8] = 0;
				this.road[i+8][i] = 0;
				this.road[this.Rnum - i - 1][this.Rnum -i - 9] = 0;
				this.road[this.Rnum -i - 9][this.Rnum - i - 1] = 0;
			}else if(i%2 == 1 && (i>6) && (i<16)){
				this.road[i][i+10] = 0;
				this.road[i+10][i] = 0;
				this.road[this.Rnum - i - 1][this.Rnum -i - 11] = 0;
				this.road[this.Rnum -i - 11][this.Rnum - i - 1] = 0;
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


	// =============================================================
	// ----------------------------
	// 指定されたダイス番号が与えられ、各ユーザに資源を与える
	// ex:ret = {{t:1, r:0, w:1, s:0, b:0},{...},{...},{..}}
	// ----------------------------
	RollDice(num){
		const res = this.Field.GetResource(num);
		let ret = new Array(this.Users.length);
		for(let i=0; i<this.Users.length; i++){
			ret[i] = {
				t:0,
				r:0,
				w:0,
				s:0,
				b:0
			}
		}
		res.forEach((val) => {
			const num = val.number;
			const resource = val.resource;

			for(let i=0; i<6; i++){
				const index = this.FGRelation[parseInt(num)][i];
				// console.log(index);
				const tmp = this.grid[index];
				if(tmp == 0)continue;
				ret[tmp-1][resource] ++;
				this.Users[tmp-1].AddResource(resource, 1);
			}
		});

		return ret;

	}

	// =============================================================
	// get methods
	get Fnum(){
		return this.Field.FieldNumber;
	}

	get FieldInfo(){
		return {
			resources: this.Field.Resources,
			numbers: this.Field.Numbers
		}
	}

	// ---------------------
	get Grids(){
		return this.grid;
	}

	// ---------------------
	get Roads(){
		return this.road;
	}

	// ---------------------
	get Resources(){
		return this.Field.Resources;
	}

	// ---------------------
	get Numbers(){
		return this.Field.Numbers;
	}

	// ---------------------
	get thief(){
		return this.Field.Thief;
	}

	// ---------------------
	GetUserFlg(user){
		return this.Users[user].flgPossible;
	}

	// ---------------------
	GetUserPoint(user){
		return this.Users[user].point;
	}

	// ---------------------
	// return json
	// {
	// t: 1, w:2, s:2, b:4, r:1,
	// }
	GetResource(user){
		return this.Users[user].resource;
	}

	// =============================================================
	// set methods
	// true:正常終了
	// false:異常終了
	set thief(value){
		if(this.flgThief === false) return;
		this.Field.Thief = value;
	}

	// ---------------------
	SetRoad(to, from, user){
		// index out of bounds chec
		if(user >= this.Users.length && user < 0) return false;

		// user resource check
		if(this.Users[user].flgPossible.road === false) return false;

		const ret = this.SetRoadWithoutResource(to, from, user);
		if(ret === false) return false;

		this.Users[user].CreateRoad();
		return true;
	}

	// ---------------------
	SetRoadWithoutResource(to, from, user){
		const ret = this.SetRoadCheck(to, from, user);
		if(ret === false) return false;

		// set
		this.road[to][from]= user+1;
		this.road[from][to]= user+1;

		return true;
	}

	// ---------------------
	SetRoadCheck(to, from, user){
		// index out of bounds check
		if(user >= this.Users.length && user < 0) return false;
		if(to<0 || to>=this.Rnum || from<0 || from>=this.Rnum) return false;

		// set possible check
		if(this.road[to][from] != 0) return false;

		// 隣接して道が設置されているか確認
		let flg = false;
		for(let i=0; i<this.Rnum; i++){
			if (this.road[to][i] === user+1) flg=true;
			if (this.road[i][from] === user+1) flg=true;
		}
		if(flg===false && this.grid[to] != user+1 && this.grid[from] != user+1) return false;
		return true;
	}

	// ---------------------
	SetCamp(index, user){
		// index out of bounds check
		if(user >= this.Users.length && user < 0) return false;
		// user resource check
		if(this.Users[user].flgPossible.camp === false) return false;

		let flg=false;

		for(let i=0; i<this.Rnum; i++){
			if(this.road[index][i] === user+1){
				flg=true;
			}
		}
		if(flg === false)return false;

		// set
		const ret = this.SetCampWithoutResource(index, user);
		if(ret === false) return false;
		this.Users[user].CreateCamp();
		return true;
	}

	// ---------------------
	RemoveCamp(index){
		if(index<0 || index>=this.Rnum) return false;
		this.grid[index] = 0;
		return true;
	}


	// ---------------------
	SetCampWithoutResource(index, user){
		const ret = this.SetCampCheck(index, user);
		if(ret === false) return false;

		this.grid[index] = user+1;

		return true;
	}

	// -------------------------
	SetCampCheck(index, user){
		// index out of bounds check
		if(user >= this.Users.length && user < 0) return false;
		if(index<0 || index>=this.Rnum) return false;

		// 既設置と隣接状況の確認
		if(this.grid[index] != 0) return false;
		for(let i=0; i<this.Rnum; i++){
			if(this.road[index][i] != -1){
				if(this.grid[i] != 0) return false;
			}
		}
		return true;
	}


	// ----------------------------
	// 最初のターンの道と開拓地置くやつ
	// ----------------------------
	SetFirstTurn(index, to, from, user){
		let r;
		r = this.SetCampWithoutResource(index, user);
		if(r === false) return false;
		r = this.SetRoadWithoutResource(to, from, user);
		if(r === false){
			this.RemoveCamp(index);
			return false;
		}
		return true;
	}

	// ---------------------
	UpdateCity(index, user){
		// index out of bounds check
		if(user >= this.Users.length && user < 0) return false;
		if(index<0 || index>=this.Rnum) return false;

		// user resource check
		if(this.Users[user].flgPossible.city === false) return false;

		//そこがそのユーザの開拓地か
		if(this.grid[index] != user+1) return false;

		this.Users[user].CreateCity();
		this.grid[index] = 10 + user+1;
		
		return true;
	}
	// =============================================================

};


