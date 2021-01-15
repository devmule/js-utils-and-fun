import * as MYDOM from '../../MYDOM/index.js';
import Application from "../Application.js";
import {EnumEvents} from "./ENUMS.js";
import {TabSamples} from "./TabSamples.js";
import {Localizations} from "../Localizations.js";

let maxDots = 10;
let lineName = 'error';

class ChartValue extends MYDOM.DOMController {
	constructor() {
		super();
		
		this.absolute = true;
		this.visible = false;
		this.disableSelection();
		
		this.style.pointerEvents = 'none';
		
		let arrowSize = 8;
		
		this.ar = new MYDOM.DOMController();
		this.ar.absolute = true;
		this.ar.width = this.ar.height = 0;
		this.ar.style.borderLeft = this.ar.style.borderRight = `${MYDOM.PIXELS(arrowSize)} solid transparent`;
		this.ar.style.borderBottom = `${MYDOM.PIXELS(arrowSize)} solid ${MYDOM.HEXCOLOR(MYDOM.STYLES.colorBlack, .5)}`;
		this.add(this.ar);
		
		this.vc = new MYDOM.DOMController();
		this.vc.cont.innerHTML = String(0);
		this.vc.absolute = true;
		this.vc.style.backgroundColor = MYDOM.HEXCOLOR(MYDOM.STYLES.colorBlack, .5);
		this.vc.style.color = MYDOM.HEXCOLOR(MYDOM.STYLES.colorWhite);
		this.vc.style.borderRadius = MYDOM.PIXELS(MYDOM.STYLES.radiusDefault);
		this.vc.style.fontSize = MYDOM.PIXELS(MYDOM.STYLES.textSizeDefault);
		this.vc.style.paddingTop = this.vc.style.paddingBottom = MYDOM.PIXELS((MYDOM.STYLES.heightDefault - MYDOM.PIXELS_GET(this.vc.style.fontSize)) / 2);
		this.vc.height = MYDOM.PIXELS_GET(this.vc.style.fontSize);
		this.vc.y = arrowSize;
		this.width = this.vc.width = 100;
		this.ar.x = (this.width - arrowSize) / 2;
		this.height = MYDOM.STYLES.heightDefault;
		
		this.vc.style.textAlign = 'center';
		this.style.zIndex = '2';
		
		this.add(this.vc)
	}
	
	moveTo(x, y) {
		this.x = x - this.width / 2;
		this.y = y + 5;
	}
	
	set value(val) {
		this.vc.cont.innerHTML = val.toFixed(7);
	}
}

let chartValue = new ChartValue();

class Chart extends MYDOM.LineChart {
	constructor() {
		super();
		this.absolute = true;
		this.style.overflow = 'hidden';
		this.chart.settings.min.y = 0;
		this.chart.settings.max.y = 1;
		this.chart.settings.min.x = 0;
		this.chart.settings.max.x = 1;
		this.chart.settings.grid.x = -1;
		
		this.settings.offset.bottom = 100;
		this.settings.offset.right = 100;
		
		this.chart.addEventListener('mouseenter', this.mouseenter.bind(this));
		this.chart.addEventListener('mouseleave', this.mouseleave.bind(this));
		this.chart.addEventListener('mousemove', this.mousemove.bind(this));
	}
	
	mouseenter(e) {
		chartValue.visible = true;
	}
	
	mouseleave(e) {
		chartValue.visible = false;
	}
	
	mousemove(e) {
		let x = (e.x - this.settings.offset.left) / this.chart.width * (this.chart.settings.max.x - this.chart.settings.min.x) + this.chart.settings.min.x;
		//let y = (1 - (e.y - MYDOM.STYLES.heightDefault - this.settings.offset.top) / this.chart.height) * (this.chart.settings.max.y - this.chart.settings.min.y) + this.chart.settings.min.y;
		chartValue.moveTo(e.x, this.settings.offset.top + this.chart.height * (1 - this.value(x)));
		chartValue.value = this.value(x);
	}
	
	value(x) {
		let line = this.lines[lineName];
		let l = line.dots[Math.min(line.dots.length - 1, Math.max(0, Math.floor(x)))].y;
		let r = line.dots[Math.min(line.dots.length - 1, Math.max(0, Math.ceil(x)))].y;
		return l + (r - l) * (x % 1);
	}
}

