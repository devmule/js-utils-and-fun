import Rosenblatt from "../networks/Rosenblatt.js";
import Matrix from "../../math/Matrix.js";
import {EnumEvents} from "./ENUMS.js";

export class NetworkController {
	static updated = 'NC.updated';
	static errorGet = 'NC.errorGet';
	
	constructor() {
		this.network = new Rosenblatt(2, 3, 4);
		this.trainingSamples = [];
		
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
		document.dispatchEvent(new CustomEvent(EnumEvents.onNetworkChanged));
	}
	
	// ========== TRAINING SAMPLES ===========
	sampleIsFit(sample) {
		// [ [[1, 1]], [[1, 1]] ]
		return (sample &&
			sample[0][0].length === this.network.inp_hid.width &&
			sample[1][0].length === this.network.hid_out.height)
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
