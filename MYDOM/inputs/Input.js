import {DOMController, HEXCOLOR, PIXELS, PERCENTS} from "../DOMController.js";
import {STYLES} from "../styles.js";

export class Input extends DOMController {
	constructor(placeholder = null) {
		super();
		
		this.style.margin = this.style.padding = '0';
		this.style.backgroundColor = HEXCOLOR(STYLES.colorLight);
		this.style.boxShadow = `inset 0 0 0 ${PIXELS(1)} ${HEXCOLOR(STYLES.colorWhite)}`;
		
		this.input = new DOMController(document.createElement('input'));
		this.input.style.background = 'transparent';
		this.input.style.color = HEXCOLOR(STYLES.colorWhite);
		this.input.style.margin = this.input.style.padding = this.input.style.outline = this.input.style.border = '0';
		this.input.style.fontSize = PIXELS(STYLES.textSizeDefault);
		this.input.x = 18;
		this.input.absolute = true;
		
		this.add(this.input);
		
		this.height = STYLES.heightDefault;
		this.width = 200;
		
		if (placeholder !== null) this.placeholder = placeholder;
	}
	
	set height(val) {
		super.height = val;
		this.input.height = val
	}
	
	set width(val) {
		super.width = val;
		this.input.width = val - this.input.x * 2;
	}
	
	set placeholder(placeholder) {
		this.input.cont.placeholder = placeholder;
	}
	
	get placeholder() {
		return this.input.cont.placeholder;
	}
}
