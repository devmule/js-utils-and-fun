import * as MYDOM from '../../MYDOM/index.js';
import Application from "../Application.js";
import Rosenblatt from "../networks/Rosenblatt.js";
import {sigmoid, sigmoidDerivative} from "../networks/activationFunctions.js";
import {NetworkController} from "./NetworkController.js";
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

class NetworkSynapse extends MYDOM.DOMController {
	static size = 8;
	static selectorSize = 1;
	
	constructor() {
		super();
		this.absolute = true;
		this.height = NetworkSynapse.size;
		this._val = 0;
		
		this.style.cursor = 'pointer';
		this.style.borderColor = 'red';
		
		this.addEventListener('mouseenter', this.mouseenter.bind(this));
		this.addEventListener('mouseleave', this.mouseleave.bind(this));
	}
	
	mouseleave() {
		this.height = NetworkSynapse.size;
		this.style.border = 'none';
	}
	
	mouseenter() {
		this.height = NetworkSynapse.size - 2 * NetworkSynapse.selectorSize;
		this.style.border = `${MYDOM.PIXELS(NetworkSynapse.selectorSize)} solid #FFFFFF`;
	}
	
	set value(val) {
		if (String(val).length > 7) val = val.toExponential(1);
		this._val = val;
		this.style.backgroundColor = RED_TO_BLUE(sigmoid(val));
	}
	
	get value() {
		return this._val;
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

class NetworkVisualization extends MYDOM.DOMController {
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
		
		document.addEventListener(EnumEvents.onNetworkChanged, this.update.bind(this));
	}
	
	getNode(i) {
		if (!this.cacheNodes[i]) this.cacheNodes[i] = new NetworkNode();
		return this.cacheNodes[i];
	}
	
	getSynapse(i) {
		if (!this.cacheSynapses[i]) this.cacheSynapses[i] = new NetworkSynapse();
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
			let synapse = this.getSynapse(synapseIndex++);
			let node1 = nodes.inp[i];
			let node2 = nodes.hid[j];
			synapse.connect(node1, node2);
			synapse.value = network.inp_hid[i][j];
			this.add(synapse);
		}
		for (let i = 0; i < nodes.hid.length; i++) for (let j = 0; j < nodes.out.length; j++) {
			let synapse = this.getSynapse(synapseIndex++);
			let node1 = nodes.hid[i];
			let node2 = nodes.out[j];
			synapse.connect(node1, node2);
			synapse.value = network.hid_out[i][j];
			this.add(synapse);
		}
		for (let i = synapseIndex; i < this.cacheSynapses.length; i++) this.cacheSynapses[i].removeFromParent();
	}
}

class NetworkSettings extends MYDOM.DOMController {
	constructor(/*TabNetwork*/tn) {
		super();
		this.absolute = true;
		this.style.width = MYDOM.PIXELS(300);
		this.style.height = MYDOM.PERCENTS(100);
		this.tn = tn;
		
		this.input = new MYDOM.InputNumber(2, 1, 100, 1);
		this.input.absolute = true;
		this.input.x = this.input.y = 50;
		this.add(this.input);
	}
}

export class TabNetwork extends MYDOM.DOMController {
	constructor(app) {
		super();
		this.style.width = MYDOM.PERCENTS(100);
		this.style.height = MYDOM.PERCENTS(100);
		
		this.app = app;
		
		this.add(new NetworkSettings(this));
		this.add(new NetworkVisualization(this));
	}
}
