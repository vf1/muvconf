/*
#asset(muvconf/*)
*/

qx.Class.define("muvconf.Application",
{
	extend: qx.application.Standalone,

	include : [muvconf.MTools, muvconf.GuiTasks],
	
	members:
	{

		main : function()
		{
			this.base(arguments);

			if (qx.core.Environment.get("qx.debug")) {
				qx.log.appender.Native;
				qx.log.appender.Console;
			}

			qx.core.Init.getApplication().getRoot().setNativeContextMenu(true);

		// var part = new qx.ui.toolbar.Part();
		// part.add(new qx.ui.form.TextField().set({
			// allowStretchY: false,
			// alignY :'middle',
			// marginRight: 1,
			// width: 160
		// }));
		// part.add(button2);
		// toolbar.add(part);

			this._participants = new muvconf.ParticipantsCollection();

			
			var logTextArea = new qx.ui.form.TextArea();
			logTextArea.setReadOnly(true);
			var logWindow = this.createLogWindow(logTextArea);

			this._log = new muvconf.Log(logTextArea);


			this._localVideoWindow = this._createVideoWindow('Local', 'localvideo');

			
			this._signinWindow = new muvconf.SigninWindow();
			this._signinWindow.addListener('signin', this._signinHandler, this);
			this._signinWindow.addListener('signout', this._signoutHandler, this);
			
			
			this._inviteWindow = new muvconf.InviteWindow();
			this._inviteWindow.addListener('invite', this._inviteHandler, this);
			
			
			this._askInviteWindow = new muvconf.AskInviteWindow();
			this._askInviteWindow.addListener('askInvite', this._askInviteHandler, this);

			
			var paricipantsWindow = this.createParticipantsWindow(this._participants);

			
			this._centerWindow(this._signinWindow.getWindow());
			this._centerWindow(this._inviteWindow.getWindow());
			this._centerWindow(this._askInviteWindow);
			
			this._desktop = new qx.ui.window.Desktop();
			this._desktop.add(this._inviteWindow.getWindow());
			this._desktop.add(paricipantsWindow);
			this._desktop.add(logWindow, {width: '100%', bottom: 0});
			this._desktop.add(this._localVideoWindow);
			this._desktop.add(this._signinWindow.getWindow());
			this._desktop.add(this._askInviteWindow);

			this._specialWindows = [this._inviteWindow.getWindow(),
				this._signinWindow.getWindow(), logWindow, this._askInviteWindow];

				
			this._buttons.invite = this.createButtonForWindow('Invite', this._inviteWindow.getWindow());
			this._buttons.join = this.createButtonForWindow('Join', this._askInviteWindow);
			this._buttons.leave = new qx.ui.toolbar.Button('Leave');
			this._buttons.invite.addListener('appear', function() {
				var hint = this._buttons.invite.getSizeHint();
				this._buttons.join.setWidth(hint.width);
			}, this);

			this._buttons.leave.addListener('execute', this._leaveConference, this);
			
			var inviteJoinPart = new qx.ui.toolbar.Part()
			inviteJoinPart.add(this._buttons.invite)
			inviteJoinPart.add(this._buttons.join);


			var toolbar = new qx.ui.toolbar.ToolBar();
			toolbar.add(this.createButtonForWindow('Sign in / out', this._signinWindow.getWindow()))
			toolbar.add(new qx.ui.toolbar.Separator());
			toolbar.add(inviteJoinPart);
			toolbar.add(this._buttons.leave);
			toolbar.add(new qx.ui.toolbar.Separator());
			toolbar.add(this.createButtonForWindow('Participants', paricipantsWindow))
			
			//--
			/*
			var buttonx = new qx.ui.toolbar.Button('test');
			buttonx.addListener('execute', function() {
				var window = this._createRemoteVideoWindow('test', 'test'); 
				this._createRemoteVideoWindow('test', 'test'); 
				
				setTimeout(this.proxy(function() {
					window.close();
					//this._desktop.remove(window);
				}), 3000);
				
			}, this);
			toolbar.add(buttonx);
			*/
			/*
			var buttonx = new qx.ui.toolbar.Button('test');
			buttonx.addListener('execute', function() {
				var window = new muvconf.ViewInviteWindow({
					uri: 'jssip1@officesip.local',
					participants: [ 'jssip1@officesip.local', 'jssip2@officesip.local',
									'jssip3@officesip.local', 'jssip4@officesip.local',
									'jssip3@officesip.local', 'jssip4@officesip.local',
									'jssip3@officesip.local', 'jssip4@officesip.local',
									'jssip3@officesip.local', 'jssip4@officesip.local',
									'jssip3@officesip.local', 'jssip4@officesip.local',
									'jssip5@officesip.local', 'jssip6@officesip.local' ]
				}, this._desktop); 

				this._addWindowToDesktop(window);
				
			}, this);
			toolbar.add(buttonx);
			*/
			/*
			var buttonx = new qx.ui.toolbar.Button('test');
			buttonx.addListener('execute', function() {
				var window = new muvconf.ViewAskInviteWindow({uri: 'hello'}); 
				this._addWindowToDesktop(window);
				
			}, this);
			toolbar.add(buttonx);
			*/
			//--
			
			
			
			var composite = new qx.ui.container.Composite()
			composite.setLayout(new qx.ui.layout.VBox(2));
			composite.add(toolbar);
			composite.add(this._desktop, {flex: 1});

			
			this.getRoot().add(composite, {left: "0%", top: "0%", width: "100%", height: "100%"});


			this._setState(this.UNREGISTERED);
			
			
			this.interval1 = setInterval(this.proxy(this._timer), 2000);

			
			logWindow.show();

			var signinData = this.JsonParse(localStorage.getItem('signin'));
			if(signinData == null) {
				signinData = {
					'uri': 'user@officesip.local',
					'password': 'pass',
					'proxy': 'ws://192.168.1.1:5060'
				};
			}

			this._signinWindow.setData(signinData);
			this._signinWindow.show();
			
			this._nodeWebkit = new NodeWebkit(this.proxy(this._signoutHandler));
			this._nodeWebkit.showWindow();
		},

		interval1: null,
		interval2: null,
		
		REGISTERING: 1,
		REGISTERED: 2,
		UNREGISTERING: 3,
		UNREGISTERED: 4,
		state: -1,

		_appId: 'muvconf.1.0',
		
		_signinWindow: null,
		_inviteWindow: null,
		_localVideoWindow: null,
		_askInviteWindow: null,
		
		_ua: null,
		_signin: {},
		_invite: {},
		_log: null,
		_messages: {},
		_desktop: null,
		_nodeWebkit: null,
		
		_confId: null,
		_localVideo: null,
		_participants: null,

		_callCount: 0,
		
		_specialWindows: null,
		
		_buttons: {},
		
		//--------------------------------------------------------------------------------------
		
		_timer: function() {
		
			this._callParcipants();
			this._sendUpdateMessages();
		},
		
		_callParcipants: function() {
			
			for(var i=0; i<this._participants.getLength(); i++) {

				var participant = this._participants.getItem(i)

				if(participant.getState() == muvconf.Participant.ADDED) {
					participant.setState(muvconf.Participant.CONNECTING);
					this._call(participant.getUri());
				}
				
				if(participant.getState() == muvconf.Participant.FAILED || 
					participant.getState() == muvconf.Participant.ENDED) {
					
					if(participant.decRestoreCount())
						participant.setState(muvconf.Participant.ADDED);
				}
			}
		},

		_sendUpdateMessages: function() {
			
			var isConnectedChanged = this._participants.getAndResetIsConnectedChanged();
			
			if(isConnectedChanged) {
			
				for(var i=0; i<this._participants.getLength(); i++) {

					var participant = this._participants.getItem(i)

					if(participant.getState() == muvconf.Participant.CONNECTED)
						participant.hasDivergence = true;
				}
			}
		
			for(var i=0; i<this._participants.getLength(); i++) {

				var participant = this._participants.getItem(i)

				if(participant.getState() == muvconf.Participant.CONNECTED && participant.hasDivergence) {
					
					this._sendSpecialMessage(participant.getUri(), 'update');
					participant.hasDivergence = false;
					
					break;
				}
			}
		},

		//--------------------------------------------------------------------------------------
		
		_signinHandler: function(e) {

			this._setState(this.REGISTERING);
		
			var data = e.getData();
			this._register(data.uri, data.password, data.proxy);

			localStorage.setItem('signin', JSON.stringify(data));
		},

		_signoutHandler: function(e) {
		
			if(this.state == this.REGISTERED || this.$state == this.REGISTERING) {
			
				this._setState(this.UNREGISTERING);

				this._leaveConference();
				
				var count = 0;
				this.interval2 = setInterval(this.proxy(function() {
				
					var length = 0;
					if(this._ua != null) {
						for (var key in this._ua.sessions) {
							var session = this._ua.sessions[key];
							// JsSIP.c.SESSION_CONFIRMED - changed in next version
							if(session.status == JsSIP.c.SESSION_CONFIRMED)
								length++;
						}
					}
							
					if(++count > 20 || length == 0) {
						try {
							this._ua.stop();
						} catch(ex) {
							console.error(ex);
						}
						clearInterval(this.interval2);
						this.interval2 = null;
					}
				}), 200);
			}
		},
		
		_inviteHandler: function(e) {

			if(this._confId == null)
				this._setConfId(this.generateRandomString(8));

			var text = ''
			var uris = e.getData().uris;
			for(var i=0; i<uris.length; i++) {
				text = text + uris[i] + ', ';
				this._sendSpecialMessage(uris[i], 'invite');
			}
			
			this._log.write('Send invite to: ' + text);
		},
		
		_call: function(uri) {
		
			var remoteVideoWindow = this._createRemoteVideoWindow(uri, this._callCount);

			var views = {
				'selfView': null,
				'remoteView': document.getElementById('remotevideo' + this._callCount)
			};

			var handlers = {
				'connecting': this.proxy(function(e){
					e.sender.data = remoteVideoWindow;
				}),
				'progress': function(e){ },
				'started': this.proxy(this._sessionStarted),
				'failed': this.proxy(this._sessionFailed),
				'ended': this.proxy(this._sessionEnded)
			};
			
			this._ua.call(uri, true, true, handlers, views);
			
			this._callCount++;
		},
		
		_register: function(uri, password, proxy) {	

			this._participants.addItem(uri, muvconf.Participant.LOCAL);
			
			try {
				this._ua = new JsSIP.UA({
					'outbound_proxy_set': proxy,
					'uri': uri,
					'password': password
					,'trace_sip': true
				});
			
				this._ua.on('connected', function() {});
				this._ua.on('disconnected', this.proxy(this._unregistred));
				this._ua.on('registered', this.proxy(this._registered));
				this._ua.on('unregistered', this.proxy(this._unregistred));
				this._ua.on('registrationFailed', this.proxy(this._registrationFailed));
				this._ua.on('newSession', this.proxy(this._newSession));
				this._ua.on('newMessage', this.proxy(this._newMessage));

				this._ua.start();
			}
			catch(ex) {
				this._log.write('Failed: ', ex.message);
				this._setState(this.UNREGISTERED)
			}
		},
		
		_registered: function(e) {
			
			this._setState(this.REGISTERED);

			this._localVideoWindow.show();
			this._startLocalVideo();
			
			this._signinWindow.getWindow().hide();
		},
		
		_unregistred: function(e) {

			if(this.state != this.UNREGISTERED) {
			
				this._ua = null;
				this._setConfId(null);
				
				this._setState(this.UNREGISTERED);
				
				this._localVideoWindow.hide();
				this._stopLocalVideo();

				this._participants.removeAll();
			}
		},
		
		_registrationFailed: function(e) {

			this._log.write('Failed: ' + e.data.cause);
			this._unregistred(e);
		},
		
		_sendSpecialMessage: function(uri, action, states) {
		
			var descriptor = {
				'version': this._appId,
				'action': action,
				'conferenceId': this._confId,
				'participants': this._participants.getAll(states)
			}
			
			var handlers = {
				'succeeded': this.proxy(function(e){
				}),
				'failed': this.proxy(function(e){
					this._log.write('Command [' + action + '] failed: ' + e.sender.remote_identity + ', ' + e.data.cause);
				})
			};
			
			if(action == 'join') {
				delete descriptor.conferenceId;
				delete descriptor.participants;
			}
			
			this._ua.sendMessage(uri, JSON.stringify(descriptor), 'text/plain', handlers);
		},
		
		_newMessage: function(e) {
		
			if(e.data.message.direction == 'incoming') {
			
				var data = this.JsonParse(e.data.request.body);
				
				if(data != null && data.version == this._appId) {
				
					data.uri = this._participants.stripUri(e.data.message.remote_identity);
					
					if(data.action == 'invite') {
						this._processInviteMessage(data);
					}
					else if(data.action == 'join') {
						this._processJoinMessage(data);
					}
					else if(data.conferenceId == this._confId) {
						if(data.action == 'update') {
							this._processUpdateMessage(data);
						}
						else if(data.action == 'bye') {
							this._processByeMessage(data);
						}
					}
				}
			}
		},
		
		_processInviteMessage: function(data) {
			if(data.conferenceId == this._confId) {
				// new invite how it should react?
			}
			else {
				if(this._confId == null || this._participants.getLength() == 1) {
					
					var window = new muvconf.ViewInviteWindow(data);
					window.addListener('accept', this._inviteAccepted, this);
					
					this._addWindowToDesktop(window);
				}
			}
		},

		_processJoinMessage: function(data) {
		
			var window = new muvconf.ViewAskInviteWindow(data);
			window.addListener('invite', this._inviteHandler, this);
			
			this._addWindowToDesktop(window);
		},
		
		_processUpdateMessage: function(data) {

			this._participants.addItems(data['participants']);
		},
		
		_processByeMessage: function(data) {
		
			if(data.participants.length > 0) {
			
				this._participants.removeItem(data.participants[0]);
				
				this._terminateSessionByUri(data.participants[0]);
			}
		},
		
		_leaveConference: function() {
		
			if(this._confId != null) {
			
				this._log.write('Leave the conference');

				for(var i=0; i<this._participants.getLength(); i++) {
					
					var participant = this._participants.getItem(i);
					
					if(participant.getState() == muvconf.Participant.CONNECTED) {
						this._sendSpecialMessage(
							participant.getUri(), 'bye', [muvconf.Participant.LOCAL]);
					}
				}
				
				this._setConfId(null);

				this._participants.removeAllExcept(muvconf.Participant.LOCAL);
			}
		},
		
		_askInviteHandler: function(e) {
			
			var uri = e.getData().uri;
			
			this._log.write('Request an invite: ' + uri);
			
			this._sendSpecialMessage(uri, 'join');
		},
		
		_inviteAccepted: function(e) {
		
			var data = e.getData();

			this._leaveConference();
			
			this._setConfId(data.conferenceId);
			this._participants.addItems(data['participants']);
		},

		_terminateSessionByUri: function(uri) {
		
			var session = this._getSessionByUri(uri);
			
			if(session != null)
				session.terminate();
		},
		
		_getSessionByUri: function(uri) {
			
			for(var id in this._ua.sessions) {
				var session = this._ua.sessions[id];
				if(this._participants.stripUri(session.remote_identity) == uri)
					return session;
			}
			
			return null;
		},
		
		_newSession: function(e) {

			var session = e.data.session
			var participant = this._participants.getItem(session.remote_identity);
			
			if (session.direction == 'outgoing') {

				var json = JSON.stringify([this._confId, participant.getPriority()]);
				e.data.request.setHeader('X-MUVConf', json.substr(1, json.length - 2));
			}		
			else if (session.direction == 'incoming') {
			
				var data = this.JsonParse(
					'[' + e.data.request.getHeader('X-MUVConf') + ']');
				
				if(this._confId != data[0]) {
					session.terminate();
				}
				else {
				
					if(participant == null || participant.getPriority() > data[1]) {
					
						if(participant != null && participant.getState() == muvconf.Participant.CONNECTED)
							this._terminateSessionByUri(participant.getUri());

						if(participant == null) {
							this._participants.addItem(session.remote_identity);
							participant = this._participants.getItem(session.remote_identity);
						}
						this._participants.setState(participant, muvconf.Participant.CONNECTING);

						session.on('started', this.proxy(this._sessionStarted));
						session.on('failed', this.proxy(this._sessionFailed));
						session.on('ended', this.proxy(this._sessionEnded));
						
						session.data = this._createRemoteVideoWindow(
							participant.getUri(), this._callCount);

						var remoteView = document.getElementById('remotevideo' + this._callCount);
						session.answer(null, remoteView);

						this._callCount++;
					}
					else {

						if(participant.getPriority() == data[1])
							this._participants.setState(participant, muvconf.Participant.ADDED);
						session.terminate();
					}
				}
			}
		},
		
		_sessionStarted: function(e) {
			this._participants.setState(e.sender.remote_identity, muvconf.Participant.CONNECTED);
		},
		
		_sessionFailed: function(e) {
			this._participants.setState(e.sender.remote_identity, muvconf.Participant.FAILED);
			this._destroyRemoteVideoWindow(e.sender.data);
		},

		_sessionEnded: function(e) {
			this._participants.setState(e.sender.remote_identity, muvconf.Participant.ENDED);
			this._destroyRemoteVideoWindow(e.sender.data);
		},
		
		_setConfId: function(value) {
		
			if(this._confId != value) {
				this._confId = value;
				this._updateButtons();				
			}
		},
		
		_updateButtons: function() {
		
			var isEnabled = (this.state == this.REGISTERED);
			
			this._buttons.invite.setEnabled(isEnabled);
			this._buttons.join.setEnabled(isEnabled && this._confId == null)
			this._buttons.leave.setEnabled(isEnabled && this._confId != null);
		},
		
		_setState: function(newState) {
		
			if(this.state != newState && typeof newState !== 'undefined') {
				switch(newState) {
					case this.REGISTERING: this._log.write('Connecting...'); break;
					case this.REGISTERED: this._log.write('Connected'); break;
					case this.UNREGISTERING: this._log.write('Disconnecting...'); break;
					case this.UNREGISTERED: this._log.write('Disconnected'); break;
				}
			}
		
			this.state = newState || this.state;
			
			this._updateButtons();
			
			this._inviteWindow.enable(this.state == this.REGISTERED);
			
			this._signinWindow.enable(
				this.state == this.UNREGISTERED,
				this.state == this.REGISTERING || this.state == this.REGISTERED
			);
		}
	}
});
