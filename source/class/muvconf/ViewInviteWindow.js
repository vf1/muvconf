
qx.Class.define("muvconf.ViewInviteWindow",
{
	extend: qx.ui.window.Window,

	construct: function(data) {

		this.base(arguments, 'You got invite');

		this.__data = data;
		
		this._create();
	},
	
	events: {
		'accept': 'qx.event.type.Data'
	},
	
	members: {
	
		__data: null,
	
		_create: function() {

			this.set({
				showMaximize: false,
				showMinimize: false,
				allowMaximize:false,
				allowMinimize: false,
				resizable:false
			});
			this.setLayout(new qx.ui.layout.Canvas());
			this.add(this._createForm());
		},
		
		_createForm: function() {
			
			var form = new qx.ui.form.Form();

			var uri = new qx.ui.form.TextField();
			uri.setReadOnly(true);
			uri.setValue(this.__data.uri);
			
			var participants = new qx.ui.form.List();
			for (var i=0; i<this.__data.participants.length; i++)
				participants.add(new qx.ui.form.ListItem(this.__data.participants[i]))

			form.add(uri, 'From');
			form.add(participants, 'Participants');
			form.addButton(this._createButton('Ignore', this._ignoreHandler));
			form.addButton(this._createButton('Accept', this._acceptHandler));

			var renderer = new qx.ui.form.renderer.Single(form);
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
		
		_acceptHandler: function() {

			this.close();
			
			this.fireDataEvent('accept', this.__data);
		}
	}
});