class Matrix {
	
	/**
	 * @param {number|Array.<Array.<number>>} val
	 * @param {number} [valY=0]
	 * @return Matrix
	 * **/
	constructor(val, valY = 0) {
		/**
		 * @private {Array.<Array.<number>>}
		 */
		this._elements = [];
		
		if (val instanceof Array) { // if array given, copy values from array
			this.fromArray(val);
		} else {// generate Matrix with zeroes
			for (let y = 0; y < valY; y++) {
				this._elements.push([]);
				for (let x = 0; x < val; x++)
					this._elements[y].push(0);
			}
			
			this._h = this._elements.length;
			this._w = this._elements[0] ? this._elements[0].length : 0;
		}
		
		return this;
	}
	
	/** Read elements from given array. Return this matrix.
	 * @param {Array.<Array.<number>>} array
	 * @return Matrix
	 * **/
	fromArray(array) {
		this._elements = [];
		for (let y = 0; y < array.length; y++)
			this._elements[y] = array[y].map((x) => x);
		
		this._h = this._elements.length;
		this._w = this._elements[0] ? this._elements[0].length : 0;
		
		return this;
	}
	
	/** For each element in Matrix, set element to result of given function.
	 * @param {function(number, int, int)} func - function(elem value, elem X, elem Y)
	 * @return Matrix
	 * **/
	forEach(func) {
		for (let y = 0; y < this._h; y++)
			for (let x = 0; x < this._w; x++)
				this._elements[y][x] = func(this._elements[y][x], x, y);
	}
	
	/** Returns new Matrix with same values, or clone values to given Matrix instance.
	 * @return Matrix
	 * **/
	clone() {
		return new Matrix(this._elements);
	}
	
	// simple operations
	/** Add given matrix values to this matrix values. Return this matrix.
	 * @param {Matrix} m
	 * @return Matrix
	 * **/
	add(m) {
		for (let y = 0; y < this._elements.length; y++) {
			for (let x = 0; x < this._elements[y].length; x++) {
				this._elements[y][x] += m._elements[y][x];
			}
		}
		return this;
	}
	
	/** Subtract given matrix values from this matrix values. Return this matrix.
	 * @param {Matrix} m
	 * @return Matrix
	 * **/
	subtract(m) {
		for (let y = 0; y < this._elements.length; y++) {
			for (let x = 0; x < this._elements[y].length; x++) {
				this._elements[y][x] -= m._elements[y][x];
			}
		}
		return this;
	}
	
	/** Multiply every element of Matrix by given value. Return this matrix.
	 * @param {number} val
	 * @return Matrix
	 * **/
	multiply(val) {
		this.forEach((e) => {
			return e * val;
		});
		return this;
	}
	
	//
	//
	// some tasty methods
	//
	//
	
	/** Return pretty JSON string of this matrix array.
	 * @return String
	 * **/
	toString() {
		return JSON.stringify(this._elements).split("],[").join("],\n[")
	}
	
	/** Set every element of this matrix 1 if x == y, 0 otherwise. Return this matrix.
	 * @return Matrix
	 * **/
	diagonalOnes() {
		this.forEach((e, x, y) => {
			return (x === y) ? 1 : 0;
		});
		return this;
	}
	
	
	/** Set add random value from min to max to every element. Return this matrix.
	 * @return Matrix
	 * **/
	randomize(min = 0, max = 1) {
		this.forEach((e) => {
			return e + (Math.random() * (max - min) + min);
		});
		return this;
	}
}

let m = new Matrix(10, 10).diagonalOnes();
console.log(m.toString());
