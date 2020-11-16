import {DOMController, PERCENTS, PIXELS, PIXELS_GET, HEXCOLOR} from "./DOMController.js";
import {STYLES} from "./styles.js";

class Tab extends DOMController {
	constructor(name) {
		super();
		
		this.cont.innerHTML = name;
		this.disableSelection();
		
		let offset = 4;
		
		this.style.display = 'inline-block';
		this.style.fontSize = PIXELS(STYLES.textSizeDefault);
		this.style.padding = PIXELS((STYLES.heightDefault - STYLES.textSizeDefault - offset) / 2);
		this.height = STYLES.heightDefault - PIXELS_GET(this.style.padding) * 2 - offset;
		this.style.marginTop = PIXELS(offset);
		this.style.marginLeft = this.style.marginRight = PIXELS(offset / 2);
		
		this.style.backgroundColor = HEXCOLOR(STYLES.colorLight);
		this.style.color = HEXCOLOR(STYLES.colorPrimaryLight);
		
		this.style.borderTopLeftRadius = this.style.borderTopRightRadius = PIXELS(STYLES.radiusDefault);
		
		this.style.cursor = 'pointer';
	}
	
	set active(val) {
		this.style.backgroundColor = HEXCOLOR(val ? STYLES.colorLight : STYLES.colorDark);
		this.style.color = HEXCOLOR(val ? STYLES.colorPrimaryLight : STYLES.colorPrimaryDark);
	}
}

class TabContent extends DOMController {
	constructor() {
		super();
		this.style.height = PERCENTS(100);
		this.style.width = PERCENTS(100);
		this.style.backgroundColor = HEXCOLOR(STYLES.colorLight);
	}
}

export class TabList extends DOMController {
	
	constructor() {
		super();
		this.tabs = {};
		
		this.tabContainer = new DOMController();
		this.tabContainer.absolute = true;
		this.tabContainer.height = STYLES.heightDefault;
		this.tabContainer.style.width = PERCENTS(100);
		
		this.contentContainer = new DOMController();
		this.contentContainer.y = STYLES.heightDefault;
		this.contentContainer.absolute = true;
		this.contentContainer.style.height = `calc(${PERCENTS(100)} - ${PIXELS(STYLES.heightDefault)})`;
		this.contentContainer.style.width = PERCENTS(100);
		
		this.add(
			this.tabContainer,
			this.contentContainer
		)
	}
	
	/**
	 * @return {DOMController}
	 */
	addTab(id, name) {
		if (!this.tabs[id]) {
			let tab = new Tab(name);
			tab.addEventListener('click', this.selectTab.bind(this, id));
			let content = new TabContent();
			content.visible = false;
			this.tabs[id] = {tab: tab, content: content};
			this.tabContainer.add(tab);
			this.contentContainer.add(content);
		}
		return this.tabs[id].content;
	}
	
	selectTab(id) {
		for (const [tab_id, tab] of Object.entries(this.tabs)) {
			tab.tab.active = tab.content.visible = id === tab_id;
		}
	}
	
	removeTab(id) {
		if (this.tabs[id]) {
			this.tabContainer.remove(this.tabs[id].tab);
			this.contentContainer.remove(this.tabs[id].content);
			delete this.tabs[id];
		}
	}
}
