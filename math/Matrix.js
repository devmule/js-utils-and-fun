/** Class representing a matrix. */
class Matrix extends Array {
	
	/** Return new matrix. Elements of new matrix are sum of elements of given matrices in same position.
	 * @param {Matrix} m1
	 * @param {Matrix} m2
	 * @return {Matrix}
	 * **/
	static add(m1, m2) {
		return m1.clone().add(m2);
	}
	
	/** Return new matrix. Elements of new matrix are difference between elements of given matrices in same position.
	 * @param {Matrix} m1
	 * @param {Matrix} m2
	 * @return {Matrix}
	 * **/
	static subtract(m1, m2) {
		return m1.clone().subtract(m2);
	}
	
	/** Return new matrix. Elements of new matrix are equal to elements of given matrices multiplied by given value.
	 * @param {Matrix} m
	 * @param {number} val
	 * @return {Matrix}
	 * **/
	static multiply(m, val) {
		return m.clone().multiply(val);
	}
	
	/** Multiply given matrices. Return new matrix as multiplication product.
	 * @param {Matrix} m1
	 * @param {Matrix} m2
	 * @return {Matrix}
	 * **/
	static dot(m1, m2) {
		return m1.dot(m2);
	}
	
	/**
	 * @param {(number|Array.<Array.<number>>)} w
	 * @param {number} [h=0]
	 * @return {Matrix}
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
	 * @return {number}
	 * **/
	get width() {
		return this.length;
	}
	
	/** Returns number of rows of matrix;
	 * @return {number}
	 * **/
	get height() {
		return this.length ? this[0].length : 0;
	}
	
	
	/** Read elements from given array. Return this matrix.
	 * @param {Array.<Array.<number>>} array
	 * @return {Matrix}
	 * **/
	fromArray(array) {
		if (!array.length || !array[0].length)
			throw new Error(`Array must be two-dimensional. Must have at least 1 row and 1 col!`);
		
		while (this.length) this.pop();
		for (let i = 0; i < array.length; i++) this[i] = array[i].map(val => val);
		
		return this;
	}
	
	/** For each element in Matrix, set element to result of given function.
	 * @param {function(number, int, int)} func - function(elem value, elem X, elem Y)
	 * @return {Matrix}
	 * **/
	forEach(func) {
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				this[x][y] = func(this[x][y], x, y);
		
		return this;
	}
	
	/** Returns new Matrix with same values, or clone values to given Matrix instance.
	 * @return {Matrix}
	 * **/
	clone() {
		return new Matrix(this);
	}
	
	// simple operations
	/** Add given matrix values to this matrix values. Return this matrix.
	 * @param {Matrix} m
	 * @return {Matrix}
	 * **/
	add(m) {
		if (this.width !== m.width || this.height !== m.height)
			throw new Error(`Different dimensions of matrices. Given (${this.width}×${this.height}) and (${m.width}×${m.height}). Must be the same!`);
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				this[x][y] += m[x][y];
		return this;
	}
	
	/** Subtract given matrix values from this matrix values. Return this matrix.
	 * @param {Matrix} m
	 * @return {Matrix}
	 * **/
	subtract(m) {
		if (this.width !== m.width || this.height !== m.height)
			throw new Error(`Different dimensions of matrices. Given (${this.width}×${this.height}) and (${m.width}×${m.height}). Must be the same!`);
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				this[x][y] -= m[x][y];
		return this;
	}
	
	/** Multiply every element of Matrix by given value. Return this matrix.
	 * @param {number} val
	 * @return {Matrix}
	 * **/
	multiply(val) {
		this.forEach((e) => {
			return e * val;
		});
		return this;
	}
	
	
	/** Multiply matrix with given matrix. Return new matrix as multiplication product.
	 * @param {Matrix} m
	 * @return {Matrix}
	 * **/
	dot(m) {
		if (this.width !== m.height)
			throw new Error(`1 matrix cols must be equal 2 matrix rows. Given (${this.width}×${this.height}) and (${m.width}×${m.height}) matrices.`);
		
		let e = new Matrix(m.width, this.height);
		
		for (let x = 0; x < e.width; x++)
			for (let y = 0; y < e.height; y++)
				for (let i = 0; i < this.width; i++)
					e[x][y] += m[x][i] * this[i][y];
		
		return e;
	}
	
