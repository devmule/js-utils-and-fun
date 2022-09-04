/**
 * @module Rng
 * @description Provides class {@link LCGRandom} that implements Linear congruential generator.
 * https://en.wikipedia.org/wiki/Linear_congruential_generator
 * */

// LCG using GCC's constants
const /** @internal */ M = 0x80000000; // 2**31
const /** @internal */ A = 1103515245;
const /** @internal */ C = 12345;

/**
 * @class LCGRandom
 * @description Implements Linear congruential generator.
 * */
export class LCGRandom {
	
	/**
	 * @param {number} [seed]
	 * */
	constructor(seed) {
		this.state = 0;
		this.seed = seed ?? Math.floor(Math.random() * (M - 1));
		this.reset();
	}
	
	/**
	 * @description Drop {@link LCGRandom.state} to its initial value.
	 * */
	reset() {
		this.state = this.seed;
	}
	
	/**
	 * @return {number} Integer based on state.
	 * */
	nextInt() {
		this.state = (A * this.state + C) % M;
		return this.state;
	}
	
	/**
	 * @return {number} Float based on state in range [0, 1).
	 * */
	nextFloat() {
		return this.nextInt() / (M - 1);
	}
	
	/**
	 * @param {number} start Integer value.
	 * @param {number} end Integer value.
	 * @return {number} random integer in given range.
	 * */
	nextRange(start, end) {
		const rangeSize = end - start;
		const randomUnder = this.nextInt() / M;
		return start + Math.floor(randomUnder * rangeSize);
	}
	
	/**
	 * @param {Array<T>} array
	 * @return {T} Random element of an array.
	 * @template T
	 * */
	choice(array) {
		return array[this.nextRange(0, array.length)];
	}
	
}
