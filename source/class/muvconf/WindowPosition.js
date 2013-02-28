
qx.Class.define("muvconf.WindowPosition",
{
	extend: qx.core.Object,
	
	statics: {
	
		count: 0,
		step: 50,

		find: function(desktop, window, exclude) {
		
			var desktopBounds = desktop.getBounds();
			desktopBounds.left = desktopBounds.top = 0;
			var desktopRect = this._getRect(desktopBounds);
			var windowSize = window.getSizeHint();

			if(typeof exclude == 'undefined')
				exclude = [];
			
			var rects = this._getRects(desktop.getWindows(), exclude, window);
			
			var checkPoints = this._sortCheckPoints(this._getCheckPoints(rects));
			
			for(var i=0; i<checkPoints.length; i++) {
			
				var point = checkPoints[i];
				
				var windowRect = this._getRect(point, windowSize);
				
				var isFit = this._isInside(windowRect, desktopRect);

				for(var j=0; isFit && j<rects.length; j++)
					isFit = !this._hasIntersection(windowRect, rects[j]);
				
				if(isFit)
					return { top: point.y, left: point.x };
			}


			var width = desktopBounds.width - windowSize.width - this.step;
			var height = desktopBounds.height - windowSize.height - this.step;
			
			if(width > 0 && height > 0) {
			
				var index = Math.floor(this.count % (Math.floor(width / this.step) * Math.floor(height / this.step)));
				var row = Math.floor(width / this.step);
				
				this.count++;
				
				return {
					top: Math.floor(index / row + 1) * this.step + (index % row + 1) * 4,
					left: (index % row + 1) * this.step
				};
			}
			
			return { top: 0, left: 0 };
		},
		
		_getRects: function(windows, exclude, window) {

			var rects = [];
		
			for(var i=0; i<windows.length; i++) {
			
				if(exclude.indexOf(windows[i]) < 0 && window != windows[i] && windows[i].isVisible()) {
				
					var bounds = windows[i].getBounds();
					
					if(bounds != null) {

						var properties = windows[i].getLayoutProperties();
					
						var correctedBounds = {
							left: (typeof properties.left != 'undefined') ? properties.left : bounds.left,
							top: (typeof properties.top != 'undefined') ? properties.top : bounds.top,
							width: bounds.width,
							height: bounds.height
						}
						
						rects.push(this._getRect(correctedBounds));
					}
				}
			}
			
			return rects;
		},
	
		_getCheckPoints: function(rects) {

			var checkPoints = [{ x: 0, y: 0 }];
			
			for(var i=0; i<rects.length; i++) {
			
				var rect = rects[i];
				
				checkPoints.push({ x: rect.right + 1, y: 0 });
				checkPoints.push({ x: 0, y: rect.bottom + 1 });
				
				for(var j=0; j<rects.length; j++) {

					if(i != j) {
					
						var rect2 = rects[j];
						
						if(rect.top < rect2.top) {
						
							if(rect.left <= rect2.right && rect2.right <= rect.right)
								checkPoints.push({
									x: rect2.right + 1,
									y: Math.max(rect.bottom + 1, rect2.top)
								});
						}
						
						if(rect.left < rect2.left) {
							
							if(rect.top <= rect2.bottom && rect2.bottom <= rect.bottom)
								checkPoints.push({
									x: Math.min(rect.right + 1, rect2.left),
									y: rect2.bottom + 1
								});
						}
					}
				}
			}
			
			return checkPoints;
		},
		
		_sortCheckPoints: function(checkPoints) {

			checkPoints.sort(function(p1, p2) {
				if(p1.y < p2.y)
					return -1;
				if(p1.y > p2.y)
					return 1;
				if(p1.x < p2.x)
					return -1;
				if(p1.x > p2.x)
					return 1;
				return 0;
			});
			
			return checkPoints;
		},

		_getRect: function(bounds, size) {
		
			if(typeof size != 'undefined') {
			
				var point = bounds;
			
				return {
					left: point.x,
					top: point.y,
					right: point.x + size.width,
					bottom: point.y + size.height
				};
			}
			else {
			
				return {
					left: bounds.left,
					top: bounds.top,
					right: bounds.left + bounds.width,
					bottom: bounds.top + bounds.height
				};
			}
		},
		
		_hasIntersection: function(rect1, rect2) {
		
			return rect1.left < rect2.right && rect1.right > rect2.left &&
					rect1.top < rect2.bottom && rect1.bottom > rect2.top;
		},
		
		_isInside: function(rect1, rect2) {
		
			return rect2.left <= rect1.left && rect1.right <= rect2.right &&
					rect2.top <= rect1.top && rect1.bottom <= rect2.bottom;
		}
	}
});