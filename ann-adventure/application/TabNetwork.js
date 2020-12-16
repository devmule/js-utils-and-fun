import * as MYDOM from '../../MYDOM/index.js';
import {sigmoid, sigmoidInverse} from "../networks/activationFunctions.js";
import {EnumEvents} from "./ENUMS.js";

/**
 * @return {string}
 */
function RED_TO_BLUE(val = 0) {
	val = Math.max(0, Math.min(1, val)) * 255;
	return MYDOM.RGBA(255 - val, 128 - Math.abs(val - 128), val);
}

// user values
class NodeInput extends MYDOM.InputNumber {
	constructor() {
		super(0, 0, 1, 0.2);
		this.height = 24;
		this.width = 86;
		this.absolute = true;
	}
	
	set value(val) {
		let prev = this.value;
		this.input.cont.value = this.range(val.toFixed(1));
		if (this.value !== prev) this.cont.dispatchEvent(new Event('change'));
	}
	
	get value() {
		return Number(this.input.cont.value);
	}
	
	get width() {
		return MYDOM.PIXELS_GET(this.style.width);
	}
	
	set width(val) {
		super.width = val;
		this.input.x = this.height + 4;
		this.input.width = val - this.input.x * 2;
	}
}

class NodeOutput extends MYDOM.DOMController {
	constructor() {
		super();
		this.absolute = true;
		this.style.backgroundColor = MYDOM.HEXCOLOR(MYDOM.STYLES.colorLight);
		this.style.boxShadow = `inset 0 0 0 ${MYDOM.PIXELS(1)} ${MYDOM.HEXCOLOR(MYDOM.STYLES.colorWhite)}`;
		
		this.style.color = MYDOM.HEXCOLOR(MYDOM.STYLES.colorWhite);
		this.style.margin = this.style.padding = this.style.outline = this.style.border = '0';
		this.style.fontSize = MYDOM.PIXELS(MYDOM.STYLES.textSizeDefault);
		this.style.textAlign = 'center';
		
		this.height = 24;
		this.width = 86;
	}
	
	set value(val) {
		this.cont.innerHTML = val.toFixed(5).toString();
	}
}

// vis
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
		this.x = x - this.width / 2;
		this.y = y + 25;
	}
	
	set value(val) {
		this.cont.innerHTML = val.toExponential(2).toString();
	}
}

let synapseValue = new SynapseValue();

// network
class NetworkNode extends MYDOM.DOMController {
	static size = 32;
	static fontSize = 10;
	
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
		
		this.style.boxShadow = `inset 0 0 0 ${MYDOM.PIXELS(1)} ${MYDOM.HEXCOLOR(MYDOM.STYLES.colorBlack)}`;
		
		this.style.color = MYDOM.HEXCOLOR(MYDOM.STYLES.colorBlack);
		this.style.textAlign = 'center';
		this.style.zIndex = '1';
		
		this._isEnter = false;
		this._m = {m: /*Matrix*/ null, x: 0, y: 0, canChange: true};
		this._val = 0;
		
