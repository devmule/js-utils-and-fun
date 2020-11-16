import * as MYDOM from '../MYDOM/index.js';

import Rosenblatt from "./networks/Rosenblatt.js";

import {Localizations} from "./Localizations.js";
import {TabLearning} from "./application/TabLearning.js";
import {TabSamples} from "./application/TabSamples.js";
import {TabNetwork} from "./application/TabNetwork.js";

export default class extends MYDOM.DOMController {
	constructor(elem) {
		super(elem);
		// ============================= STYLES ==============================
		
		this.style.width = this.style.height = MYDOM.PERCENTS(100);
		this.style.backgroundColor = MYDOM.HEXCOLOR(MYDOM.STYLES.colorBlack);
		
		// ============================= NETWORK MODEL ==============================
		
		this.network = new Rosenblatt(2, 2, 2);
		this.trainingSamples = [];
		
		// ============================= INTERFACE ==============================
		
		this.tablist = new MYDOM.TabList();
		this.tablist.style.width = MYDOM.PERCENTS(100);
		this.tablist.style.height = MYDOM.PERCENTS(100);
		this.add(this.tablist);
		
		this.tabNetwork = new TabNetwork(this);
		this.tablist.addTab(TabNetwork.name, Localizations.getText(TabNetwork.name)).add(this.tabNetwork);
		
		this.tabSamples = new TabSamples(this);
		this.tablist.addTab(TabSamples.name, Localizations.getText(TabSamples.name)).add(this.tabSamples);
		
		this.tabLearning = new TabLearning(this);
		this.tablist.addTab(TabLearning.name, Localizations.getText(TabLearning.name)).add(this.tabLearning);
		
		this.tablist.selectTab(TabNetwork.name);
	}
}
