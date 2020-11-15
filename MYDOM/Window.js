import {DOMController, PIXELS, PIXELS_GET, HEXCOLOR, PERCENTS, RGBA} from './DOMController.js';
import {STYLES} from './styles.js';

export class Window extends DOMController {
	constructor() {
		super();
		
		// children
		this.header = new DOMController();
		this.header.absolute = true;
		this.header.style.backgroundColor = HEXCOLOR(STYLES.colorLight);
		this.header.style.overflow = 'hidden';
		this.header.style.width = PERCENTS(100);
		this.header.height = STYLES.heightDefault;
		this.header.style.cursor = 'grab';
		
		this.header.addEventListener('mousedown', this.beginDrag.bind(this));
		this.header.addEventListener('mousemove', this.dragging.bind(this));
		this.header.addEventListener('mouseup', this.stopDrag.bind(this));
		this.header.addEventListener('mouseout', this.stopDrag.bind(this));
		
		this.container = new DOMController();
		this.container.absolute = true;
		this.container.style.backgroundColor = HEXCOLOR(STYLES.colorDark);
		this.container.style.overflow = 'scroll';
		this.container.style.width = PERCENTS(100);
		this.container.style.height = `calc(100% - ${PIXELS(this.header.height)})`;
		this.container.y = this.header.height;
		
		this.add(this.header, this.container);
		
		// Window style
		this.absolute = true;
		this.style.overflow = 'hidden';
		this.style.borderRadius = PIXELS(STYLES.radiusDefault);
		this.style.boxShadow =
			'-webkit-box-shadow: 0px 12px 25px 10px rgba(0,0,0,0.5); ' +
			'box-shadow: 0px 12px 25px 10px rgba(0,0,0,0.5)';
		this.width = this.height = 300;
		this.x = this.y = 100;
		
		// Window resizing
		this._isDragging = false;
		this._isResizing = false;
		this.original = {mouseX: 0, mouseY: 0, x: 0, y: 0, width: 0, height: 0};
		this.minimum = {width: 100, height: 100};
		
		this.resizers = new DOMController();
		this.resizers.cont.classList.add('resizers');
		this.add(this.resizers);
		
		let resizers = [['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']];
		for (let i = 0; i < resizers.length; i++) {
			let resizer = new DOMController();
			resizer.cont.classList.add('resizer', ...resizers[i]);
			this.resizers.add(resizer);
			
			resizer.addEventListener('mousedown', this.beginResize.bind(this));
			resizer.addEventListener('mousemove', this.resize.bind(this, resizer));
			resizer.addEventListener('mouseup', this.stopResize.bind(this));
			resizer.addEventListener('mouseout', this.stopResize.bind(this));
		}
	}
	
	beginDrag(e) {
		this._isDragging = true;
		this.original.x = this.x;
		this.original.y = this.y;
		this.original.mouseX = e.pageX;
		this.original.mouseY = e.pageY;
		this.header.style.cursor = 'grabbing';
	}
	
	stopDrag(e) {
		this._isDragging = false;
		this.header.style.cursor = 'grab';
	}
	
	dragging(e) {
		if (this._isDragging) {
			e.preventDefault();
			this.x = this.original.x + e.pageX - this.original.mouseX;
			this.y = this.original.y + e.pageY - this.original.mouseY;
		}
	}
	
	beginResize(e) {
		this._isResizing = true;
		this.original.mouseX = e.pageX;
		this.original.mouseY = e.pageY;
		this.original.x = this.x;
		this.original.y = this.y;
		this.original.width = this.width;
		this.original.height = this.height;
	}
	
	stopResize(e) {
		this._isResizing = false;
	}
	
	resize(curr, e) {
		if (this._isResizing) {
			e.preventDefault();
			let dx = e.pageX - this.original.mouseX,
				dy = e.pageY - this.original.mouseY,
				width = 0,
				height = 0;
			
			if (curr.cont.classList.contains('right')) {
				width = this.original.width + dx;
				if (width > this.minimum.width) {
					this.width = width;
				}
			}
			
			if (curr.cont.classList.contains('left')) {
				width = this.original.width - dx;
				if (width > this.minimum.width) {
					this.width = width;
					this.x = this.original.x + dx;
				}
			}
			
			if (curr.cont.classList.contains('bottom')) {
				height = this.original.height + dy;
				if (height > this.minimum.height) {
					this.height = height;
				}
			}
			
			if (curr.cont.classList.contains('top')) {
				height = this.original.height - dy;
				if (height > this.minimum.height) {
					this.height = height;
					this.y = this.original.y + dy;
				}
			}
		}
	}
}
