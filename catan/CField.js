// ----------------------------------
// フィールド用クラス
// ----------------------------------
module.exports = class CField{

	// private member variable
	// private num: number = 18;
	// private resource: number[] = ['t', 't', 't', 't', 'w', 'w', 'w', 'w', 'r', 'r', 'r', 's', 's', 's', 's', 'b', 'b', 'b'];	// フィールド情報
	// private number: number[] = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]; // フィールドの番号
	// private thief:number = -1;


	// constructor
	constructor(){
		this.num = 18;
		this.resource = ['t', 't', 't', 't', 'w', 'w', 'w', 'w', 'r', 'r', 'r', 's', 's', 's', 's', 'b', 'b', 'b'];	// フィールド情報
		this.number = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]; // フィールドの番号
		this.thief = -1;
		this._shuffle();
	}


	// Firld shuffle method
	_shuffle(){
		for(let i=0;i<100; i++){
			let ran1 = Math.round(Math.random() * (this.num-1));
			let ran2 = Math.round(Math.random() * (this.num-1));

			let tmp;
			tmp = this.resource[ran1];
			this.resource[ran1] = this.resource[ran2];
			this.resource[ran2] = tmp;

			ran1 = Math.round(Math.random() * (this.num-1));
			ran2 = Math.round(Math.random() * (this.num-1));
			tmp = this.number[ran1];
			this.number[ran1] = this.number[ran2];
			this.number[ran2] = tmp;
		}
	}

	// user get resource
	GetResource(num){
		let ret = [];
		let count=0;
		for(let i=0; i<this.num; i++){
			if(this.number[i] == num && i != this.thief){
				ret[count] = {
					number: i,
					resource: this.resource[i]
				};
				count++;
			}
		}
		return ret;
	}

	// setter
	set Thief(value){
		this.thief = value;
		return value;
	}

	// getter
	get FieldNumber(){
		return this.num;
	}

	get Thief(){
		return this.thief;
	}

	get Resources(){
		return this.resource;
	}

	get Numbers(){
		return this.number;
	}

}
