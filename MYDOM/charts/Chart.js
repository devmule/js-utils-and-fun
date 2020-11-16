import {DOMController, HEXCOLOR, PIXELS_GET} from "../DOMController.js";

export class Chart extends DOMController {
	constructor() {
		super(document.createElement('canvas'));
		this.ctx = this.cont.getContext("2d");
		
		this.width = 300;
		this.height = 150;
		
		this.settings = {
			
			// chart
			min: {x: 0, y: 0},
			max: {x: 100, y: 100},
			shift: {x: 0, y: 0},
			grid: {x: 25, y: 25, color: 0x666666, lineWidth: 1},
			backgroundColor: 0xFFFFFF,
			
		}
	}
	
	set width(val) {
		super.width = val;
		this.cont.width = val;
	}
	
	set height(val) {
		super.height = val;
		this.cont.height = val;
	}
	
	get width() {
		return PIXELS_GET(this.style.width);
	}
	
	get height() {
		return PIXELS_GET(this.style.height);
	}
	
	draw() {
		this.ctx.fillStyle = HEXCOLOR(this.settings.backgroundColor);
		this.ctx.fillRect(0, 0, this.width, this.height);
		
		// lines
		if (this.settings.min.x >= this.settings.max.x || this.settings.min.y >= this.settings.max.y)
			throw new RangeError('min value must be lesser than max value!');
		else {
			this.ctx.lineWidth = this.settings.grid.lineWidth;
			this.ctx.strokeStyle = HEXCOLOR(this.settings.grid.color);
			this.ctx.beginPath();
			
			let shift = 0,
				w = (this.settings.max.x - this.settings.min.x),
				h = (this.settings.max.y - this.settings.min.y),
				wc = (this.width) / w,
				hc = (this.height) / h;
			
			if (this.settings.grid.x > 0) {
				shift = this.settings.grid.x - ((this.settings.shift.x % this.settings.grid.x + this.settings.grid.x) % this.settings.grid.x || this.settings.grid.x);
				while (shift <= w) {
					this.ctx.moveTo(shift * wc, 0);
					this.ctx.lineTo(shift * wc, this.height);
					shift += this.settings.grid.x;
				}
			}
			
			if (this.settings.grid.y > 0) {
				shift = (this.settings.shift.y % this.settings.grid.y + this.settings.grid.y) % this.settings.grid.y;
				while (shift <= h) {
					this.ctx.moveTo(0, shift * hc);
					this.ctx.lineTo(this.width, shift * hc);
					shift += this.settings.grid.y;
				}
			}
			
			this.ctx.stroke();
		}
	}
}
