
qx.Class.define("muvconf.AskInviteWindow",
{
	extend: qx.ui.window.Window,

	construct: function() {

		this.base(arguments, 'Ask invite');

		this._create();
	},
	
	events: {
		'askInvite': 'qx.event.type.Data'
	},
	
	members: {
	
		__uri: null,
		__form: null,
	
		_create: function() {

			this.set({
				showClose: false,
				showMaximize: false,
				showMinimize: true,
				allowClose: false,
				allowMaximize: false,
				allowMinimize: true,
				resizable:false
			});
			this.setLayout(new qx.ui.layout.Canvas());
			this.add(this._createForm());
		},
		
		_createForm: function() {
			
			this.__uri = new qx.ui.form.TextField();
			this.__uri.setRequired(true);
			
			this.__form = new qx.ui.form.Form();
			
			this.__form.add(this.__uri, 'Uri');
			this.__form.addButton(this._createButton('Cancel', this._cancelHandler));
			this.__form.addButton(this._createButton('Ask', this._askIviteHandler));

			var renderer = new qx.ui.form.renderer.Single(this.__form);
			renderer.getLayout().setColumnMinWidth(1, 200);

			return renderer;
		},
		
		_createButton: function(caption, handler) {
		
			var button = new qx.ui.form.Button(caption);
			button.addListener('execute', handler, this);

			return button;
		},
		
		_cancelHandler: function() {
		
			this.__uri.setValue('');
			this.hide();
		},
		
		_askIviteHandler: function() {

			if (this.__form.validate()) {
				this.fireDataEvent('askInvite', {
					uri: this.__uri.getValue()
				});
			
				this.__uri.setValue('');
				this.hide();
			}
		}
	}
});