class Settings extends MYDOM.DOMController {
	constructor(tab) {
		super();
		this.absolute = true;
		this.tab = tab;
		
		let offset = 16;
		
		this.btnLearning = new MYDOM.Button(Localizations.getText('LearnBegin'));
		this.btnLearning.style.fontSize = MYDOM.PIXELS(MYDOM.STYLES.textSizeDefault);
		this.btnLearning.absolute = true;
		this.btnLearning.x = 52;
		this.btnLearning.y = offset;
		this.btnLearning.addEventListener('click', this.onLearningClick.bind(this));
		this.add(this.btnLearning);
		this.addEventListener(EnumEvents.onNetworkChanged, () => this.isLearning(this.tab.app.networkController.isLearning));
		
		this.labelLearningRate = new MYDOM.DOMController();
		this.labelLearningRate.cont.innerHTML = Localizations.getText('LearningRate');
		this.labelLearningRate.style.textAlign = 'center';
		this.labelLearningRate.style.color = MYDOM.HEXCOLOR(MYDOM.STYLES.colorWhite);
		this.labelLearningRate.style.fontSize = MYDOM.PIXELS(MYDOM.STYLES.textSizeDefault);
		this.labelLearningRate.absolute = true;
		this.labelLearningRate.width = this.btnLearning.width;
		this.labelLearningRate.height = this.btnLearning.height / 2;
		this.labelLearningRate.x = 52;
		this.labelLearningRate.y = this.btnLearning.y + this.btnLearning.height + offset;
		this.add(this.labelLearningRate);
		
		this.inputLearningRate = new MYDOM.InputNumber(this.tab.app.networkController.settings.lr, 0.01, 20, 0.1);
		this.inputLearningRate.absolute = true;
		this.inputLearningRate.x = 52;
		this.inputLearningRate.y = this.labelLearningRate.y + this.labelLearningRate.height;
		this.inputLearningRate.addEventListener('change', () => {
			this.inputLearningRate.input.cont.value = this.inputLearningRate.value.toFixed(1);
			this.tab.app.networkController.settings.lr = this.inputLearningRate.value
		});
		this.add(this.inputLearningRate);
		
		this.labelEpochs = new MYDOM.DOMController();
		this.labelEpochs.cont.innerHTML = Localizations.getText('EpochsCount');
		this.labelEpochs.style.textAlign = 'center';
		this.labelEpochs.style.color = MYDOM.HEXCOLOR(MYDOM.STYLES.colorWhite);
		this.labelEpochs.style.fontSize = MYDOM.PIXELS(MYDOM.STYLES.textSizeDefault);
		this.labelEpochs.absolute = true;
		this.labelEpochs.width = this.btnLearning.width;
		this.labelEpochs.height = this.btnLearning.height / 2;
		this.labelEpochs.x = 52;
		this.labelEpochs.y = this.inputLearningRate.y + this.inputLearningRate.height + offset;
		this.add(this.labelEpochs);
		
		this.inputEpochs = new MYDOM.InputNumber(this.tab.app.networkController.settings.epochs, 1, 1000000, 100);
		this.inputEpochs.absolute = true;
		this.inputEpochs.x = 52;
		this.inputEpochs.y = this.labelEpochs.y + this.labelEpochs.height;
		this.inputEpochs.addEventListener('change', () => this.tab.app.networkController.settings.epochs = this.inputEpochs.value);
		this.add(this.inputEpochs);
	}
	
	isLearning(val) {
		this.btnLearning.text = val ? Localizations.getText('LearnEnd') : Localizations.getText('LearnBegin');
	}
	
	onLearningClick() {
		if (this.tab.app.networkController.isLearning) this.tab.endLearn();
		else this.tab.startLearn();
		this.isLearning(this.tab.app.networkController.isLearning);
	}
}

export class TabLearning extends MYDOM.DOMController {
	constructor(/*Application*/app) {
		super();
		this.style.height = MYDOM.PERCENTS(100);
		this.style.width = MYDOM.PERCENTS(100);
		this.style.overflow = 'hidden';
		
		this.app = app;
		this.settings = new Settings(this);
		this.chart = new Chart();
		this.chart.addLine(lineName);
		this.errorGet({detail: {err: .5}});
		this.errorGet({detail: {err: .5}});
		
		this.settings.width = this.chart.x = 300;
		this.add(this.settings, this.chart, chartValue);
		
		document.addEventListener(EnumEvents.onNetworkErrorGet, this.errorGet.bind(this));
		window.addEventListener('resize', () => this.resize(window.innerWidth, window.innerHeight - MYDOM.STYLES.heightDefault));
		this.resize(window.innerWidth, window.innerHeight - MYDOM.STYLES.heightDefault);
	}
	
	resize(w, h) {
		this.settings.resize(300, h);
		this.chart.resize(w - 300, h);
	}
	
	errorGet(e) {
		let err = e.detail.err;
		let line = this.chart.lines[lineName];
		let index = line.dots.length;
		
		let dot = new MYDOM.LineChart.Dot(index, err);
		line.dots.push(dot);
		
		this.chart.chart.settings.max.x = index || 1;
		
		this.chart.draw();
	}
	
	startLearn() {
		let nc = this.app.networkController;
		if (nc.isSamplesFit) {
			nc.learnStart();
		} else {
			this.app.tablist.selectTab(TabSamples.name);
		}
	}
	
	endLearn() {
		let nc = this.app.networkController;
		nc.learnStop();
	}
}
