
qx.Class.define("muvconf.ParticipantsCollection",
{
	extend: qx.core.Object,

	construct: function() {

		this.__array = new qx.data.Array();
	},
	
	members: {
	
		__array: null,
		__isConnectedChanged: false,
		
		getArray: function() {
			return this.__array;
		},
		
		getLength: function() {
			return this.__array.getLength();
		},

		getItem: function(uri) {

			if(typeof uri == 'number')
				return this.__array.getItem(uri);
		
			uri = this.stripUri(uri);
			
			for(var i=0; i<this.__array.getLength(); i++) {
				var participant = this.__array.getItem(i)
				if(participant.getUri() == uri)
					return participant;
			}
			
			return null;
		},
		
		hasItem: function(uri) {
		
			return (this.getItem(uri) != null);
		},
		
		addItem: function(uri, state) {
			uri = this.stripUri(uri);
			if(this.hasItem(uri) == false)
				this.__array.push(new muvconf.Participant(uri, state || muvconf.Participant.ADDED));
		},

		addItems: function(uris, state) {
			for(var i=0; i<uris.length; i++)
				this.addItem(uris[i], state);
		},
		
		removeItem: function(uri) {
			
			uri = this.stripUri(uri);
			
			var item = this.getItem(uri);
			
			if(item != null) {
				this.__array.remove(item);
				return true;
			}
		
			return false;
		},
		
		removeAllExcept: function(state) {
		
			for(var i=this.__array.getLength()-1; i>=0; i--) {
			
				if(this.__array.getItem(i).getState() != state)
					this.__array.removeAt(i);
			}
		},

		removeAll: function() {

			this.__array.removeAll();
		},

		setState: function(uri, state) {
		
			var participant = (typeof uri != 'string') ? uri : this.getItem(uri);

			if(participant != null) {

				participant.setState(state);
				if(state == muvconf.Participant.CONNECTED)
					this.__isConnectedChanged = true;
			}
		},
		
		getAndResetIsConnectedChanged: function() {
			var result = this.__isConnectedChanged;
			this.__isConnectedChanged = false;
			return result;
		},

		getAll: function(states) {

			states = states || [muvconf.Participant.CONNECTED, muvconf.Participant.LOCAL];
			
			var result = [];
			
			for(var i=0; i<this.__array.getLength(); i++) {
				var participant = this.__array.getItem(i)
				if(states.indexOf(participant.getState()) >= 0)
					result.push(participant.getUri());
			}
			
			return result;
		},

		stripUri: function(uri) {
			if(uri.indexOf('sip:') == 0)
				return uri.substr(4);
			if(uri.indexOf('sips:') == 0)
				return uri.substr(5);
			return uri;
		}
	}
});