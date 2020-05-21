class Vector {
	static add(/*Vector*/v1, /*Vector*/v2) {
		return v1.clone().add(v2);
	}
	
	static subtract(/*Vector*/v1, /*Vector*/v2) {
		return v1.clone().subtract(v2);
	}
	
	static multiply(/*Vector*/v1, /*number*/val) {
		return v1.clone().multiply(val);
	}
	
	static dot(/*Vector*/v1, /*Vector*/v2) {
		return v1.dot(v2);
	}
	
	static cos(/*Vector*/v1, /*Vector*/v2) {
		return v1.cos(v2);
	}
	
	static angle(/*Vector*/v1, /*Vector*/v2) {
		return v1.angle(v2);
	}
	
	static fromArray(/*array*/array) {
		return new Vector(...array);
	}
	
	constructor(/*number*/...elements) {
		/*[number]*/
		this._elements = elements;
		return this;
	}
	
	get length() {
		/** returns scalar value of vector magnitude **/
		return Math.sqrt(this._elements.reduce((p, c, i, arr) => p + c * c));
	}
	
	clone(/*Vector*/v = null) {
		if (!v) v = new Vector();
		v._elements = this._elements.map((x) => x);
		return v;
	}
	
	// simple operations
	add(/*Vector*/v) {
		/** Add one vector values to this vector values.
		 * Can work with different sizes vectors. **/
		for (let i = 0; i < Math.min(this._elements.length, v._elements.length); i++)
			this._elements[i] += v._elements[i];
		return this;
	}
	
	subtract(/*Vector*/v) {
		/** Subtract one vector values from this vector values.
		 * Can work with different sizes vectors. **/
		for (let i = 0; i < Math.min(this._elements.length, v._elements.length); i++)
			this._elements[i] -= v._elements[i];
		return this;
	}
	
	// scalar multiplication
	multiply(/*number*/val) {
		for (let i = 0; i < this._elements.length; i++) this._elements[i] *= val;
		return this;
	}
	
	// vectors multiplications
	dot(/*Vector*/v) {
		let val = 0;
		for (let i = 0; i < Math.min(this._elements.length, v._elements.length); i++)
			val += this._elements[i] * v._elements[i];
		return val;
	}
	
	// trigonometry
	cos(/*Vector*/v) {
		return this.dot(v) / (this.length * v.length);
	}
	
	angle(/*Vector*/v) {
		return Math.acos(this.cos(v));
	}
}
