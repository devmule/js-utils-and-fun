import Matrix from "../../math/Matrix.js";
import {sigmoid, sigmoidDerivative} from "./activationFunctions.js";

export default class Rosenblatt {
	constructor(inp, hid, out) {
		this.inp_hid = new Matrix(inp, hid).randomize(-10, 10);
		this.hid_out = new Matrix(hid, out).randomize(-10, 10);
		this.hid_biases = new Matrix(1, hid).randomize(-10, 10);
		this.out_biases = new Matrix(1, out).randomize(-10, 10);
	}
	
	feedForward(inp) {
		let li = new Matrix(inp);
		let lh = li.dot(this.inp_hid).add(this.hid_biases).forEachElement(sigmoid);
		let lo = lh.dot(this.hid_out).add(this.out_biases).forEachElement(sigmoid);
		return lo.toList();
	}
	
	learn(pairs, epochs = 100000, lr = 0.01, errCallback = null, errFrequency = 1000) {
		if (pairs.length) for (let i = 0; i < epochs; i++) {
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
				
				if (errCallback && !(i % errFrequency)) errValue += err_o.abs.mean;
			}
			if (errCallback && !(i % errFrequency)) errCallback(errValue / pairs.length);
		}
	}
}

