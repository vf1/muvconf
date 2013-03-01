
var NodeWebkit = function (beforeQuitEvent) {

	this._beforeQuitEvent = beforeQuitEvent;

	this._isReady = false;
	this._gui = null;
	this._win = null;

	this._windowPosInterval = null;

	this._width = -1;
	this._height = -1;

	this._platform = '';

	this._initialize();
}

NodeWebkit.prototype = {

	showWindow: function() {
		if(this._isReady) {
			if (localStorage) {
				if(localStorage.desktopWidth && localStorage.desktopHeight) {
					this._width = parseInt(localStorage.desktopWidth);
					this._height = parseInt(localStorage.desktopHeight);
      					this._win.resizeTo(this._width, this._height);
				}
				if(localStorage.desktopX && localStorage.desktopY && localStorage.desktopX > 0 && localStorage.desktopY > 0)
	      				this._win.moveTo(parseInt(localStorage.desktopX), parseInt(localStorage.desktopY));
			}

			this._win.show();
		}
	},

	_initialize: function() {

		if(typeof require === 'undefined') return;
		this._gui = require('nw.gui');

		if(typeof this._gui === 'undefined') return;
		this._win = this._gui.Window.get();

		if(typeof process == "object")
			this._platform = process.platform;
			
		this._win.on('close', $.proxy(this._onExitClick, this));

		//this._windowPosInterval = setInterval($.proxy(this._saveWindowPos, this), 1000);
	
		this._isReady = true;
	},

	_saveWindowPos: function() {
		if(this._isReady && !this._isMinimized && localStorage) {
			this._width = this._win.width;
			this._height = this._win.height;
			localStorage.desktopX = this._win.x;
			localStorage.desktopY = this._win.y;
			localStorage.desktopWidth  = this._win.width;
			localStorage.desktopHeight = this._win.height;
		}
	},

	_onExitClick: function() {

		setTimeout(this._gui.App.quit, 2000);

		this._win.hide();

		this._beforeQuitEvent();
	}
}
