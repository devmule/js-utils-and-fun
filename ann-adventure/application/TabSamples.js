import * as MYDOM from '../../MYDOM/index.js';
import Application from "../Application.js";
import {Localizations} from "../Localizations.js";
import {EnumEvents} from "./ENUMS.js";

function canJSON(string) {
	try {
		JSON.parse(string);
	} catch (e) {
		return false;
	}
	return true;
}

class TableLine extends MYDOM.DOMController {
	constructor() {
		super();
		this.height = MYDOM.STYLES.heightDefault;
		this.style.width = MYDOM.PERCENTS(100);
		this.style.marginTop = MYDOM.PIXELS(16);
		
		this.inp = new MYDOM.Input(Localizations.getText('InputValues'));
		this.inp.absolute = true;
		this.inp.x = 100 - MYDOM.STYLES.heightDefault;
		
		this.out = new MYDOM.Input(Localizations.getText('OutputValues'));
		this.out.absolute = true;
		
		this.deleteBtn = new MYDOM.Button(Localizations.getText('Delete'));
		this.deleteBtn.style.backgroundColor = MYDOM.HEXCOLOR(MYDOM.STYLES.colorError);
		this.deleteBtn.absolute = true;
		
		this.deleteBtn.width = this.deleteBtn.height =
			this.inp.height = this.out.height = this.height;
		this.add(this.inp, this.out, this.deleteBtn);
		
		window.addEventListener('resize', () => this.resize(window.innerWidth - 200, window.innerHeight - MYDOM.STYLES.heightDefault));
		this.resize(window.innerWidth - 200, window.innerHeight - MYDOM.STYLES.heightDefault);
	}
	
	update(nc) {
		let inpClear = (this.value[0] && this.value[0][0].length === nc.network.inp_hid.width && !this.value[0][0].find(v => isNaN(v)));
		let outClear = (this.value[1] && this.value[1][0].length === nc.network.hid_out.height && !this.value[1][0].find(v => isNaN(v)));
		this.inp.style.backgroundColor = MYDOM.HEXCOLOR(inpClear ? MYDOM.STYLES.colorLight : MYDOM.STYLES.colorError);
		this.out.style.backgroundColor = MYDOM.HEXCOLOR(outClear ? MYDOM.STYLES.colorLight : MYDOM.STYLES.colorError);
		return !!(inpClear && outClear);
	}
	
	set value(val) {
		this.inp.value = JSON.stringify(val[0][0]).replace('[', '').replace(']', '');
		this.out.value = JSON.stringify(val[1][0]).replace('[', '').replace(']', '');
	}
	
	get value() {
		let inp = '[' + this.inp.value + ']';
		let out = '[' + this.out.value + ']';
		return [
			canJSON(inp) ? [JSON.parse(inp).map(v => Number(v))] : null,
			canJSON(out) ? [JSON.parse(out).map(v => Number(v))] : null,
		];
	}
	
	resize(w, h) {
		super.resize(w, MYDOM.STYLES.heightDefault);
		this.inp.width = this.out.width = w / 2;
		this.out.x = w / 2 + 100 - MYDOM.STYLES.heightDefault + 12;
		this.deleteBtn.x = w + 100 - MYDOM.STYLES.heightDefault + 24;
	}
}

export class TabSamples extends MYDOM.DOMController {
	constructor(/*Application*/app) {
		super();
		this.app = app;
		this.cacheLines = [];
		
		this.addButton = new MYDOM.Button('+');
		this.addButton.style.marginLeft = MYDOM.PIXELS(100 - MYDOM.STYLES.heightDefault);
		this.addButton.style.marginTop = MYDOM.PIXELS(16);
		this.addButton.height = this.addButton.width = MYDOM.STYLES.heightDefault;
		this.addButton.style.backgroundColor = MYDOM.HEXCOLOR(MYDOM.STYLES.colorSuccess);
		this.addButton.addEventListener('click', this.addLine.bind(this));
		this.add(this.addButton);
		
		this.style.width = MYDOM.PERCENTS(100);
		this.style.height = MYDOM.PERCENTS(100);
		this.style.position = 'relative';
		this.style.overflowY = 'scroll';
		this.style.overflowX = 'hidden';
		
		document.addEventListener(EnumEvents.onNetworkChanged, this.update.bind(this));
	}
	
	deleteLine(index) {
		let nc = this.app.networkController;
		nc.trainingSamples.splice(index, 1);
		this.update();
	}
	
	addLine() {
		let nc = this.app.networkController;
		nc.trainingSamples.push([
			[new Array(nc.network.inp_hid.width).fill(0)],
			[new Array(nc.network.hid_out.height).fill(0)]
		]);
		this.update();
	}
	
	getLine(index) {
		if (!this.cacheLines[index]) {
			let nc = this.app.networkController;
			let line = this.cacheLines[index] = new TableLine();
			line.deleteBtn.addEventListener('click', this.deleteLine.bind(this, index));
			line.inp.input.addEventListener('input', () => line.update(nc) ? nc.trainingSamples[index] = line.value : null);
			line.out.input.addEventListener('input', () => line.update(nc) ? nc.trainingSamples[index] = line.value : null);
		}
		return this.cacheLines[index];
	}
	
	update() {
		let nc = this.app.networkController;
		
		this.addButton.removeFromParent();
		for (let i = 0; i < nc.trainingSamples.length; i++) {
			let line = this.getLine(i);
			line.value = nc.trainingSamples[i];
			this.add(line);
		}
		for (let i = nc.trainingSamples.length; i < this.cacheLines.length; i++) this.cacheLines[i].removeFromParent();
		this.add(this.addButton);
	}
}
