class Matrix {
	
	/**
	 * @param {number|Array.<Array.<number>>} val
	 * @param {number} [valY=0]
	 * @return Matrix
	 * **/
	constructor(val = 0, valY = 0) {
		/**
		 * @private {Array.<Array.<number>>}
		 */
		this._elements = [];
		
		if (val instanceof Array) { // if array given, copy values from array
			for (let y = 0; y < val.length; y++) {
				for (let x = 0; x < val[y].length; x++)
					this._elements[y].push(val[x][y]);
			}
		} else // generate Matrix with zeroes
			for (let y = 0; y < valY; y++) {
				this._elements.push([]);
				for (let x = 0; x < val; x++)
					this._elements[y].push(0);
			}
		return this;
	}
	
	// simple operations
	/** Add given matrix values to this matrix values.
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
	
	/** Subtract given matrix values from this matrix values.
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
}
