import * as MYDOM from '../../MYDOM/index.js';
import {sigmoid, sigmoidInverse} from "../networks/activationFunctions.js";
import {EnumEvents} from "./ENUMS.js";

/**
 * @return {string}
 */
function RED_TO_BLUE(val = 0) {
	val = Math.max(0, Math.min(1, val)) * 255;
	return MYDOM.RGBA(255 - val, 100, val);
}

/**
 * @return {string}
 */
function DARK_TO_WHITE(val = 0) {
	val = (0.1 + Math.max(0, Math.min(1, val)) * 0.8) * 255;
	return MYDOM.RGBA(val, val, val);
}

class SynapseValue extends MYDOM.DOMController {
	constructor() {
		super();
		
		this.absolute = true;
		this.visible = false;
		
		this.cont.innerHTML = String(Infinity);
		
		this.style.backgroundColor = MYDOM.HEXCOLOR(MYDOM.STYLES.colorBlack, .5);
		this.style.color = MYDOM.HEXCOLOR(MYDOM.STYLES.colorWhite);
		this.style.borderRadius = MYDOM.PIXELS(MYDOM.STYLES.radiusDefault);
		this.style.fontSize = MYDOM.PIXELS(MYDOM.STYLES.textSizeDefault);
		this.style.paddingTop = this.style.paddingBottom =
			MYDOM.PIXELS((MYDOM.STYLES.heightDefault - MYDOM.PIXELS_GET(this.style.fontSize)) / 2);
		
		this.height = MYDOM.PIXELS_GET(this.style.fontSize);
		this.width = 100;
		
		this.style.textAlign = 'center';
		this.style.zIndex = '2';
	}
	
	moveTo(x, y) {
		this.x = x - this.height / 2;
		this.y = y + 25;
	}
	
	set value(val) {
		console.log(val);
		this.cont.innerHTML = val.toExponential(2).toString();
	}
}

let synapseValue = new SynapseValue();

class NetworkNode extends MYDOM.DOMController {
	static size = 32;
	static fontSize = 12;
	
	constructor() {
		super();
		this.absolute = true;
		this.disableSelection();
		this.style.borderRadius = MYDOM.PIXELS(NetworkNode.size / 2);
		this.style.fontSize = MYDOM.PIXELS(NetworkNode.fontSize);
		this.style.paddingTop = this.style.paddingBottom =
			MYDOM.PIXELS((NetworkNode.size - NetworkNode.fontSize) / 2);
		
		this.width = NetworkNode.size;
		this.height = NetworkNode.size - MYDOM.PIXELS_GET(this.style.paddingTop) * 2;
		
		this.style.textAlign = 'center';
		this.style.zIndex = '1';
	}
	
	set value(val) {
		if (String(val).length > 7) val = val.toExponential(1);
		this.cont.innerHTML = val;
		this.style.backgroundColor = DARK_TO_WHITE(val);
	}
	
	get value() {
		return parseFloat(this.cont.innerHTML);
	}
	
	set x(val) {
		this.style.left = MYDOM.PIXELS(val - NetworkNode.size / 2);
	}
	
	get x() {
		return MYDOM.PIXELS_GET(this.style.left) + NetworkNode.size / 2;
	}
	
	set y(val) {
		this.style.top = MYDOM.PIXELS(val - NetworkNode.size / 2);
	}
	
	get y() {
		return MYDOM.PIXELS_GET(this.style.top) + NetworkNode.size / 2;
	}
}

class Synapse extends MYDOM.DOMController {
	static size = 8;
	static selectorSize = 1;
	
	constructor() {
		super();
		this.absolute = true;
		this.height = Synapse.size;
		
		this._m = {m: /*Matrix*/ null, x: 0, y: 0};
		
		this._val = 0;
		
		this.style.cursor = 'pointer';
		this.style.borderColor = 'red';
		
		this.addEventListener('mouseenter', this.mouseenter.bind(this));
		this.addEventListener('mouseleave', this.mouseleave.bind(this));
		this.addEventListener('wheel', this.wheel.bind(this));
	}
	
	wheel(e) {
		e = e || window.event;
		let delta = (e.deltaY || e.detail || e.wheelDelta) > 0 ? -1 : +1;
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		this.value = sigmoidInverse(Math.max(0, Math.min(1, sigmoid(Number(this.value)) + 0.05 * delta)));
		this._m.m[this._m.x][this._m.y] = synapseValue.value = this.value;
	}
	
	mouseleave(e) {
		this.height = Synapse.size;
		this.style.border = 'none';
		synapseValue.visible = false;
	}
	
	mouseenter(e) {
		this.height = Synapse.size - 2 * Synapse.selectorSize;
		this.style.border = `${MYDOM.PIXELS(Synapse.selectorSize)} solid #FFFFFF`;
		synapseValue.visible = true;
		synapseValue.moveTo(
			this.x + (this.width / 2) * Math.cos(this.angle / (180 / Math.PI)),
			this.y - (this.height / 2) * Math.sin(this.angle / (180 / Math.PI))
		);
		synapseValue.value = this.value;
	}
	
	set value(val) {
		this._val = val;
		this.style.backgroundColor = RED_TO_BLUE(sigmoid(val));
	}
	
	get value() {
		return Number(this._val);
	}
	
	connect(/*NetworkNode*/node1, /*NetworkNode*/node2) {
		let dx = node2.x - node1.x;
		let dy = node2.y - node1.y;
		this.width = Math.sqrt(dx * dx + dy * dy);
		this.x = (node1.x + node2.x - this.width) / 2;
		this.y = (node1.y + node2.y - this.height) / 2;
		this.angle = Math.atan(dy / dx) * 180 / Math.PI;
	}
}

