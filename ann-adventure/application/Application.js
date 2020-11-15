import * as MYDOM from './../imports.js';

export default class Application extends MYDOM.DOMController {
	constructor(elem) {
		super(elem);
		this.cont.style.width = this.cont.style.height = MYDOM.PERCENTS(100);
		
		let tab = new MYDOM.TabList();
		tab.style.width = MYDOM.PERCENTS(100);
		tab.style.height = MYDOM.PERCENTS(100);
		this.add(tab);
		
		let t = tab.addTab('1', 'hello');
		let tt = tab.addTab('2', 'world');
		t.style.backgroundColor = MYDOM.HEXCOLOR(0x663333);
	}
}
