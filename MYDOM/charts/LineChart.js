import {Chart} from "./Chart.js";
import {DOMController, HEXCOLOR} from "../DOMController.js";

export class LineChart extends DOMController {
	
	static Line = class {
		constructor(color = 0x6331A) {
			this.visibility = true;
			this.lineWidth = 4;
			this.dots = [];
			this.color = color;
		}
	};
	
	static Dot = class {
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}
	};
	
	constructor() {
		super();
		
		this.width = 500;
		this.height = 300;
		this.absolute = true;
		
		this.chart = new Chart();
		this.chart.absolute = true;
		this.add(this.chart);
		
		this.settings = {
			offset: {left: 50, right: 20, top: 20, bottom: 50}
		};
		
		this.lines = {};
		this.resize();
	}
	
	addLine(name, color = 0x6331A) {
		if (!this.lines[name]) this.lines[name] = new (LineChart.Line)(color);
	}
	
	removeLine(name) {
		if (this.lines[name]) delete this.lines[name];
	}
	
	resize(w, h) {
		let needChange = w !== this.width || h !== this.height;
		super.resize(w, h);
		if (needChange) {
			this.chart.x = this.settings.offset.left;
			this.chart.y = this.settings.offset.top;
			this.chart.width = this.width - this.settings.offset.left - this.settings.offset.right;
			this.chart.height = this.height - this.settings.offset.top - this.settings.offset.bottom;
			this.draw();
		}
	}
	
	draw() {
		this.chart.draw();
		{
			let w = (this.chart.settings.max.x - this.chart.settings.min.x),
				h = (this.chart.settings.max.y - this.chart.settings.min.y),
				wc = (this.chart.width) / w,
				hc = (this.chart.height) / h;
			
			for (const [name, /*LineChart.Line*/line] of Object.entries(this.lines)) {
				if (line.visibility) {
					this.chart.ctx.lineWidth = line.lineWidth;
					this.chart.ctx.strokeStyle = HEXCOLOR(line.color);
					this.chart.ctx.beginPath();
					for (let i = 0; i < line.dots.length; i++) {
						let /*LineChart.Dot*/dot = line.dots[i];
						let x = (dot.x - this.chart.settings.shift.x) * wc,
							y = this.chart.height - (dot.y - this.chart.settings.shift.y) * hc;
						if (i) this.chart.ctx.lineTo(x, y);
						else this.chart.ctx.moveTo(x, y);
					}
					this.chart.ctx.stroke();
				}
			}
		}
	}
}
