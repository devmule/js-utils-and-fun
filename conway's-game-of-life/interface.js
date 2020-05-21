const symbols = {};
symbols.pause = " \u23F8 ";
symbols.play = " \u25B6 ";

const btnStyle = `
	margin-top: 8px;
	margin-bottom: 8px;
	padding-left: 4px;
	padding-right: 4px;
	height: 32px;
`;

export default class Interface {
	constructor(screen) {
		this.screen = screen;
		
		this.menu = document.createElement("div");
		this.menu.setAttribute("style", `background-color: #778899; width:calc(100%-16px); height: 48px; padding-left: 16px;`);
		this.screen.appendChild(this.menu);
		
		this.btnPausePlay = document.createElement("button");
		this.btnPausePlay.innerHTML = symbols.play;
		this.btnPausePlay.setAttribute("style", btnStyle);
		this.menu.appendChild(this.btnPausePlay);
		
		// =========================================================
		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("style", `width:100%; height: calc(100% - 48px);`);
		this.screen.appendChild(this.canvas);
	}
}
