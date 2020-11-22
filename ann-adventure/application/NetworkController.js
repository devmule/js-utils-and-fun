import Rosenblatt from "../networks/Rosenblatt.js";
import Matrix from "../../math/Matrix.js";
import {EnumEvents} from "./ENUMS.js";

export class NetworkController {
	constructor() {
		this.network = new Rosenblatt(2, 2, 1);
		this.trainingSamples = [
			[[[0, 0]], [[0]]],
			[[[0, 1]], [[1]]],
			[[[1, 0]], [[1]]],
			[[[1, 1]], [[0]]],
		];
		
		this.settings = {
			epochs: 10000,
			lr: 0.1,
			errFrequency: 1 / 1000,
		};
		
		this._isLearning = false;
	}
	
	setNetworkSize(inp, hid, out) {
		this.network.inp_hid.reshape(inp, hid).forEachElement(val => val || (Math.random() * 2 - 1));
		this.network.hid_out.reshape(hid, out).forEachElement(val => val || (Math.random() * 2 - 1));
		this.network.hid_biases.reshape(1, hid).forEachElement(val => val || (Math.random() * 2 - 1));
		this.network.out_biases.reshape(1, out).forEachElement(val => val || (Math.random() * 2 - 1));
		
		for (let i = 0; i < this.trainingSamples.length; i++) {
			let sample = this.trainingSamples[i];
			
			let sample_inp = sample[0][0];
			sample_inp.length = inp;
			for (let j = 0; j < sample_inp.length; j++) if (sample_inp[j] === undefined) sample_inp[j] = 0;
			
			let sample_out = sample[1][0];
			sample_out.length = out;
			for (let j = 0; j < sample_out.length; j++) if (sample_out[j] === undefined) sample_out[j] = 0;
		}
		
		document.dispatchEvent(new CustomEvent(EnumEvents.onNetworkChanged));
	}
	
	// ========== TRAINING SAMPLES ===========
	get isSamplesFit() {
		return !this.trainingSamples.find(
			sample => !this.sampleIsFitInp(sample[0][0]) || this.sampleIsFitOut(sample[1][0])
		);
	}
	
	sampleIsFitInp(inp) {
		return inp && inp.length === this.network.inp_hid.width && !inp.find(v => isNaN(v));
	}
	
	sampleIsFitOut(out) {
		return out && out.length === this.network.hid_out.height && !out.find(v => isNaN(v));
	}
	
	// ========== LEARNING ===========
	learnStart() {
		if (!this._isLearning) {
			this._isLearning = true;
			
			let epoch = 0;
			let errFreq = 0;
			
			let learn = () => {
				if (this._isLearning && epoch < this.settings.epochs) {
					epoch++;
					errFreq += this.settings.errFrequency;
					
					let err = this.network.learn(this.trainingSamples, this.settings.epochs, this.settings.lr);
					
					if (errFreq > 1) {
						errFreq = 0;
						document.dispatchEvent(new CustomEvent(EnumEvents.onNetworkChanged, {err: err}));
					}
					requestAnimationFrame(learn.bind(this));
					
				} else this.learnStop();
			};
			
			learn();
		}
	}
	
	learnStop() {
		if (this._isLearning) {
			this._isLearning = false;
			document.dispatchEvent(new CustomEvent(EnumEvents.onNetworkChanged));
		}
	}
}
