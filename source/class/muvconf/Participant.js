
qx.Class.define("muvconf.Participant",
{
	extend: qx.core.Object,

	construct: function(uri, state) {

		this.setUri(uri);
		this.setState(state);
		
		this.addListener('changeState', this._stateChanged, this);
	},

	properties: {
		uri: {
			check: "String"
		},
		state: {
			event: "changeState",
			check: "Integer"
		}
	},
	
	members: {
	
		__priority: 256,
		__failedCount: 0,
		__restoreCount: 0,
		
		hasDivergence: false,
		
		getPriority: function() {
		
			return this.__priority;
		},
		
		getStateText: function() {
		
			switch(this.getState()) {
				case 5: return 'Added';
				case 6: return 'Call';
				case 7: return 'Ok';
				case 8: return 'Failed (' + this.__failedCount + ')';
				case 9: return 'Local';
				case 10: return 'Ended';
				case 11: return 'Critical Error';
			}
			return 'Unknow';
		},
		
		decRestoreCount: function() {
			
			return (++this.__restoreCount == 10);
		},
		
		_stateChanged: function(e) {
		
			var newState = e.getData();


			if(newState != this.self(arguments).CONNECTED)
				this.hasDivergence = false;
			

			if(newState == this.self(arguments).CONNECTING)
				this.__priority = Math.round(Math.random() * 255);
			else
				this.__priority = 256;


			if(newState == this.self(arguments).FAILED) {
				this.__failedCount += 1;
				if(this.__failedCount >= 20)
					this.setState(this.self(arguments).CRITICALERROR);
			}
			else {
				this.__restoreCount = 0;
				
				if(newState == this.self(arguments).CONNECTED)
					this.__failedCount = 0;
			}
		}
	},

	statics : {
	
		ADDED         : 5,
		CONNECTING    : 6,
		CONNECTED     : 7,
		FAILED        : 8,
		LOCAL         : 9,
		ENDED         : 10,
		CRITICALERROR : 11
	}
});