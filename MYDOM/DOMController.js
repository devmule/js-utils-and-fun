/**
 * @param {(number|string)} val
 * @return {string}
 */
export function PIXELS(val) {
	return val + 'px';
}

/**
 * @param {string} val
 * @return {number}
 */
export function PIXELS_GET(val) {
	val = String(val).replace('px');
	return parseInt(val);
}

/**
 * @param {(number|string)} val
 * @return {string}
 */
export function PERCENTS(val) {
	return val + '%';
}

/**
 * @param {(number|string)} r
 * @param {(number|string)} g
 * @param {(number|string)} b
 * @param {number} [a=1]
 * @return {string}
 */
export function RGBA(r, g, b, a = 1) {
	return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

/**
 * @param {number} color
 * @param {number} [a=1]
 * @return {string}
 */
export function HEXCOLOR(color, a = 1) {
	let r = (color >> 16 & 0xFF),
		g = (color >> 8 & 0xFF),
		b = (color & 0xFF);
	return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

export class DOMController {
	/**
	 * @param {DOMController|HTMLElement} [cont=null]
	 */
	constructor(cont = null) {
		this.cont = cont || document.createElement('div');
	}
	
	/**
	 * @param {DOMController|HTMLElement} items
	 */
	add(...items) {
		for (let i = 0; i < items.length; i++) {
			this.cont.appendChild(items[i].cont || items[i]);
		}
	}
	
	/**
	 * @param {DOMController|HTMLElement} items
	 */
	remove(...items) {
		for (let i = 0; i < items.length; i++) {
			let it = items[i];
			if (it.parentNode === this.cont)
				this.cont.removeChild(items[i].cont || items[i]); // ?
		}
	}
	
	/**
	 * @return {Node & ParentNode}
	 */
	get parentNode() {
		return this.cont.parentNode;
	}
	
	/**
	 * @return {CSSStyleDeclaration}
	 */
	get style() {
		return this.cont.style;
	}
	
	/**
	 */
	disableSelection() {
		this.style['-webkit-touch-callout'] = this.style['-webkit-user-select'] = this.style['-khtml-user-select'] =
			this.style['-moz-user-select'] = this.style['-ms-user-select'] = this.style['user-select'] = 'none';
	}
	
	/**
	 * @param {boolean} val
	 */
	set visible(val) {
		this.style.display = val ? 'block' : 'none';
	}
	
	/**
	 * @return {boolean}
	 */
	get visible() {
		return this.style.display !== 'none';
	}
	
	/**
	 * @param {string} type
	 * @param {function} f
	 */
	addEventListener(type, f) {
		this.cont.addEventListener(type, f);
	}
	
	/**
	 */
	removeFromParent() {
		if (this.cont.parentNode) this.cont.parentNode.removeChild(this.cont);
	}
	
	/**
	 * @param {boolean} val
	 */
	set absolute(val) {
		this.style.position = val ? 'absolute' : '';
	}
	
	/**
	 * @return {boolean}
	 */
	get absolute() {
		return this.style.position === 'absolute';
	}
	
	/**
	 * @param {number} val
	 */
	scale(val) {
		this.style.transform = 'scale(' + val + ');'
	}
	
	/**
	 * @param {number} val
	 */
	set x(val) {
		this.style.left = PIXELS(val);
	}
	
	/**
	 * @return {number}
	 */
	get x() {
		return PIXELS_GET(this.style.left);
	}
	
	/**
	 * @param {number} val
	 */
	set y(val) {
		this.style.top = PIXELS(val);
	}
	
	/**
	 * @return {number}
	 */
	get y() {
		return PIXELS_GET(this.style.top);
	}
	
	/**
	 * @param {number} val
	 */
	set width(val) {
		this.style.width = PIXELS(val);
	}
	
	/**
	 * @return {number}
	 */
	get width() {
		return PIXELS_GET(this.style.width);
	}
	
	/**
	 * @param {number} val
	 */
	set height(val) {
		this.style.height = PIXELS(val);
	}
	
	/**
	 * @return {number}
	 */
	get height() {
		return PIXELS_GET(this.style.height);
	}
	
	resize(w, h) {
		this.width = w;
		this.height = h;
	}
}
