

qx.Mixin.define("muvconf.GuiTasks",
{
	members: {
	
		_centerWindow: function(window) {

			var once = true;
			window.addListener('appear', function() {
				if(once) {
					window.center();
					once = false;
				}
			}); 
		},
	
		createButtonForWindow: function(text, window) {
		
			var button = new qx.ui.toolbar.Button(text);
			
			button.addListener('execute', function() {
				window.show();
				this._desktop.setActiveWindow(window);
			}, this);
			
			return button;
		},
		
		_localVideoStream: null,
		_getUserMedia: null,
		
		_startLocalVideo: function() {

			// remove this block when switch to jssip 3.x
			if(this._getUserMedia == null) {
				if (window.navigator.webkitGetUserMedia) {
					this._getUserMedia = window.navigator.webkitGetUserMedia.bind(navigator);
				}
				else if (window.navigator.mozGetUserMedia) {
					this._getUserMedia = window.navigator.mozGetUserMedia.bind(navigator);
				}
				else if (window.navigator.getUserMedia) {
					this._getUserMedia = window.navigator.getUserMedia.bind(navigator);
				}
			}
			
			// Static helpers in JsSIP 3.0+
			// JsSIP.WebRTC.getUserMedia({'audio':true, 'video':true},
			// window.URL.createObjectURL(stream);
			this._getUserMedia({'audio':false, 'video':true},
				this.proxy(function(stream) {
					this._localVideoStream = stream;
					document.getElementById('localvideo').src = webkitURL.createObjectURL(stream);
				}),
				this.proxy(function(e) {
					this._log.write('Failed to show local video.');
				})
			);
		},
		
		_stopLocalVideo: function() {
		
			if(this._localVideoStream != null) {
				this._localVideoStream.stop();
				this._localVideoStream = null;
				document.getElementById('localvideo').src = null;
			}
		},

		_createVideoWindow: function(title, id) {

			var window = new qx.ui.window.Window(title);
			window.set({
				showClose: false,
				showMaximize: false,
				showMinimize: false,
				allowClose: false,
				allowMaximize: false,
				allowMinimize: false,
				width: 240,
				height: 220
			});
			window.setLayout(new qx.ui.layout.Grow());
			window.add(new qx.ui.embed.Html('<video id="' + id + '" autoplay style="width:100%; height:100%;">'));

			return window;
		},

		_createRemoteVideoWindow: function(uri, count) {

			var window = this._createVideoWindow('Remote: ' + uri, 'remotevideo' + count);

			this._addWindowToDesktop(window);

			// force to create window right now
			qx.html.Element.flush();
			
			return window;
		},
		
		_addWindowToDesktop: function(window) {

			this._desktop.add(window);

			window.addListener('appear', function() {
				var position = muvconf.WindowPosition.find(this._desktop, window, this._specialWindows);
				window.moveTo(position.left, position.top);
			}, this);
			
			window.addListener('close', function() {
				this._desktop.remove(window);
			}, this);
			
			window.show();
			window.activate();
		},

		_destroyRemoteVideoWindow: function(window) {
		
			if(typeof window != 'undefined') {
				window.close();
			}
		},

		createLogWindow: function(control) {
		
			var window = new qx.ui.window.Window("Log");
			window.set({
				showClose: false,
				showMaximize: false,
				showMinimize: false,
				allowClose: false,
				allowMaximize: false,
				allowMinimize: false,
				resizable: false,
				movable: false
			});
			window.setResizable(true, false, false, false);
			window.setLayout(new qx.ui.layout.Grow());
			window.add(control);
			
			return window;
		},
		
		createParticipantsWindow: function(participants) {
		
			var list = new qx.ui.form.List();
			var controller = new qx.data.controller.List(participants.getArray(), list);
			controller.setLabelPath('state');
			controller.setLabelOptions({
				converter: function(state, participant) {
					if(typeof participant != 'undefined') {
						return participant.getUri() + ', ' + participant.getStateText();
					}
					return '';
				}
			});

			var window = new qx.ui.window.Window("Participants");
			window.set({
				showClose: false,
				showMaximize: false,
				allowClose: false,
				allowMaximize: false,
				width: 240,
				height: 400
			});
			window.setLayout(new qx.ui.layout.Grow());
			window.add(list);
			
			var moveOnce = true;
			window.addListener('appear', function() {
				if(moveOnce) {
					var parent = window.getLayoutParent();
					var bounds = parent.getBounds();
					var hint = window.getSizeHint();
					window.moveTo(bounds.width - hint.width, 0);
					moveOnce = false;
				}
			}, this);
			window.show();
			
			return window;
		}
	}
});