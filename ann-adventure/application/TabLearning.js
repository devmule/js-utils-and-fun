import * as MYDOM from '../../MYDOM/index.js';
import Rosenblatt from "../networks/Rosenblatt.js";
import Application from "../Application.js";

export class TabLearning extends MYDOM.DOMController {
	constructor(/*Application*/app) {
		super();
		this.style.width = MYDOM.PERCENTS(100);
		this.style.height = MYDOM.PERCENTS(100);
		
		this.app = app;
	}
}