	// Matrix transformations
	/** Return new matrix with swapped X and Y dimensions.
	 * @return {Matrix}
	 * **/
	get T() {
		let m = new Matrix(this.height, this.width);
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				m[y][x] = this[x][y];
		return m;
	}
	
	// lineal algebra
	/** Return new inverted matrix. Matrix.dot(this, this.I) = matrix with ones on diagonals and zeros otherwise.
	 * @return {(Matrix|null)}
	 * **/
	get I() {
		// if det === 0, or matrix haven't det (det === null)
		let d = this.det;
		if (!d) return null; //throw new Error(`Determinant of matrix = 0, so it's cannot be inverted!`);
		
		let m = new Matrix(this.length, this.length); // matrix is square
		
		for (let x = 0; x < this.length; x++) {
			for (let y = 0; y < this.length; y++) {
				
				// each cell value = (1/m.det) * (smaller_matrix.det) * (+1 or -1 depends on position)
				
				// get a smaller matrix
				let a = new Matrix(this.length - 1, this.length - 1);
				for (let ax = 0; ax < this.length - 1; ax++)  // for each X [from i+1, to i-1] (looped)
					for (let ay = 0; ay < this.length - 1; ay++) // for each Y from [2 to end]
						a[ax][ay] = this[ax + (ax >= x ? 1 : 0)][ay + (ay >= y ? 1 : 0)];
				
				// matrix is inverted, so coords of x and y are swapped
				m[y][x] = 1 / d * a.det * ((x + y) % 2 ? -1 : 1);
			}
		}
		
		return m;
	}
	
	/** Return determinant of this matrix if exist, otherwise return null.
	 * @return {(number|null)}
	 * **/
	get det() {
		// only square matrix can have det
		if (this.width !== this.height) return null; // throw new Error(`Only square matrix can have det!`);
		
		let d = 0;
		
		// we've got square matrix, so (1×1) matrix's det is its value, and width == height == length
		if (this.length === 1) return this[0][0];
		if (this.length === 2) return this[0][0] * this[1][1] - this[1][0] * this[0][1];
		
		for (let i = 0; i < this.length; i++) { // associative element = this[i][0]
			if (this[i][0]) { // if associative element == 0, then result == 0, we dont need to calculate
				
				let m = new Matrix(this.length - 1, this.length - 1); // new matrix with less dimensions
				
				for (let x = 0; x < this.length - 1; x++)  // for each X [from i+1, to i-1] (looped)
					for (let y = 0; y < this.length - 1; y++) // for each Y from [2 to end]
						m[x][y] = this[x + (x >= i ? 1 : 0)][y + 1];
				
				// associative elem * ±det
				d += this[i][0] * m.det * (i % 2 ? -1 : 1);
			}
		}
		return d;
	}
	
	/** Change shape of matrix. Cut if width or height is bigger. expanded values become 0.
	 * @param {number} width
	 * @param {number} height
	 * @return {Matrix}
	 * **/
	reshape(width, height) {
		if (width < 1 || height < 1)
			throw new RangeError(`New shape must have at least 1 row and 1 col!`);
		
		while (this.length > width) this.pop();  // cut width if need
		for (let x = 0; x < width; x++) {
			if (x >= this.length) this.push([]);  // add width if need
			
			while (this[x].length > height) this[x].pop();  // cut height if need
			for (let y = 0; y < height; y++) {
				if (y >= this[x].length) this[x].push(0);  // add height if need
			}
		}
		
		return this;
	}
	
	//
	//
	// some tasty methods
	//
	//
	
	/** Return pretty JSON string of this matrix array.
	 * @return {String}
	 * **/
	toString() {
		return JSON.stringify(this).split("],[").join("],\n [")
	}
	
	/** Set every element of this matrix 1 if x == y, 0 otherwise. Return this matrix.
	 * @return {Matrix}
	 * **/
	diagonalOnes() {
		this.forEach((e, x, y) => {
			return (x === y) ? 1 : 0;
		});
		return this;
	}
	
	
	/** Add random value from min to max to every element. Return this matrix.
	 * @return {Matrix}
	 * **/
	randomize(min = 0, max = 1) {
		this.forEach((e) => {
			return e + (Math.random() * (max - min) + min);
		});
		return this;
	}
}
