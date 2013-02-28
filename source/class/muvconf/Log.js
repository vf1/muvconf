

qx.Class.define("muvconf.Log",
{
	extend: qx.core.Object,
	
	construct: function(textAres) {

		this.__textAres = textAres;
	},
	
	members: {
	
		__textAres: null,
	
		write: function(message) {
		
			var text = this.__textAres.getValue();
			this.__textAres.setValue(
				((text == null) ? '' : (text + '\r\n')) + message);
			this.__textAres.getContentElement().scrollToY(10000);
		}
	}
});