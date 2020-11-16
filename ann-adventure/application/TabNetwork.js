import * as MYDOM from '../../MYDOM/index.js';
import Application from "../Application.js";
import Rosenblatt from "../networks/Rosenblatt.js";
import {sigmoid, sigmoidDerivative} from "../networks/activationFunctions.js";
import {NetworkController} from "./NetworkController.js";

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

class CenterPosition extends MYDOM.DOMController {
	
	set x(val) {
		this.style.left = MYDOM.PIXELS(val - NetworkNode.size / 2);
	}
	
	get x() {
		return MYDOM.PIXELS_GET(this.style.left) - NetworkNode.size;
	}
	
	set y(val) {
		this.style.top = MYDOM.PIXELS(val - NetworkNode.size / 2);
	}
	
	get y() {
		return MYDOM.PIXELS_GET(this.style.top) + NetworkNode.size;
	}
	
}

class NetworkNode extends CenterPosition {
	static size = 36;
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
}

class NetworkSynapse extends CenterPosition {
	constructor() {
		super();
		this.absolute = true;
		this.height = 6;
		this._val = 0;
		
		this.style.cursor = 'pointer';
		this.style.borderColor = 'red';
		
		this.addEventListener('mouseenter', this.mouseenter.bind(this));
		this.addEventListener('mouseleave', this.mouseleave.bind(this));
	}
	
	mouseleave() {
		this.height = 6;
		this.style.border = 'none';
	}
	
	mouseenter() {
		this.height = 4;
		this.style.border = "1px solid #FFFFFF";
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
		this.x = (node1.x + node2.x) / 2 - (this.width - dx) / 2;
		this.y = (node1.y + node2.y) / 2;
		this.angle = Math.atan(dy / dx) * 180 / Math.PI;
	}
}

export class TabNetwork extends MYDOM.DOMController {
	constructor(/*Application*/app) {
		super();
		this.app = app;
		this.style.width = MYDOM.PERCENTS(100);
		this.style.height = MYDOM.PERCENTS(100);
		this.style.position = 'relative';
		this.style.overflowY = 'scroll';
		
		this.cacheNodes = [];
		this.cacheSynapses = [];
		
		document.addEventListener(NetworkController.updated, this.update.bind(this));
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
		let vOffset = 48, hOffset = 150;
		let /*Rosenblatt*/ network = this.app.networkController.network;
		
		let maxHeight = Math.max(network.inp_hid.width, network.inp_hid.height, network.hid_out.height);
		
		let nodes = {inp: [], hid: [], out: []};
		
		// draw nodes
		let nodeIndex = 0;
		
		for (let i = 0; i < network.inp_hid.width; i++) {
			let node = this.getNode(nodeIndex++);
			node.x = hOffset;
			node.y = ((maxHeight - network.inp_hid.width) / 2 + i + 1) * vOffset;
			nodes.inp.push(node);
			node.value = 1;
			this.add(node);
		}
		for (let i = 0; i < network.inp_hid.height; i++) {
			let node = this.getNode(nodeIndex++);
			node.x = hOffset * 2;
			node.y = ((maxHeight - network.inp_hid.height) / 2 + i + 1) * vOffset;
			nodes.hid.push(node);
			node.value = 1;
			this.add(node);
		}
		for (let i = 0; i < network.hid_out.height; i++) {
			let node = this.getNode(nodeIndex++);
			node.x = hOffset * 3;
			node.y = ((maxHeight - network.hid_out.height) / 2 + i + 1) * vOffset;
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
