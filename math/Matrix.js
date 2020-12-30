/** Class representing a matrix. */
export default class Matrix extends Array {
	
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
	 * @param {Matrix} m2
	 * @param {Matrix} m1
	 * @return {Matrix}
	 * **/
	static dot(m1, m2) {
		if (m2.width !== m1.height)
			throw new Error(`1st matrix rows count must be equal 2nd matrix cols count. Given (${
				m1.width}×${m1.height}) and (${m2.width}×${m2.height}) matrices. ${m2.width} != ${m1.height}`);
		
		let e = new Matrix(m1.width, m2.height);
		
		for (let x = 0; x < e.width; x++)
			for (let y = 0; y < e.height; y++)
				for (let i = 0; i < m2.width; i++)
					e[x][y] += m1[x][i] * m2[i][y];
		
		return e;
	}
	
	/**
	 * @param {(number|Array.<Array.<number>>|Matrix)} w
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
		
		this.length = 0;
		for (let i = 0; i < array.length; i++) this[i] = [...array[i]];
		
		return this;
	}
	
	/** For each element in Matrix, set element to result of given function.
	 * @param {function(number, int, int)} func - function(elem value, elem X, elem Y)
	 * @return {Matrix}
	 * **/
	forEachElement(func) {
		for (let x = 0; x < this.width; x++)
			for (let y = 0; y < this.height; y++)
				this[x][y] = func(this[x][y], x, y);
		
		return this;
	}
	
	/** Returns new Matrix with same values.
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
	 * @param {(number|Matrix)} val
	 * @return {Matrix}
	 * **/
	multiply(val) {
		if (val instanceof Matrix) this.forEachElement((v, x, y) => v * val[x][y]);
		else this.forEachElement(e => e * val);
		return this;
	}
	
	
	/** Multiply matrix with given matrix. Return new matrix as multiplication product.
	 * @param {Matrix} m
	 * @return {Matrix}
	 * **/
	dot(m) {
		return Matrix.dot(this, m);
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
	/** Return new inverted matrix. Matrix.dot(this, this.I) = identity  matrix.
	 * @return {(Matrix|null)}
	 * **/
	get I() {
		let d = this.det;
		
		// if det === 0, or matrix haven't det (det === null)
		if (!d) return null;
		
		// Jordan method
		let mtr = this.clone();
		let idn = new Matrix(this.length, this.length).forEachElement((v, x, y) => x === y ? 1 : 0);
		let el = 0;
		
		for (let i = 0; i < this.length; i++) {
			for (let j = i; j < this.length; j++) {
				el = mtr[i][i];
				if (el === 0) {
					[idn[i], idn[j]] = [idn[j], idn[i]];
					[mtr[i], mtr[j]] = [mtr[j], mtr[i]];
				} else break;
			}
			if (el === 0) return null;
			
			for (let j = 0; j < this.length; j++) {
				idn[i][j] /= el;
				mtr[i][j] /= el;
			}
			
			for (let j = i + 1; j < this.length; j++) {
				el = mtr[j][i];
				for (let k = 0; k < this.length; k++) {
					idn[j][k] -= idn[i][k] * el;
					mtr[j][k] -= mtr[i][k] * el;
				}
			}
		}
		
		for (let i = this.length - 1; i > 0; i--) {
			for (let j = i - 1; j >= 0; j--) {
				el = mtr[j][i];
				for (let k = 0; k < this.length; k++) {
					idn[j][k] -= idn[i][k] * el;
					mtr[j][k] -= mtr[i][k] * el;
				}
			}
		}
		
		return idn;
	}
	
	/** Return determinant of this matrix if exist, otherwise return null.
	 * @return {(number|null)}
	 * **/
	get det() {
		// only square matrix can have det
		if (this.width !== this.height) return null;
		if (this.length === 1) return this[0][0];
		if (this.length === 2) return this[0][0] * this[1][1] - this[1][0] * this[0][1];
		
		let d = 0, p = 0, m = 0;
		for (let i = 0; i < this.length; i++) {
			p = 1;
			m = 1;
			for (let j = 0; j < this.length; j++) {
				p *= this[j][(j + i) % this.length];
				m *= this[this.length - j - 1][(j + i) % this.length];
			}
			d += p - m;
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
	
	/** Return pretty JSON string of this matrix array.
	 * @return {String}
	 * **/
	toString() {
		return JSON.stringify(this).split("],[").join("],\n [")
	}
}
