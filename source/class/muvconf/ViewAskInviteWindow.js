
qx.Class.define("muvconf.ViewAskInviteWindow",
{
	extend: qx.ui.window.Window,

	construct: function(data) {

		this.base(arguments, 'Wants to join');

		this.__data = data;
		
		this._create();
	},
	
	events: {
		'invite': 'qx.event.type.Data'
	},
	
	members: {
	
		__data: null,
		__form: null,
	
		_create: function() {

			this.set({
				showMaximize: false,
				showMinimize: false,
				allowMaximize:false,
				allowMinimize: false,
				resizable:false
			});
			this.setLayout(new qx.ui.layout.VBox(10));

			this.add(new qx.ui.basic.Label('User wants to join the conference'));
			this.add(this._createForm());
		},
		
		_createForm: function() {
			
			var uri = new qx.ui.form.TextField();
			uri.setReadOnly(true);
			uri.setValue(this.__data.uri);
			
			this.__form = new qx.ui.form.Form();

			this.__form.add(uri, 'Uri');
			this.__form.addButton(this._createButton('Ignore', this._ignoreHandler));
			this.__form.addButton(this._createButton('Invite', this._inviteHandler));

			var renderer = new qx.ui.form.renderer.Single(this.__form);
			renderer.getLayout().setColumnMinWidth(1, 200);

			return renderer;
		},
		
		_createButton: function(caption, handler) {
		
			var button = new qx.ui.form.Button(caption);
			button.addListener('execute', handler, this);

			return button;
		},
		
		_ignoreHandler: function() {
		
			this.close();
		},
		
		_inviteHandler: function() {

			this.fireDataEvent('invite', {
				uris: [ this.__data.uri ]
			});

			this.close();
		}
	}
});