// ----------------------------------
// ユーザ用クラス
// ----------------------------------
module.exports = class CUser{

	constructor(){
		this.point = 0;
		this.resource = {
			t : 0,
			w : 0,
			r : 0,
			b : 0,
			s : 0
		}
		this.flgPossible = {
			road: false,
			camp: false,
			city: false,
			develop: false
		}
		// this.Dcard = new Array();
	}

	_UpdateFlg(){
		this.flgPossible.road = (this.resource.t >= 1 && this.resource.b >= 1) ? true : false;

		this.flgPossible.camp = (this.resource.t >= 1 && this.resource.b >= 1 && this.resource.w >= 1 && this.resource.s >= 1) ? true : false;

		this.flgPossible.city = (this.resource.w >= 2 && this.resource.r >= 3) ? true : false;

		this.flgPossible.develop = (this.resource.w >= 1 && this.resource.s >= 1 && this.resource.r >= 1) ? true : false;
	}

	AddResource(resource, num){
		if(this.resource[resource] + num < 0) return false;
		this.resource[resource] += num;
		this._UpdateFlg();
	}

	// ==================================================
	// --------------------------------------
	// Create Methods
	// --------------------------------------
	CreateRoad(){
		if(!this.flgPossible.road) return false;
		this.resource.t -= 1;
		this.resource.b -= 1;
		this._UpdateFlg();
		return true;
	}

	CreateCamp(){
		if(!this.flgPossible.camp) return false;
		this.resource.t -= 1;
		this.resource.b -= 1;
		this.resource.w -= 1;
		this.resource.s -= 1;
		this._UpdateFlg();
		this.point++;
		return true;
	}

	CreateCity(){
		if(!this.flgPossible.city) return false;
		this.resource.w -= 2;
		this.resource.r -= 3;
		this._UpdateFlg();
		this.point++;
		return true;
	}

	CreateDevelop(){
		if(!this.flgPossible.develop) return false;
		this.resource.w -= 1;
		this.resource.r -= 1;
		this.resource.s -= 1;
		this._UpdateFlg();
		return true;
	}
	// ==================================================


}



