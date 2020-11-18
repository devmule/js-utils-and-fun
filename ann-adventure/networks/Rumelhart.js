import Matrix from "../../math/Matrix.js";
import {sigmoid, sigmoidDerivative} from "./activationFunctions.js";

export default class Rumelhart {
	constructor(l1, l2, ...layers) {
		let ls = [l1, l2, ...layers];
		this._synapses = [];
		this._biases = [];
		for (let i = 0; i < ls.length - 1; i++) {
			this._synapses.push(new Matrix(ls[i], ls[i + 1]).randomize(-1, 1));
			this._biases.push(new Matrix(1, ls[i + 1]).randomize(-1, 1));
		}
	}
	
	get raw() {
		return JSON.stringify({
			synapses: this._synapses,
			biases: this._biases,
		});
	}
	
	set raw(val) {
		val = JSON.parse(val);
		this._synapses.length = 0;
		for (let i = 0; i < val.synapses.length; i++) this._synapses.push(new Matrix(val.synapses[i]));
		this._biases.length = 0;
		for (let i = 0; i < val.biases.length; i++) this._biases.push(new Matrix(val.biases[i]));
	}
	
	feedForward(inp) {
		let li = new Matrix(inp);
		for (let i = 0; i < this._synapses.length; i++)
			li = li.dot(this._synapses[i]).add(this._biases[i]);
		return li.toList();
	}
	
	learn(pairs, epochs = 100000, lr = 0.01, errCallback = null, errFrequency = 1000) {
		if (pairs.length) for (let i = 0; i < epochs; i++) {
			let errValue = 0;
			for (let j = 0; j < pairs.length; j++) {
				let inp = new Matrix(pairs[j][0]);
				let out = new Matrix(pairs[j][1]);
				
				let Si = [inp];
				let Xi = [inp.clone().forEachElement(sigmoid)];
				for (let k = 0; k < this._synapses.length; k++) {
					let li = Xi[k].dot(this._synapses[k]).add(this._biases[k]);
					Si.push(li);
					Xi.push(li.clone().forEachElement(sigmoid));
				}
				
				let Ei = [out.clone().subtract(Xi[Xi.length - 1])];
				for (let k = Xi.length - 2; k > 0; k--)
					Ei.unshift(Ei[0].dot(this._synapses[k].T));
				
				if (errCallback && !(i % errFrequency)) errValue += Ei[Ei.length - 1].abs.mean;
				
				for (let k = 0; k < this._synapses.length; k++) {
					let grad = Ei[k].multiply(Si[k + 1].forEachElement(sigmoidDerivative));
					let dw = grad.T.dot(Xi[k]).T;
					this._synapses[k].forEachElement((v, x, y) => v + dw[x][y] * lr);
					this._biases[k].forEachElement((v, x, y) => v + dw.averageRow(y) * lr);
				}
			}
			if (errCallback && !(i % errFrequency)) errCallback(errValue / pairs.length);
		}
	}
}
