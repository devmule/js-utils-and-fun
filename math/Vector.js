/** Class representing a vector. */
class Vector extends Array {
	
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
	
	/** Cross product of vectors.
	 * Return vector as normal of shape (normal of line in 2D, normal of plane in 3D, normal of volume in 4D etc.).
	 * @param {Vector} v
	 * @return Vector
	 * **/
	static cross(...v) {
		// amount of vectors depends on vectors dimensions
		// amount of vectors = vectors dimensions - 1
		if (!v.length)
			throw new Error(`Need at least 1 vector as parameter`);
		
		let dim = v[0].length;
		for (let i = 1; i < v.length; i++) if (v[i].length !== dim)
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
					matrix[y].push(v[y][x % dim]);
			}
			e[i] = det(matrix) * (i % 2 ? -1 : 1);
		}
		
		return e;
	}
	
	// trigonometry
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
	
	/**
	 * @param {number|Array} elements
	 * @return Vector
	 * **/
	constructor(...elements) {
		super();
		if (elements.length && elements[0] instanceof Array) this.fromArray(elements[0]);
		else this.fromArray(elements);
		return this;
	}
	
	/** Read elements from given array.
	 * @param {Array} array
	 * @return Vector
	 * **/
	fromArray(array) {
		while (this.length) this.pop();
		for (let i = 0; i < array.length; i++) this[i] = array[i];
		return this;
	}
	
	/** Returns scalar value of vector magnitude.
	 * @return number
	 * **/
	get magnitude() {
		return Math.sqrt(this.reduce((p, c, i, arr) => p + c * c));
	}
	
	/** Set magnitude to given value.
	 * @param {number} magnitude
	 * **/
	set magnitude(magnitude) {
		let c = magnitude / this.magnitude;
		for (let i = 0; i < this.length; i++) this[i] *= c;
	}
	
	/** Returns new Vector with same values and dimensions.
	 * @return Vector
	 * **/
	clone() {
		return new Vector(this);
	}
	
	// simple operations
	/** Add given vector values to this vector values. Can work with different sizes vectors.
	 * @param {Vector} v
	 * @return Vector
	 * **/
	add(v) {
		for (let i = 0; i < Math.min(this.length, v.length); i++)
			this[i] += v[i];
		return this;
	}
	
	/** Subtract given vector values from this vector values. Can work with different sizes vectors.
	 * @param {Vector} v
	 * @return Vector
	 * **/
	subtract(v) {
		for (let i = 0; i < Math.min(this.length, v.length); i++)
			this[i] -= v[i];
		return this;
	}
	
	// scalar multiplication
	/** Multiply every value of vector by given value.
	 * @param {number} val
	 * @return Vector
	 * **/
	multiply(val) {
		for (let i = 0; i < this.length; i++) this[i] *= val;
		return this;
	}
	
	// vectors multiplications
	/** Return dot product of this vector and given vector.
	 * @param {Vector} v
	 * @return number
	 * **/
	dot(v) {
		let val = 0;
		for (let i = 0; i < Math.min(this.length, v.length); i++)
			val += this[i] * v[i];
		return val;
	}
	
	/** Cross product of this vector and given vectors.
	 * Return new vector as normal of shape (normal of line in 2D, normal of plane in 3D, normal of volume in 4D etc.).
	 * @param {Vector} v
	 * @return Vector
	 * **/
	cross(...v) {
		return Vector.cross(this, ...v);
	}
	
	// trigonometry
	/** Returns cos of angle between this vector and given vector.
	 * @param {Vector} v
	 * @return number
	 * **/
	cos(v) {
		return this.dot(v) / (this.magnitude * v.magnitude);
	}
	
	/** Returns angle between this vector and given vector in radians.
	 * @param {Vector} v
	 * @return number
	 * **/
	angle(v) {
		return Math.acos(this.cos(v));
	}
}
