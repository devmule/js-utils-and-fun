import {Input} from "./Input.js";
import {DOMController, PIXELS, PIXELS_GET, HEXCOLOR} from "../DOMController.js";
import {Button} from "./Button.js";
import {STYLES} from "../styles.js";

export class InputNumber extends Input {
	constructor(value = 0, min = -Infinity, max = Infinity, step = 1) {
		super();
		this.input.cont.setAttribute('type', 'number');
		
		this.min = min;
		this.max = max;
		this.step = step;
		this.value = value;
		
		this.input.cont.onchange = () => this.input.cont.value = this.range(this.value);
		
		this.btnMinus = new Button('−');
		this.btnMinus.addEventListener('click', this.minus.bind(this));
		this.btnPlus = new Button('+');
		this.btnPlus.addEventListener('click', this.plus.bind(this));
		this.btnMinus.style.boxShadow = this.btnPlus.style.boxShadow = this.style.boxShadow;
		this.btnPlus.absolute = this.btnMinus.absolute = true;
		this.btnMinus.x = this.btnMinus.y = this.btnPlus.x = this.btnPlus.y = 0;
		
		this.add(this.btnMinus, this.btnPlus);
		
		this.height += 0;
		this.width += 0;
	}
	
	range(val) {
		return Math.max(this.min, Math.min(this.max, val));
	}
	
	get height() {
		return PIXELS_GET(this.style.height);
	}
	
	set height(val) {
		this.input.x = val + 18;
		super.height = val;
		if (this.btnMinus) this.btnMinus.height = this.btnMinus.width = this.btnPlus.height = this.btnPlus.width = val;
		if (this.btnPlus) this.btnPlus.x = this.width - val;
	}
	
	get width() {
		return PIXELS_GET(this.style.width);
	}
	
	set width(val) {
		this.input.x = this.height + 18;
		super.width = val;
		if (this.btnPlus) this.btnPlus.x = val - this.btnPlus.width;
	}
	
	set value(val) {
		let prev = this.value;
		this.input.cont.value = this.range(val);
		if (this.value !== prev) this.cont.dispatchEvent(new Event('change'));
	}
	
	get value() {
		return Number(this.input.cont.value);
	}
	
	set min(val) {
		this.input.cont.min = val;
	}
	
	get min() {
		return Number(this.input.cont.min);
	}
	
	set max(val) {
		this.input.cont.max = val;
	}
	
	get max() {
		return Number(this.input.cont.max);
	}
	
	set step(val) {
		this.input.cont.step = val;
	}
	
	get step() {
		return Number(this.input.cont.step);
	}
	
	minus() {
		this.value -= this.step;
	}
	
	plus() {
		this.value += this.step;
	}
}
