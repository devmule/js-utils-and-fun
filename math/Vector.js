/** Class representing a vector. */
class Vector {
	/** Add one vector values to another vector values. Can work with different sizes vectors. Return new Vector.
	 * @param {Vector} v1
	 * @param {Vector} v2
	 * @return Vector
	 * **/
	static add(v1, v2) {
		return v1.clone().add(v2);
	}
	
	/** Subtract one vector values to another vector values. Can work with different sizes vectors. Return new Vector.
	 * @param {Vector} v1
	 * @param {Vector} v2
	 * @return Vector
	 * **/
	static subtract(v1, v2) {
		return v1.clone().subtract(v2);
	}
	
	/** Multiply every value of given vectors clone by given value. Return new Vector.
	 * @param {Vector} v1
	 * @param {number} val
	 * @return Vector
	 * **/
	static multiply(v1, val) {
		return v1.clone().multiply(val);
	}
	
	/** Return dot product of given vectors.
	 * @param {Vector} v1
	 * @param {Vector} v2
	 * @return number
	 * **/
	static dot(v1, v2) {
		return v1.dot(v2);
	}
	
	/** Return cos of angle between given vectors.
	 * @param {Vector} v1
	 * @param {Vector} v2
	 * @return Number
	 * **/
	static cos(v1, v2) {
		return v1.cos(v2);
	}
	
	/** Return angle between given vectors.
	 * @param {Vector} v1
	 * @param {Vector} v2
	 * @return number
	 * **/
	static angle(v1, v2) {
		return v1.angle(v2);
	}
	
	/** Cross product of vectors. Return vector as normal of shape (normal of line in 2D, normal of plane in 3D, normal of volume in 4D etc.).
	 * @param {Vector} v
	 * @return Vector
	 * **/
	static cross(...v) {
		// amount of vectors depends on vectors dimensions
		// amount of vectors = vectors dimensions - 1
		if (!v.length)
			throw new Error(`Need at least 1 vector as parameter`);
		
		let dim = v[0].dimensions;
		for (let i = 1; i < v.length; i++) if (v[i].dimensions !== dim)
			throw new Error(`Vectors dimensions are different! Must be the same!`);
		
		if (dim < 2)
			throw new Error(`Vectors with dimension less than 2 cannot have a cross product`);
		
		if (v.length !== dim - 1)
			throw new Error(`Wrong amount of vectors! need ${dim - 1}, got ${v.length}!`);
		
		let e = v[0].clone();
		
		let det = (matrix) => {
			// we've got square matrices, so w == h;
			if (matrix.length === 1) return matrix[0][0];  // det of 1x1 matrix is its element
			
			let d = 0;
			for (let i = 0; i < matrix.length; i++) { // for each associative element in 1-st col
				let newMatrix = [];  // create matrix to calculate it's det
				for (let y = i + 1; y < i + matrix.length; y++) { // matrix.length is equivalent to dim
					let v = [];
					for (let x = 1; x < matrix.length + 1; x++) v.push(matrix[y % matrix.length][x % matrix.length]);
					newMatrix.push(v);
				}
				d += matrix[i][0] * det(newMatrix) * (i % 2 ? -1 : 1);
			}
			return d;
		};
		
		for (let i = 0; i < dim; i++) { // for each element of new vector
			let matrix = []; // create a matrix for calculating a det
			for (let y = 0; y < v.length; y++) {
				matrix[y] = [];
				for (let x = i + 1; x < i + dim; x++)
					matrix[y].push(v[y]._elements[x % dim]);
			}
			e._elements[i] = det(matrix) * (i % 2 ? -1 : 1);
		}
		
		return e;
	}
	
	/**
	 * @param {number} elements Elements of vector, amount of elements is vectors dimension.
	 * @return Vector
	 * **/
	constructor(...elements) {
		/**
		 * @private {Array.<number>}
		 */
		this._elements = elements;
		return this;
	}
	
	/** Read elements from given array.
	 * @param {Array} array
	 * @return Vector
	 * **/
	fromArray(array) {
		this._elements = array.map((x) => x);
		return this;
	}
	
	/** Returns vector dimensions amount.
	 * @return number
	 * **/
	get dimensions() {
		return this._elements.length;
	}
	
	/** Returns scalar value of vector magnitude.
	 * @return number
	 * **/
	get length() {
		return Math.sqrt(this._elements.reduce((p, c, i, arr) => p + c * c));
	}
	
	/** Returns new Vector with same values and dimensions.
	 * @return Vector
	 * **/
	clone() {
		return new Vector().fromArray(this._elements);
	}
	
	// simple operations
	/** Add given vector values to this vector values. Can work with different sizes vectors.
	 * @param {Vector} v
	 * @return Vector
	 * **/
	add(v) {
		for (let i = 0; i < Math.min(this.dimensions, v.dimensions); i++)
			this._elements[i] += v._elements[i];
		return this;
	}
	
	/** Subtract given vector values from this vector values. Can work with different sizes vectors.
	 * @param {Vector} v
	 * @return Vector
	 * **/
	subtract(v) {
		for (let i = 0; i < Math.min(this.dimensions, v.dimensions); i++)
			this._elements[i] -= v._elements[i];
		return this;
	}
	
	// scalar multiplication
	/** Multiply every value of vector by given value.
	 * @param {number} val
	 * @return Vector
	 * **/
	multiply(val) {
		for (let i = 0; i < this.dimensions; i++) this._elements[i] *= val;
		return this;
	}
	
	// vectors multiplications
	/** Return dot product of this vector and given vector.
	 * @param {Vector} v
	 * @return number
	 * **/
	dot(v) {
		let val = 0;
		for (let i = 0; i < Math.min(this.dimensions, v.dimensions); i++)
			val += this._elements[i] * v._elements[i];
		return val;
	}
	
	// trigonometry
	/** Returns cos of angle between this vector and given vector.
	 * @param {Vector} v
	 * @return number
	 * **/
	cos(v) {
		return this.dot(v) / (this.length * v.length);
	}
	
	/** Returns angle between  this vector and given vector in radians.
	 * @param {Vector} v
	 * @return number
	 * **/
	angle(v) {
		return Math.acos(this.cos(v));
	}
}
