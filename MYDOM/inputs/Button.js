import {DOMController} from "../DOMController.js";
import {HEXCOLOR, PIXELS, PIXELS_GET} from "../DOMController.js";
import {STYLES} from "../styles.js";

export class Button extends DOMController {
	constructor(text = '') {
		super();
		this.style.backgroundColor = HEXCOLOR(STYLES.colorLight);
		this.style.color = HEXCOLOR(STYLES.colorWhite);
		this.style.cursor = 'pointer';
		this.style.fontSize = PIXELS(STYLES.textSizeBig);
		this.style.textAlign = 'center';
		
		this.disableSelection();
		this.text = text;
		
		this.height = STYLES.heightDefault;
		this.width = 200;
	}
	
	set height(val) {
		this.style.height = this.style.lineHeight = PIXELS(val);
	}
	
	get height() {
		return PIXELS_GET(this.style.height);
	}
	
	set text(val) {
		this.cont.innerHTML = String(val).bold();
	}
	
	get text() {
		return this.cont.innerHTML;
	}
}
