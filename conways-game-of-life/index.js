import GameOfLife from "./game-of-life.js";
import Interface from "./interface.js";

export default class Application {
	constructor(settings) {
		// disable context menu
		document.oncontextmenu = document.body.oncontextmenu = function () {
			return false;
		};
		
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
		this.interface.canvas.addEventListener("click", this.click.bind(this));
		this.interface.btnPausePlay.addEventListener("click", this.onPausePlay.bind(this));
		this.interface.btnNextFrame.addEventListener("click", this.onNextFrame.bind(this));
		this.interface.btnSave.addEventListener("click", this.onSave.bind(this));
		this.interface.btnLoad.addEventListener("click", this.onLoad.bind(this));
		this.interface.btnLoad.disabled = !localStorage.getItem("save");
		this.player = null;
		
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
	
	onPausePlay() {
		if (!this.player) {
			this.player = setInterval(() => {
				this.game.step();
				this.draw();
			}, 1);
		} else {
			clearInterval(this.player);
			this.player = null;
		}
	}
	
	onNextFrame() {
		this.game.step();
		this.draw();
	}
	
	// events
	resize(e) {
		this.ctx.canvas.width = this.interface.canvas.getBoundingClientRect().width / this.scale;
		this.ctx.canvas.height = this.interface.canvas.getBoundingClientRect().height / this.scale;
		this.draw();
	}
	
	wheel(e) {
		if (e.path[0] === this.interface.canvas) {
			e.deltaY < 0 ? this.scale *= 1.5 : this.scale /= 1.5;
			this.resize();
		}
	}
	
	click(e) {
		let x = Math.floor((e.x - this.interface.canvas.getBoundingClientRect().left - this.offsetX) / this.scale);
		let y = Math.floor((e.y - this.interface.canvas.getBoundingClientRect().top - this.offsetY) / this.scale);
		this.game.setCell(x, y, !this.game.cell(x, y));
		this.draw();
	}
	
	onSave() {
		localStorage.setItem("save", this.game.raw);
		this.interface.btnLoad.disabled = false;
	}
	
	onLoad() {
		let save = localStorage.getItem("save");
		if (save) {
			this.game.raw = save;
			this.draw();
		}
	}
}
