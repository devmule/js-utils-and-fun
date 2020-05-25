const symbols = {};
symbols.pause = "▐ ▌";
symbols.play = " \u25B6 ";
symbols.next = " \u23ed ";
symbols.save = "save";
symbols.load = "load";

const btnStyle = `
	margin: 8px;
	padding-left: 4px;
	padding-right: 4px;
	height: 32px;
	width: 98px;
	display: inline;
	float: left;
`;

export default class Interface {
	constructor(screen) {
		this.screen = screen;
		
		this.menu = document.createElement("div");
		this.menu.setAttribute("style", `background-color: #778899; width:calc(100%-16px); height: 48px; padding-left: 16px;`);
		this.screen.appendChild(this.menu);
		
		this.isPlay = false;
		this.btnPausePlay = document.createElement("button");
		this.btnPausePlay.addEventListener("click", this.onPausePlay.bind(this));
		this.btnPausePlay.innerHTML = symbols.play;
		this.btnPausePlay.setAttribute("style", btnStyle);
		this.menu.appendChild(this.btnPausePlay);
		
		this.btnNextFrame = document.createElement("button");
		this.btnNextFrame.innerHTML = symbols.next;
		this.btnNextFrame.setAttribute("style", btnStyle);
		this.menu.appendChild(this.btnNextFrame);
		
		this.btnSave = document.createElement("button");
		this.btnSave.innerHTML = symbols.save;
		this.btnSave.setAttribute("style", btnStyle);
		this.menu.appendChild(this.btnSave);
		
		this.btnLoad = document.createElement("button");
		this.btnLoad.innerHTML = symbols.load;
		this.btnLoad.setAttribute("style", btnStyle);
		this.menu.appendChild(this.btnLoad);
		
		// =========================================================
		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("style", `width:100%; height: calc(100% - 48px);`);
		this.screen.appendChild(this.canvas);
	}
	
	onPausePlay(e) {
		this.isPlay = !this.isPlay;
		this.btnNextFrame.disabled = this.isPlay;
		this.btnPausePlay.innerText = this.isPlay ? symbols.pause : symbols.play;
	}
}
