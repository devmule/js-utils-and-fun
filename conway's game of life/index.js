import GameOfLife from "./game-of-life.js";
import Interface from "./interface.js";

export default class Application {
	constructor(settings = {}) {
		
		// game of life logic
		this.game = new GameOfLife(settings.fieldWidth || 100, settings.fieldHeight || 100);
		
		
		// browser events & visualization
		this.interface = new Interface(settings.screen);
		this.ctx = this.interface.canvas.getContext("2d");
		this.offsetX = 0;
		this.offsetY = 0;
		this.scale = settings.scale || 32; // 32 pixels per cell
		
		// events
		window.addEventListener("resize", this.resize.bind(this));
		window.addEventListener('wheel', this.wheel.bind(this));
		window.addEventListener('wheel', this.wheel.bind(this));
		this.interface.canvas.addEventListener("click", this.click.bind(this));
		
		this.play = null;
		this.interface.btnPausePlay.onclick = () => {
			if (!this.play) {
				this.play = setInterval(() => {
					this.game.step();
					this.draw();
				}, 1);
			} else {
				clearInterval(this.play);
				this.play = null;
			}
		};
		
		this.resize();
	}
	
	draw() {
		let realX = 0;
		let realY = 0;
		let color = "";
		for (let x = 0; x < this.ctx.canvas.width; x++) {
			for (let y = 0; y < this.ctx.canvas.height; y++) {
				realX = Math.floor(x - this.offsetX);
				realY = Math.floor(y - this.offsetY);
				
				// если близко к границе между ячейками, то цвет границы
				if (this.game.cell(realX, realY))
					color = "rgba(64,64,64,1)";
				else // иначе цвет пустоты
					color = (realY + realX) % 2 === 0 ? "rgba(255,255,255,1)" : "rgba(223,223,223,1)";
				
				this.ctx.fillStyle = color;
				this.ctx.fillRect(x, y, 1, 1);
			}
		}
	}
	
	// events
	resize(e) {
		this.ctx.canvas.width = this.interface.canvas.getBoundingClientRect().width / this.scale;
		this.ctx.canvas.height = this.interface.canvas.getBoundingClientRect().height / this.scale;
		this.draw();
	}
	
	wheel(e) {
		e.deltaY < 0 ? this.scale *= 1.5 : this.scale /= 1.5;
		this.resize();
	}
	
	click(e) {
		let x = Math.floor((e.x - this.interface.canvas.getBoundingClientRect().left - this.offsetX) / this.scale);
		let y = Math.floor((e.y - this.interface.canvas.getBoundingClientRect().top - this.offsetY) / this.scale);
		this.game.setCell(x, y, !this.game.cell(x, y));
		this.draw();
	}
}
