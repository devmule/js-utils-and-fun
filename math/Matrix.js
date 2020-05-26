class Matrix extends Array {
	
	/**
	 * @param {number|Array.<Array.<number>>} w
	 * @param {number} [h=0]
	 * @return Matrix
	 * **/
	constructor(w, h = 0) {
		super();
		
		if (w instanceof Array) {  // if array given, copy values from array
			this.fromArray(w);
			
		} else { // or create zero matrix with given dimensions
			for (let x = 0; x < w; x++) {
				this.push([]);
				for (let y = 0; y < h; y++)
					this[x].push(0);
			}
		}
		
		return this;
	}
	
	/** Returns number of columns of matrix;
	 * @return number
	 * **/
	get width() {
		return this.length;
	}
	
	/** Returns number of rows of matrix;
	 * @return number
	 * **/
	get height() {
		return this.length ? this[0].length : 0;
	}
	
	
	/** Read elements from given array. Return this matrix.
	 * @param {Array.<Array.<number>>} array
	 * @return Matrix
	 * **/
	fromArray(array) {
		while (this.length) this.pop();
		for (let i = 0; i < array.length; i++) this[i] = array[i].map(val => val);
		return this;
	}
	
	/** For each element in Matrix, set element to result of given function.
	 * @param {function(number, int, int)} func - function(elem value, elem X, elem Y)
	 * @return Matrix
	 * **/
	forEach(func) {
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				this[x][y] = func(this[x][y], x, y);
	}
	
	/** Returns new Matrix with same values, or clone values to given Matrix instance.
	 * @return Matrix
	 * **/
	clone() {
		return new Matrix(this);
	}
	
	// simple operations
	/** Add given matrix values to this matrix values. Return this matrix.
	 * @param {Matrix} m
	 * @return Matrix
	 * **/
	add(m) {
		if (this.width !== m.width || this.height !== m.height)
			throw new Error(`Different dimensions of matrices. Given ${this.width}×${this.height} and ${m.width}×${m.height}. Must be the same!`);
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				this[x][y] += m[x][y];
		return this;
	}
	
	/** Subtract given matrix values from this matrix values. Return this matrix.
	 * @param {Matrix} m
	 * @return Matrix
	 * **/
	subtract(m) {
		if (this.width !== m.width || this.height !== m.height)
			throw new Error(`Different dimensions of matrices. Given ${this.width}×${this.height} and ${m.width}×${m.height}. Must be the same!`);
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				this[x][y] -= m[x][y];
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
	
	// Matrix transformations
	/** Transpose matrix. Swap X and Y dimensions.
	 * @return Matrix
	 * **/
	transpose() {
		let m = new Matrix(this.height, this.width);
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				m[y][x] = this[x][y];
		this.fromArray(m);
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
		return JSON.stringify(this).split("],[").join("],\n[")
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
	
	
	/** Add random value from min to max to every element. Return this matrix.
	 * @return Matrix
	 * **/
	randomize(min = 0, max = 1) {
		this.forEach((e) => {
			return e + (Math.random() * (max - min) + min);
		});
		return this;
	}
}
