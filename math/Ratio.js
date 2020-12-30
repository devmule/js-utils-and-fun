// https://habr.com/ru/company/skillfactory/blog/535138/

function eq(a, b) {
	return (a.n * b.d === a.d * b.n);
}

function lt(a, b) {
	return (a.n * b.d < a.d * b.n);
}

/** Class representing a rational number. */
export default class Ratio {
	
	/** Euclid's algorithm. Return greatest common divisor of two numbers.
	 * @param {BigInt} a
	 * @param {BigInt} b
	 * @return {BigInt}
	 * */
	static gcd(a, b) {
		let t;
		while (b !== 0n) {
			t = b;
			b = a % b;
			a = t;
		}
		return a;
	}
	
	/**
	 * @param {(BigInt|number)} n - numerator
	 * @param {(BigInt|number)} d - denominator
	 * */
	constructor(n, d) {
		this.n = BigInt(n);
		this.d = BigInt(d);
	}
	
	/** Return true if this equals n.
	 * @param {Ratio} n
	 * @return {Boolean}
	 * */
	eq(n) {
		return eq(this, n);
	}
	
	/** Return true if this less than n.
	 * @param {Ratio} n
	 * @return {Boolean}
	 * */
	lt(n) {
		return lt(this, n);
	}
	
	/** Return true if this less than or equals n.
	 * @param {Ratio} n
	 * @return {Boolean}
	 * */
	lte(n) {
		return lt(this, n) || eq(this, n);
	}
	
	/** Return true if this greater than n.
	 * @param {Ratio} n
	 * @return {Boolean}
	 * */
	gt(n) {
		return lt(n, this);
	}
	
	/** Return true if this greater than or equals n.
	 * @param {Ratio} n
	 * @return {Boolean}
	 * */
	gte(n) {
		return lt(n, this) || eq(n, this);
	}
	
	/** Returns new Ratio with same values.
	 * @return {Ratio}
	 * */
	clone() {
		return new Ratio(this.n, this.d);
	}
	
	/** Simplify the ratio. Return this.
	 * @return {Ratio}
	 * */
	simplify() {
		let sign = (this.n * this.d) > 0n ? 1n : -1n;
		let nabs = this.n < 0 ? this.n * -1n : this.n;
		let dabs = this.d < 0 ? this.d * -1n : this.d;
		let gcd = Ratio.gcd(nabs, dabs);
		this.n = (sign * nabs) / gcd;
		this.d = dabs / gcd;
		return this;
	}
	
	/** Return pretty string.
	 * @return {String}
	 * **/
	toString() {
		return `${this.n}/${this.d}`;
	}
	
	/** Return number value of this ratio.
	 * @return {number}
	 * **/
	valueOf() {
		return Number(this.n) / Number(this.d);
	}
}