		this.addEventListener('mouseenter', this.mouseenter.bind(this));
		this.addEventListener('mouseleave', this.mouseleave.bind(this));
		this.addEventListener('mousemove', this.mousemove.bind(this));
		this.addEventListener('wheel', this.wheel.bind(this));
		document.addEventListener(EnumEvents.onNetworkChanged, this.onNetworkChanged.bind(this))
	}
	
	onNetworkChanged() {
		if (this._isEnter) synapseValue.value = this.value;
	}
	
	mousemove(e) {
		synapseValue.moveTo(e.x, e.y - MYDOM.STYLES.heightDefault);
	}
	
	wheel(e) {
		if (this._m.canChange) {
			e = e || window.event;
			let delta = (e.deltaY || e.detail || e.wheelDelta) > 0 ? -1 : +1;
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);
			let val = sigmoidInverse(Math.max(0, Math.min(1, sigmoid(Number(this.value)) + 0.05 * delta)));
			if (val === Infinity) val = 1e+100;
			if (val === -Infinity) val = -1e+100;
			this.value = val;
			this._m.m[this._m.x][this._m.y] = synapseValue.value = val;
		}
	}
	
	mouseleave(e) {
		synapseValue.visible = false;
		this.style.boxShadow = `inset 0 0 0 ${MYDOM.PIXELS(1)} ${MYDOM.HEXCOLOR(MYDOM.STYLES.colorBlack)}`;
		this._isEnter = false;
	}
	
	mouseenter(e) {
		synapseValue.visible = true;
		synapseValue.value = this.value;
		this.style.boxShadow = `inset 0 0 0 ${MYDOM.PIXELS(1)} ${MYDOM.HEXCOLOR(MYDOM.STYLES.colorWhite)}`;
		this._isEnter = true
	}
	
	set value(val) {
		this._val = val;
		this.style.backgroundColor = RED_TO_BLUE(sigmoid(val));
	}
	
	get value() {
		return this._val;
	}
	
	set text(val) {
		this.cont.innerHTML = val.toExponential(1).toString();
	}
	
	get text() {
		return this.cont.innerHTML;
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
	static size = 7;
	static selectorSize = 1;
	
	constructor() {
		super();
		this.absolute = true;
		this.height = Synapse.size;
		
		this._isEnter = false;
		this._m = {m: /*Matrix*/ null, x: 0, y: 0, canChange: true};
		this._val = 0;
		
		this.style.cursor = 'pointer';
		
		this.addEventListener('mouseenter', this.mouseenter.bind(this));
		this.addEventListener('mouseleave', this.mouseleave.bind(this));
		this.addEventListener('mousemove', this.mousemove.bind(this));
		this.addEventListener('wheel', this.wheel.bind(this));
		document.addEventListener(EnumEvents.onNetworkChanged, this.onNetworkChanged.bind(this))
	}
	
	onNetworkChanged() {
		if (this._isEnter) synapseValue.value = this.value;
	}
	
	mousemove(e) {
		synapseValue.moveTo(e.x, e.y - MYDOM.STYLES.heightDefault);
	}
	
	wheel(e) {
		if (this._m.canChange) {
			e = e || window.event;
			let delta = (e.deltaY || e.detail || e.wheelDelta) > 0 ? -1 : +1;
			e.preventDefault ? e.preventDefault() : (e.returnValue = false);
			let val = sigmoidInverse(Math.max(0, Math.min(1, sigmoid(Number(this.value)) + 0.05 * delta)));
			if (val === Infinity) val = 1e+100;
			if (val === -Infinity) val = -1e+100;
			this.value = val;
			this._m.m[this._m.x][this._m.y] = synapseValue.value = val;
		}
	}
	
	mouseleave(e) {
		this.style.boxShadow = `none`;
		this.height = Synapse.size;
		synapseValue.visible = false;
		this._isEnter = false;
	}
	
	mouseenter(e) {
		this.style.boxShadow = `inset 0 0 0 ${MYDOM.PIXELS(1)} ${MYDOM.HEXCOLOR(MYDOM.STYLES.colorWhite)}`;
		synapseValue.visible = true;
		synapseValue.value = this.value;
		this._isEnter = true;
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
		this.cacheInputs = [];
		this.cacheOutputs = [];
		
		this.settings = {
			vOffset: 64,
			hOffset: 200,
		};
		
		document.addEventListener(EnumEvents.onNetworkChanged, this.update.bind(this));
	}
	
	getInput(i) {
		if (!this.cacheInputs[i]) {
			this.cacheInputs[i] = new NodeInput();
			this.cacheInputs[i].addEventListener('change', this.updateNetworkValues.bind(this));
		}
		return this.cacheInputs[i];
	}
	
	getOutput(i) {
		if (!this.cacheOutputs[i]) this.cacheOutputs[i] = new NodeOutput();
		return this.cacheOutputs[i];
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
			node._m.m = network.inp_hid;
			node._m.y = i;
			node._m.canChange = false;
			node.x = this.settings.hOffset;
			node.y = ((maxHeight - network.inp_hid.width) / 2 + i + 1) * this.settings.vOffset;
			nodes.inp.push(node);
			node.value = 0;
			this.add(node);
			
			let inp = this.getInput(i);
			inp.x = node.x - node.width / 2 - inp.width - 4;
			inp.y = node.y - inp.height / 2;
			this.add(inp);
		}
		for (let i = network.inp_hid.width; i < this.cacheInputs.length; i++) this.cacheInputs[i].removeFromParent();
		
		for (let i = 0; i < network.inp_hid.height; i++) {
			let node = this.getNode(nodeIndex++);
			node._m.m = network.inp_hid;
			node._m.x = i;
			node._m.canChange = true;
			node.value = network.hid_biases[0][i];
			node.x = this.settings.hOffset * 2;
			node.y = ((maxHeight - network.inp_hid.height) / 2 + i + 1) * this.settings.vOffset;
			nodes.hid.push(node);
			this.add(node);
		}
		for (let i = 0; i < network.hid_out.height; i++) {
			let node = this.getNode(nodeIndex++);
			node._m.m = network.hid_out;
			node._m.x = i;
			node._m.canChange = true;
			node.value = network.out_biases[0][i];
			node.x = this.settings.hOffset * 3;
			node.y = ((maxHeight - network.hid_out.height) / 2 + i + 1) * this.settings.vOffset;
			nodes.out.push(node);
			this.add(node);
			
			let out = this.getOutput(i);
			out.x = node.x + node.width / 2 + 4;
			out.y = node.y - out.height / 2;
			this.add(out);
		}
		for (let i = network.hid_out.height; i < this.cacheOutputs.length; i++) this.cacheOutputs[i].removeFromParent();
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
		
		this.updateNetworkValues();
	}
	
	updateNetworkValues() {
		let /*Rosenblatt*/ network = this.tn.app.networkController.network;
		
		let inp = [];
		for (let i = 0; i < network.inp_hid.width; i++) inp.push(this.getInput(i).value);
		
		let out = network.feedForward([inp])[0];
		
		for (let i = 0; i < out.length; i++) this.getOutput(i).value = out[i];
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
		
		let offset = 16;
		
		this.inpVal = new MYDOM.InputNumber(network.inp_hid.width, 1, 100, 1);
		this.inpVal.absolute = true;
		this.inpVal.x = 52;
		this.inpVal.y = offset;
		this.add(this.inpVal);
		
		this.hidVal = new MYDOM.InputNumber(network.inp_hid.height, 1, 100, 1);
		this.hidVal.absolute = true;
		this.hidVal.x = 52;
		this.hidVal.y = this.inpVal.y + this.inpVal.height + offset;
		this.add(this.hidVal);
		
		this.outVal = new MYDOM.InputNumber(network.hid_out.height, 1, 100, 1);
		this.outVal.absolute = true;
		this.outVal.x = 52;
		this.outVal.y = this.hidVal.y + this.hidVal.height + offset;
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
		
		this.add(synapseValue);
		
		this.app = app;
		
		this.add(new Settings(this));
		this.add(new Visualization(this));
	}
}
