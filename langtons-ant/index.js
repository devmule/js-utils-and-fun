import {colors} from "./colors.js";
import Ant from "./ant.js";

export default class Application {
	constructor() {
		this.ant = new Ant();
		this.ant.x = this.ant.y = 15;
		
		
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.canvas.setAttribute("style", `width:100%; height: 100%;`);
		document.getElementById("screen").appendChild(this.canvas);
		
		
		window.addEventListener("resize", this.resize.bind(this));
		this.resize();
		
		this.play = null;
		this.pausePlay = () => {
			if (!this.play) {
				this.play = setInterval(this.tick.bind(this), 1);
			} else {
				clearInterval(this.play);
				this.play = null;
			}
		};
		
		
		// hot fixes
		this.ant.x = Math.round(this.ctx.canvas.width / 2);
		this.ant.y = Math.round(this.ctx.canvas.height / 2);
		this.pausePlay();
	}
	
	resize() {
		this.ctx.canvas.width = this.canvas.getBoundingClientRect().width / 32;
		this.ctx.canvas.height = this.canvas.getBoundingClientRect().height / 32;
		this.draw();
	}
	
	draw() {
		let color = "";
		for (let x = 0; x < this.ctx.canvas.width; x++) {
			for (let y = 0; y < this.ctx.canvas.height; y++) {
				
				color = colors[this.ant.getCell(x, y)];
				
				this.ctx.fillStyle = color;
				this.ctx.fillRect(x, y, 1, 1);
			}
		}
	}
	
	tick() {
		this.ant.step();
		this.draw();
	}
}
