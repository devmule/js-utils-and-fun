import * as MYDOM from '../../MYDOM/index.js';
import Rosenblatt from "../networks/Rosenblatt.js";
import Application from "../Application.js";

export class TabSamples extends MYDOM.DOMController {
	constructor(/*Application*/app) {
		super();
		this.app = app;
	}
}