class Visualization extends MYDOM.DOMController {
	constructor(/*TabNetwork*/tn) {
		super();
		this.absolute = true;
		this.x = 300;
		this.style.width = `calc(${MYDOM.PERCENTS(100)} - ${MYDOM.PIXELS(300)})`;
		this.style.height = MYDOM.PERCENTS(100);
		this.style.position = 'relative';
		this.style.overflowY = 'scroll';
		
		this.tn = tn;
		
		this.cacheNodes = [];
		this.cacheSynapses = [];
		
		this.settings = {
			vOffset: 64,
			hOffset: 200,
		};
		
		this.add(synapseValue);
		
		document.addEventListener(EnumEvents.onNetworkChanged, this.update.bind(this));
	}
	
	getNode(i) {
		if (!this.cacheNodes[i]) this.cacheNodes[i] = new NetworkNode();
		return this.cacheNodes[i];
	}
	
	getSynapse(i) {
		if (!this.cacheSynapses[i]) this.cacheSynapses[i] = new Synapse();
		return this.cacheSynapses[i];
	}
	
	update() {
		let /*Rosenblatt*/ network = this.tn.app.networkController.network;
		
		let maxHeight = Math.max(network.inp_hid.width, network.inp_hid.height, network.hid_out.height);
		
		let nodes = {inp: [], hid: [], out: []};
		
		// draw nodes
		let nodeIndex = 0;
		
		for (let i = 0; i < network.inp_hid.width; i++) {
			let node = this.getNode(nodeIndex++);
			node.x = this.settings.hOffset;
			node.y = ((maxHeight - network.inp_hid.width) / 2 + i + 1) * this.settings.vOffset;
			nodes.inp.push(node);
			node.value = 1;
			this.add(node);
		}
		for (let i = 0; i < network.inp_hid.height; i++) {
			let node = this.getNode(nodeIndex++);
			node.x = this.settings.hOffset * 2;
			node.y = ((maxHeight - network.inp_hid.height) / 2 + i + 1) * this.settings.vOffset;
			nodes.hid.push(node);
			node.value = 1;
			this.add(node);
		}
		for (let i = 0; i < network.hid_out.height; i++) {
			let node = this.getNode(nodeIndex++);
			node.x = this.settings.hOffset * 3;
			node.y = ((maxHeight - network.hid_out.height) / 2 + i + 1) * this.settings.vOffset;
			nodes.out.push(node);
			node.value = 1;
			this.add(node);
		}
		for (let i = nodeIndex; i < this.cacheNodes.length; i++) this.cacheNodes[i].removeFromParent();
		
		// draw synapses
		let synapseIndex = 0;
		
		for (let i = 0; i < nodes.inp.length; i++) for (let j = 0; j < nodes.hid.length; j++) {
			let synapse /*Synapse*/ = this.getSynapse(synapseIndex++);
			synapse._m.m = network.inp_hid;
			synapse._m.x = i;
			synapse._m.y = j;
			let node1 = nodes.inp[i];
			let node2 = nodes.hid[j];
			synapse.connect(node1, node2);
			synapse.value = network.inp_hid[i][j];
			this.add(synapse);
		}
		for (let i = 0; i < nodes.hid.length; i++) for (let j = 0; j < nodes.out.length; j++) {
			let synapse /*Synapse*/ = this.getSynapse(synapseIndex++);
			synapse._m.m = network.hid_out;
			synapse._m.x = i;
			synapse._m.y = j;
			let node1 = nodes.hid[i];
			let node2 = nodes.out[j];
			synapse.connect(node1, node2);
			synapse.value = network.hid_out[i][j];
			this.add(synapse);
		}
		for (let i = synapseIndex; i < this.cacheSynapses.length; i++) this.cacheSynapses[i].removeFromParent();
	}
}

class Settings extends MYDOM.DOMController {
	constructor(/*TabNetwork*/tn) {
		super();
		this.absolute = true;
		this.style.width = MYDOM.PIXELS(300);
		this.style.height = MYDOM.PERCENTS(100);
		this.tn = tn;
		
		let network = tn.app.networkController.network;
		
		this.inpVal = new MYDOM.InputNumber(network.inp_hid.width, 1, 100, 1);
		this.inpVal.absolute = true;
		this.inpVal.x = 50;
		this.inpVal.y = 50;
		this.add(this.inpVal);
		
		this.hidVal = new MYDOM.InputNumber(network.inp_hid.height, 1, 100, 1);
		this.hidVal.absolute = true;
		this.hidVal.x = 50;
		this.hidVal.y = 100;
		this.add(this.hidVal);
		
		this.outVal = new MYDOM.InputNumber(network.hid_out.height, 1, 100, 1);
		this.outVal.absolute = true;
		this.outVal.x = 50;
		this.outVal.y = 150;
		this.add(this.outVal);
		
		this.inpVal.addEventListener('change', this.changed.bind(this));
		this.hidVal.addEventListener('change', this.changed.bind(this));
		this.outVal.addEventListener('change', this.changed.bind(this));
	}
	
	changed() {
		this.tn.app.networkController.setNetworkSize(this.inpVal.value, this.hidVal.value, this.outVal.value);
	}
}

export class TabNetwork extends MYDOM.DOMController {
	constructor(app) {
		super();
		this.style.width = MYDOM.PERCENTS(100);
		this.style.height = MYDOM.PERCENTS(100);
		
		this.app = app;
		
		this.add(new Settings(this));
		this.add(new Visualization(this));
	}
}
