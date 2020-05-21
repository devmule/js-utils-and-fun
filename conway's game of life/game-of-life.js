export default class GameOfLife {
	constructor(/*int*/width = 100, /*int*/height = 100) {
		this._w = width;
		this._h = height;
		this._field = [];
		this._tmpField = [];
		
		for (let y = 0; y < height; y++) {
			this._field[y] = [];
			this._tmpField[y] = [];
			for (let x = 0; x < width; x++)
				this._field[y][x] = this._tmpField[y][x] = 0;
		}
	}
	
	xIndex(x) {
		// normalize index
		return ((x % this._w) + this._w) % this._w;
	}
	
	yIndex(y) {
		// normalize index
		return ((y % this._h) + this._h) % this._h;
	}
	
	cell(x, y) {
		return this._field[this.yIndex(y)][this.xIndex(x)];
	}
	
	setCell(x, y, val) {
		this._field[this.yIndex(y)][this.xIndex(x)] = val ? 1 : 0;
	}
	
	step() {
		// обработать поле по правилам
		for (let y = 0; y < this._h; y++) {
			for (let x = 0; x < this._w; x++) {
				this._tmpField[y][x] = this.rule(x, y);
			}
		}
		// обработанное поле становится активным
		[this._field, this._tmpField] = [this._tmpField, this._field];
	}
	
	rule(x, y) {
		let neighbours = 0;
		for (let dx = -1; dx < 2; dx++)
			for (let dy = -1; dy < 2; dy++)
				if (this.cell(x + dx, y + dy) && !(dx === 0 && dy === 0)) neighbours += 1;
		
		if (this.cell(x, y)) {
			// если клетка жива, она остаётся жить если есть 2 или 3 соседа
			return neighbours === 2 || neighbours === 3;
		} else {
			// если клетка мертва, он оживает если ровно 3 соседа
			return neighbours === 3;
		}
	}
	
	get raw() {
		return JSON.stringify(this._field);
	}
	
	set raw(/*String*/data) {
		this._field = JSON.parse(data);
		this._h = this._field.length;
		this._w = this._field[0] ? this._field[0].length : 0;
	}
}

