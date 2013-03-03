
qx.Class.define("muvconf.InviteWindow",
{
	extend: qx.core.Object,

	construct: function() {

		this._createWindow();
	},
	
	events: {
		'invite': 'qx.event.type.Data'
	},
	
	members: {
	
		__form: null,
		__model: null,
		__window: null,
		__uri: null,
		
		enable: function(enable) {
		
			var items = this.__form.getValidationManager().getItems();
			for (var i = 0; i < items.length; i++)
				items[i].setEnabled(enable);
			
			this.__form.getButtons()[0].setEnabled(enable);
		},
		
		show: function() {
		
			this.__window.show();
			this.__window.activate();
		},
		
		getWindow: function() {
		
			return this.__window;
		},
		
		_createWindow: function() {

			this.__window = new qx.ui.window.Window('Invite new participants', 'resource/muvconf/xadd.png');
			
			this.__window.set({
				showClose: false,
				showMaximize: false,
				allowClose: false,
				allowMaximize:false,
				resizable:false
			});
			this.__window.setLayout(new qx.ui.layout.Canvas());
			this.__window.add(this._createForm());
		},
		
		_createForm: function() {
			
			this.__form = new qx.ui.form.Form();

			this.__uri = new qx.ui.form.TextArea();
			this.__uri.setRequired(true);
			this.__form.add(this.__uri, "Uri");

			this._addButton('Invite', this._inviteHandler);

			var renderer = new qx.ui.form.renderer.Single(this.__form);
			renderer.getLayout().setColumnMinWidth(1, 200);

			return renderer;
		},
		
		_addButton: function(caption, handler) {
		
			var button = new qx.ui.form.Button(caption);
			button.addListener('execute', handler, this);

			this.__form.addButton(button);
		},
		
		_inviteHandler: function() {

			if (this.__form.validate()) {
				this.fireDataEvent('invite', {
					uris: this._prepareData(this.__uri.getValue())
				});
			
				this.__uri.setValue('');
				this.__window.hide();
			}
		},
		
		_prepareData: function(text) {

			var result = [];
			
			var items = text.split(/[\n\s,;]/);
			
			for(var i=0; i<items.length; i++) {
				if(items[i].length > 0)
					result.push(items[i]);
			}
			
			return result;
		}
	}
});