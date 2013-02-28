
qx.Class.define("muvconf.SigninWindow",
{
	extend: qx.core.Object,

	construct: function() {

		this._createWindow();
	},
	
	events: {
		'signin': 'qx.event.type.Data',
		'signout': 'qx.event.type.Event'
	},
	
	members: {
	
		__form: null,
		__model: null,
		__window: null,
		
		setData: function(data) {
		
			this.__model.setUri(data.uri);
			this.__model.setPassword(data.password);
			this.__model.setProxy(data.proxy);
		},
		
		enable: function(enableSignin, enableSignout) {
		
			var items = this.__form.getValidationManager().getItems();
			for (var i = 0; i < items.length; i++)
				items[i].setEnabled(enableSignin);
			
			this.__form.getButtons()[0].setEnabled(enableSignout);
			this.__form.getButtons()[1].setEnabled(enableSignin);
		},
		
		show: function() {
		
			this.__window.show();
			this.__window.activate();
		},
		
		getWindow: function() {
		
			return this.__window;
		},
		
		_createWindow: function() {

			this.__window = new qx.ui.window.Window("Sign in");
			
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

			var uri = new qx.ui.form.TextField();
			uri.setRequired(true);
			this.__form.add(uri, "Uri");//, qx.util.Validate.email());
			
			this.__form.add(new qx.ui.form.PasswordField(), "Password");
			this.__form.add(new qx.ui.form.TextField(), "Proxy");

			this._addButton('Sign out', this._signOut);
			this._addButton('Sign in', this._signIn);

			var controller = new qx.data.controller.Form(null, this.__form);
			this.__model = controller.createModel();
			
			var renderer = new qx.ui.form.renderer.Single(this.__form);
			renderer.getLayout().setColumnMinWidth(1, 200);

			return renderer;
		},
		
		_addButton: function(caption, handler) {
		
			var button = new qx.ui.form.Button(caption);
			button.addListener('execute', handler, this);

			this.__form.addButton(button);
		},
		
		_signIn: function() {
			if (this.__form.validate()) {
				this.fireDataEvent('signin', {
					uri:      this.__model.getUri(), 
					password: this.__model.getPassword(), 
					proxy:    this.__model.getProxy()
				});
			}
		},
		
		_signOut: function() {
			this.fireEvent('signout');
		}
	}
});