import Matrix from "../../math/Matrix.js";
import {sigmoid, sigmoidDerivative} from "./activationFunctions.js";

Matrix.prototype.averageRow = function (row) {
	let val = 0;
	for (let i = 0; i < this.width; i++) val += this[i][row];
	return val / this.width;
};

export default class Rosenblatt {
	constructor(inp, hid, out) {
		this.inp_hid = new Matrix(inp, hid).randomize(-1, 1);
		this.hid_out = new Matrix(hid, out).randomize(-1, 1);
		this.hid_biases = new Matrix(1, hid).randomize(-1, 1);
		this.out_biases = new Matrix(1, out).randomize(-1, 1);
	}
	
	feedForward(inp) {
		let li = new Matrix(inp);
		let lh = li.dot(this.inp_hid).add(this.hid_biases).forEachElement(sigmoid);
		let lo = lh.dot(this.hid_out).add(this.out_biases).forEachElement(sigmoid);
		return lo;
	}
	
	learn(pairs, epochs = 100000, lr = 0.01) {
		let errValue = 0;
		for (let j = 0; j < pairs.length; j++) {
			let inp = new Matrix(pairs[j][0]);
			let out = new Matrix(pairs[j][1]);
			
			let li = inp;
			let lh = li.dot(this.inp_hid).add(this.hid_biases).forEachElement(sigmoid);
			let lo = lh.dot(this.hid_out).add(this.out_biases).forEachElement(sigmoid);
			
			let err_o = out.subtract(lo);
			let d_lo = err_o.clone().multiply(lo.clone().forEachElement(sigmoidDerivative));
			
			let err_h = d_lo.dot(this.hid_out.T);
			let d_lh = err_h.clone().multiply(lh.clone().forEachElement(sigmoidDerivative));
			
			this.hid_out.add(lh.T.dot(d_lo).multiply(lr));
			this.inp_hid.add(li.T.dot(d_lh).multiply(lr));
			this.out_biases.forEachElement((v, x, y) => v + d_lo.averageRow(y) * lr);
			this.hid_biases.forEachElement((v, x, y) => v + d_lh.averageRow(y) * lr);
			
			errValue += err_o.abs.mean;
		}
		return errValue / pairs.length;
	}
}

