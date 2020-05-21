class Matrix {
	static fromArray(/*Array*/array) {
		let m = new Matrix();
		
		let deepCopy = (arrayElem, /*Array*/copiedElem) => {
			for (let i = 0; i < arrayElem.length; i++) {
				if (arrayElem[i] instanceof Array)
					copiedElem.push(deepCopy(arrayElem[i], []));
				else
					copiedElem.push(arrayElem[i]);
			}
			return copiedElem;
		};
		
		m._elements = deepCopy(array, m._elements);
		return m;
	}
	
	static add(/*Matrix*/m1, /*Matrix*/m2) {
		return Matrix.fromArray(m1._elements).add(m2);
	}
	
	constructor(/*int*/...dimensions) {
		this._elements = [];
		
		let deepCreate = (/*int*/index, /*Array*/array) => {
			if (index < dimensions.length - 1) {
				for (let i = 0; i < dimensions[index]; i++) {
					let tmp = [];
					deepCreate(index + 1, tmp);
					array.push(tmp);
				}
			} else
				for (let i = 0; i < dimensions[index]; i++)
					array.push(0);
		};
		
		deepCreate(0, this._elements);
		return this;
	}
	
	forEach(/*function*/func) {
		let deep = (/*Array*/array, index = 0, sameIndex = true) => {
			for (let i = 0; i < array.length; i++) {
				if (array[i] instanceof Array)
					deep(array[i], i, index === i && sameIndex);
				else
					func(array, i, index === i && sameIndex);
			}
		};
		for (let i = 0; i < this._elements.length; i++) deep(this._elements[i], i);
	}
	
	add(/*Matrix*/m) {
		let deepAdd = (arr1, arr2) => {
			for (let i = 0; i < arr1.length; i++) {
				if (arr1[i] instanceof Array) deepAdd(arr1[i], arr2[i]);
				else arr1[i] += arr2[i];
			}
		};
		deepAdd(this._elements, m._elements);
		return this;
	}
	
	subtract(/*Matrix*/m) {
		let deepSubtract = (arr1, arr2) => {
			for (let i = 0; i < arr1.length; i++) {
				if (arr1[i] instanceof Array) deepSubtract(arr1[i], arr2[i]);
				else arr1[i] -= arr2[i];
			}
		};
		deepSubtract(this._elements, m._elements);
		return this;
	}
	
	// cool but usable only in console, can be used as JSON
	toString() {
		return JSON.stringify(this._elements).split("],[").join("],\n[")
	}
	
	// different super mega stuff
	randomize(/*number*/min = 0, /*number*/max = 1) {
		this.forEach((arr, i) => arr[i] += Math.random() * (max - min) + min);
		return this;
	}
	
	ones() {
		this.forEach((arr, i, onDiagonal) => arr[i] = 1);
		return this;
	}
	
	diagonalOnes() {
		this.forEach((arr, i, onDiagonal) => arr[i] = onDiagonal ? 1 : 0);
		return this;
	}
}

let m = new Matrix(10, 10).randomize();
console.log(m.subtract(m).toString());
