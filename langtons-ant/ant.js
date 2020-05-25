const tileSize = 10;

export default class Ant {
	constructor() {
		this.tiles = {};
		
		//          поворот , новый цвет
		//this.rules[0] = [1, 3];
		this.rules = [];
		this.rules[0] = [1, 3]; // если белый, повернуть на 90 вправо и покрасить в чёрный
		this.rules[3] = [-1, 4]; // если чёрный, повернуть на 90 влево и покрасить в красный
		this.rules[4] = [-1, 8]; // если красный, повернуть на 90 влево и покрасить в зеленый
		this.rules[8] = [1, 10]; // если зеленый, повернуть на 90 вправо и покрасить в голубой
		this.rules[10] = [-1, 0]; // если голубой, повернуть на 90 влево и покрасить в белый
		
		this.ant = Ant.right; // направление движения
		this.x = 0;
		this.y = 0;
	}
	
	step() {
		let rule = this.rules[this.getCell(this.x, this.y)];
		// перекрас
		this.setCell(this.x, this.y, rule[1]);
		
		// поворот
		this.turn(rule[0]);
		
		// движение в направлении
		switch (this.ant) {
			case Ant.left:
				this.x -= 1;
				break;
			case Ant.right:
				this.x += 1;
				break;
			case Ant.up:
				this.y -= 1;
				break;
			case Ant.down:
				this.y += 1;
				break;
		}
	}
	
	_generateTile() {
		let tile = [];
		for (let y = 0; y < tileSize; y++) {
			tile[y] = [];
			for (let x = 0; x < tileSize; x++) {
				tile[y][x] = 0;
			}
		}
		return tile;
	}
	
	_getIndex(val) {
		// normalize index
		return ((val % tileSize) + tileSize) % tileSize;
	}
	
	turn(turn = 0) {
		// 1 - поворот вправо, -1 поворот влево
		this.ant = (((this.ant + turn) % 4) + 4) % 4;
	}
	
	getCell(x, y) {
		let key = String(Math.floor(x / tileSize)) + ":" + String(Math.floor(y / tileSize));
		//if (!this.tiles[key]) this.tiles[key] = this._generateTile();
		if (!this.tiles[key]) return 0;
		return this.tiles[key][this._getIndex(y)][this._getIndex(x)];
	}
	
	setCell(x, y, val) {
		let key = String(Math.floor(x / tileSize)) + ":" + String(Math.floor(y / tileSize));
		if (!this.tiles[key]) this.tiles[key] = this._generateTile();
		this.tiles[key][this._getIndex(y)][this._getIndex(x)] = val;
	}
}

Ant.left = 0;
Ant.up = 1;
Ant.right = 2;
Ant.down = 3;
