

qx.Mixin.define("muvconf.MTools",
{
	members: {
	
		proxy: function(func) {
			var that = this;
			return function(a1, a2, a3, a4) { func.call(that, a1, a2, a3, a4); };
		},
	
		JsonParse: function(text) {

			var data = null;
			
			try { data = JSON.parse(text); }
			catch(ex) { }
			
			return data;
		},

		generateRandomString: function(length) {
		
			var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
		
			var result = '';
			for (var i = length; i > 0; --i)
				result += chars[Math.round(Math.random() * (chars.length - 1))];

			return result;
		}
	}
});