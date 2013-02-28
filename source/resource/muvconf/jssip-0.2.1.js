/*global console: false*/

/**
 * @name JsSIP
 * @namespace
 */
(function(window) {
var JsSIP = (function() {
  "use strict";
  var
    productName = 'JsSIP',
    productVersion = '0.2.1';

  return {
    name: function() {
      return productName;
    },
    version: function() {
      return productVersion;
    }
  };
}());


/**
* @fileoverview JsSIP EventEmitter
*/

/**
 * @augments JsSIP
 * @class Class creating an event emitter.
 */

JsSIP.EventEmitter = function(){};

JsSIP.EventEmitter.prototype = {
  /**
   * Initialice events dictionary.
   * @param {Array} events
   */
  initEvents: function(events) {
    var i = events.length;

    this.events = {};
    this.onceNotFired = []; // Array containing events with _once_ defined tat didn't fire yet.
    this.maxListeners = 10;
    this.events.newListener = function(event) { // Default newListener callback
      console.log(JsSIP.c.LOG_EVENT_EMITTER +'new Listener added to event: '+ event);
    };

    while (i--) {
      console.log(JsSIP.c.LOG_EVENT_EMITTER +'Adding event: '+ events[i]);
      this.events[events[i]] = [];
    }
  },

  /**
  * Check whether an event exists or not.
  * @param {String} event
  * @returns {Boolean}
  */
  checkEvent: function(event) {
    if (!this.events[event]) {
      console.log(JsSIP.c.LOG_EVENT_EMITTER +'No event named: '+ event);
      return false;
    } else {
      return true;
    }
  },

  /**
  * Add a listener to the end of the listeners array for the specified event.
  * @param {String} event
  * @param {Function} listener
  */
  addListener: function(event, listener) {
    if (!this.checkEvent(event)) {
      return;
    }

    if (this.events[event].length >= this.maxListeners) {
      console.log(JsSIP.c.LOG_EVENT_EMITTER +'Max Listeners exceeded for event: '+ event);
    }

    this.events[event].push(listener);
    this.events.newListener.call(null, event);
  },

  on: function(event, listener) {
    this.addListener(event, listener);
  },

  /**
  * Add a one time listener for the event.
  * The listener is invoked only the first time the event is fired, after which it is removed.
  * @param {String} event
  * @param {Function} listener
  */
  once: function(event, listener) {
    this.events[event].unshift(listener);
    this.onceNotFired.push(event);
  },

  /**
  * Remove a listener from the listener array for the specified event.
  * Caution: changes array indices in the listener array behind the listener.
  * @param {String} event
  * @param {Function} listener
  */
  removeListener: function(event, listener) {
    if (!this.checkEvent(event)) {
      return;
    }

    var array = this.events[event], i = 0, length = array.length;

    while ( i < length ) {
      if (array[i] && array[i].toString() === listener.toString()) {
        array.splice(i, 1);
      } else {
        i++;
      }
    }
  },

  /**
  * Remove all listeners from the listener array for the specified event.
  * @param {String} event
  */
  removeAllListener: function(event) {
    if (!this.checkEvent(event)) {
      return;
    }

    this.events[event] = [];
  },

  /**
  * By default JsSIP.EventEmitter will print a warning if more than 10 listeners are added for a particular event. This function allows that limit to be modified.
  * @param {Number} listeners
  */
  setMaxListeners: function(listeners) {
    if (Number(listeners)) {
      this.maxListeners = listeners;
    }
  },

  /**
  * Get the listeners for a specific event.
  * @param {String} event
  * @returns {Array}  Array of listeners for the specified event.
  */
  listeners: function(event) {
    return this.events[event];
  },

  /**
  * Execute each of the listeners in order with the supplied arguments.
  * @param {String} events
  * @param {Array} args
  */
  emit: function(event, sender, data) {
    var listeners, length,
      idx=0;

    if (!this.checkEvent(event)) {
      return;
    }

    console.log(JsSIP.c.LOG_EVENT_EMITTER +'Emitting event: '+event);

    listeners = this.events[event];
    length = listeners.length;

    var e = new JsSIP.Event(event, sender, data);

    if (e) {
      for (idx; idx<length; idx++) {
        listeners[idx].apply(null, [e]);
      }
    } else {
      for (idx; idx<length; idx++) {
        listeners[idx].call();
      }
    }

    // Check whether _once_ was defined for the event
    idx = this.onceNotFired.indexOf(event);

    if (idx !== -1) {
      this.onceNotFired.splice(idx,1);
      this.events[event].shift();
    }
  },

  /**
  * This function is executed anytime a new listener is added to EventEmitter instance.
  * @param {Function} listener
  */
  newListener: function(listener) {
    this.events.newListener = listener;
  }
};

JsSIP.Event = function(type, sender, data) {
  this.type = type;
  this.sender= sender;
  this.data = data;
};


/**
 * @fileoverview JsSIP Constants
 */

/**
 * JsSIP Constants.
 * @augments JsSIP
 */

JsSIP.c = {
  USER_AGENT: JsSIP.name() +' '+ JsSIP.version(),

  // Modules and Classes names for logging purposes
  // Modules
  LOG_PARSER:                 JsSIP.name() +' | '+ 'PARSER' +' | ',
  LOG_DIGEST_AUTHENTICATION:  JsSIP.name() +' | '+ 'DIGEST AUTHENTICATION' +' | ',
  LOG_SANITY_CHECK:           JsSIP.name() +' | '+ 'SANITY CHECK' +' | ',
  LOG_UTILS:                  JsSIP.name() +' | '+ 'UTILS' +' | ',

  // Classes
  LOG_TRANSPORT:              JsSIP.name() +' | '+ 'TRANSPORT' +' | ',
  LOG_TRANSACTION:            JsSIP.name() +' | '+ 'TRANSACTION' +' | ',
  LOG_DIALOG:                 JsSIP.name() +' | '+ 'DIALOG' +' | ',
  LOG_UA:                     JsSIP.name() +' | '+ 'UA' +' | ',
  LOG_INVITE_SESSION:         JsSIP.name() +' | '+ 'INVITE SESSION' +' | ',
  LOG_CLIENT_INVITE_SESSION:  JsSIP.name() +' | '+ 'CLIENT INVITE SESSION' +' | ',
  LOG_SERVER_INVITE_SESSION:  JsSIP.name() +' | '+ 'SERVER INVITE SESSION' +' | ',
  LOG_EVENT_EMITTER:          JsSIP.name() +' | '+ 'EVENT EMITTER' +' | ',
  LOG_MEDIA_SESSION:          JsSIP.name() +' | '+ 'MEDIA SESSION' +' | ',
  LOG_MESSAGE:                JsSIP.name() +' | '+ 'MESSAGE' +' | ',
  LOG_MESSAGE_RECEIVER:       JsSIP.name() +' | '+ 'MESSAGE_RECEIVER' +' | ',
  LOG_MESSAGE_SENDER:         JsSIP.name() +' | '+ 'MESSAGE_SENDER' +' | ',
  LOG_REGISTRATOR:            JsSIP.name() +' | '+ 'REGISTRATOR' +' | ',
  LOG_REQUEST_SENDER:         JsSIP.name() +' | '+ 'REQUEST SENDER' +' | ',
  LOG_SUBSCRIBER:             JsSIP.name() +' | '+ 'SUBSCRIBER' +' | ',
  LOG_PRESENCE:               JsSIP.name() +' | '+ 'PRESENCE' +' | ',
  LOG_MESSAGE_SUMMARY:        JsSIP.name() +' | '+ 'MESSAGE_SUMMARY' +' | ',


  // Transaction states
  TRANSACTION_TRYING:     1,
  TRANSACTION_PROCEEDING: 2,
  TRANSACTION_CALLING:    3,
  TRANSACTION_ACCEPTED:   4,
  TRANSACTION_COMPLETED:  5,
  TRANSACTION_TERMINATED: 6,
  TRANSACTION_CONFIRMED:  7,

  // Dialog states
  DIALOG_EARLY:       1,
  DIALOG_CONFIRMED:   2,

  // Invite Session states
  SESSION_NULL:               0,
  SESSION_INVITE_SENT:        1,
  SESSION_1XX_RECEIVED:       2,
  SESSION_INVITE_RECEIVED:    3,
  SESSION_WAITING_FOR_ANSWER: 4,
  SESSION_WAITING_FOR_ACK:    5,
  SESSION_CANCELED:           6,
  SESSION_TERMINATED:         7,
  SESSION_CONFIRMED:          8,

  // Global error codes
  CONNECTION_ERROR:        1,
  REQUEST_TIMEOUT:        2,

  // Invite session end causes
  causes: {
    BYE:                      'Terminated',
    CANCELED:                 'Canceled',
    NO_ANSWER:                'No Answer',
    EXPIRES:                  'Expires',
    CONNECTION_ERROR:         'Connection Error',
    REQUEST_TIMEOUT:          'Request Timeout',
    NO_ACK:                   'No ACK',
    USER_DENIED_MEDIA_ACCESS: 'User Denied Media Access',
    BAD_MEDIA_DESCRIPTION:    'Bad Media Description',
    IN_DIALOG_408_OR_481:     'In-dialog 408 or 481',
    SIP_FAILURE_CODE:         'SIP Failure Code',

    // SIP ERROR CAUSES
    BUSY:                     'Busy',
    REJECTED:                 'Rejected',
    REDIRECTED:               'Redirected',
    UNAVAILABLE:              'Unavailable',
    NOT_FOUND:                'Not Found',
    ADDRESS_INCOMPLETE:       'Address Incomplete',
    INCOMPATIBLE_SDP:         'Incompatible SDP',
    AUTHENTICATION_ERROR:     'Authentication Error'
  },

  SIP_ERROR_CAUSES: {
    REDIRECTED: [300,301,302,305,380],
    BUSY: [486,600],
    REJECTED: [403,603],
    NOT_FOUND: [404,604],
    UNAVAILABLE: [480,410,408,430],
    ADDRESS_INCOMPLETE: [484],
    INCOMPATIBLE_SDP: [488,606],
    AUTHENTICATION_ERROR:[401,407]
  },

  // UA status codes
  UA_STATUS_INIT :                0,
  UA_STATUS_READY:                1,
  UA_STATUS_USER_CLOSED:          2,
  UA_STATUS_NOT_READY:            3,

  // UA error codes
  UA_CONFIGURATION_ERROR:  1,
  UA_NETWORK_ERROR:        2,

  // WS server status codes
  WS_SERVER_READY:        0,
  WS_SERVER_DISCONNECTED: 1,
  WS_SERVER_ERROR:        2,

  // SIP Methods
  ACK:        'ACK',
  BYE:        'BYE',
  CANCEL:     'CANCEL',
  INFO:       'INFO',
  INVITE:     'INVITE',
  MESSAGE:    'MESSAGE',
  NOTIFY:     'NOTIFY',
  OPTIONS:    'OPTIONS',
  REGISTER:   'REGISTER',
  UPDATE:     'UPDATE',
  SUBSCRIBE:  'SUBSCRIBE',

  // SIP Response Reasons

  // Provisional
  REASON_100: 'Trying',
  REASON_180: 'Ringing',
  REASON_181: 'Call Is Being Forwarded',
  REASON_182: 'Queued',
  REASON_183: 'Session Progress',

  // Successful
  REASON_200: 'OK',

  // Redirection
  REASON_300: 'Multiple Choices',
  REASON_301: 'Moved Permanently',
  REASON_302: 'Moved Temporarily',
  REASON_305: 'Use Proxy',
  REASON_380: 'Alternative Service',

  // Request Failure
  REASON_400: 'Bad Request',
  REASON_401: 'Unauthorized',
  REASON_402: 'Payment Required',
  REASON_403: 'Forbidden',
  REASON_404: 'Not Found',
  REASON_405: 'Method Not Allowed',
  REASON_406: 'Not Acceptable',
  REASON_407: 'Proxy Authentication Required ',
  REASON_408: 'Request Timeout',
  REASON_410: 'Gone',
  REASON_413: 'Request Entity Too Large',
  REASON_414: 'Request-URI Too Long',
  REASON_415: 'Unsupported Media Type',
  REASON_416: 'Unsupported URI Scheme',
  REASON_420: 'Bad Extension',
  REASON_421: 'Extension Required',
  REASON_423: 'Interval Too Brief',
  REASON_480: 'Temporarily Unavailable',
  REASON_481: 'Call/Transaction Does Not Exist',
  REASON_482: 'Loop Detected',
  REASON_483: 'Too Many Hops',
  REASON_484: 'Address Incomplete',
  REASON_485: 'Ambiguous',
  REASON_486: 'Busy Here',
  REASON_487: 'Request Terminated',
  REASON_488: 'Not Acceptable Here',
  REASON_491: 'Request Pending ',
  REASON_493: 'Undecipherable',

  // Server Failure
  REASON_500: 'Server Internal Error',
  REASON_501: 'Not Implemented',
  REASON_502: 'Bad Gateway',
  REASON_503: 'Service Unavailable',
  REASON_504: 'Server Time-out',
  REASON_505: 'Version Not Supported',
  REASON_513: 'Message Too Large',

  // Global Failure
  REASON_600: 'Busy Everywhere',
  REASON_603: 'Decline',
  REASON_604: 'Does Not Exist Anywhere',

  // SIP Attributes
  MAX_FORWARDS: 69,
  ALLOWED_METHODS: 'INVITE, ACK, CANCEL, BYE, OPTIONS, MESSAGE, SUBSCRIBE',
  SUPPORTED: 'path, outbound, gruu',
  ACCEPTED_BODY_TYPES: 'application/sdp',
  TAG_LENGTH: 10
};


/**
 * @fileoverview JsSIP exceptions
 */

/**
 * JsSIP Exceptions.
 * @augments JsSIP
 */

JsSIP.exceptions = {
  ConfigurationError: (function(){
    var exception = function() {
      this.code = 1;
      this.name = 'CONFIGURATION_ERROR';
      this.message = this.name +': JsSIP Exception '+ this.code;
    };
    exception.prototype = new Error();
    return exception;
  }()),

  NotReadyError: (function(){
    var exception = function() {
      this.code = 2;
      this.name = 'NOT_READY_ERROR';
      this.message = this.name +': JsSIP Exception '+ this.code;
    };
    exception.prototype = new Error();
    return exception;
  }()),

  InvalidTargetError: (function(){
    var exception = function() {
      this.code = 3;
      this.name = 'INVALID_TARGET_ERROR';
      this.message = this.name +': JsSIP Exception '+ this.code;
    };
    exception.prototype = new Error();
    return exception;
  }()),

  WebRtcNotSupportedError: (function(){
    var exception = function(){
      this.code = 4;
      this.name = 'WEBRTC_NO_SUPPORTED_ERROR';
      this.message = this.name +': JsSIP Exception '+ this.code;
    };
    exception.prototype = new Error();
    return exception;
  }()),

  InvalidStateError: (function(){
    var exception = function() {
      this.code = 5;
      this.name = 'INVALID_STATE_ERROR';
      this.message = this.name +': JsSIP Exception '+ this.code;
    };
    exception.prototype = new Error();
    return exception;
  }())
};

/**
 * SIP Timers.
 * @augments JsSIP
 */
JsSIP.Timers = (function() {
  var
    T1 = 500,
    T2 = 4000,
    T4 = 5000;

  return {
    T1: T1,
    T2: T2,
    T4: T4,
    TIMER_B: 64 * T1,
    TIMER_D: 0  * T1,
    TIMER_F: 64 * T1,
    TIMER_H: 64 * T1,
    TIMER_I: 0  * T1,
    TIMER_J: 0  * T1,
    TIMER_K: 0  * T4,
    TIMER_L: 64 * T1,
    TIMER_M: 64 * T1
  };
}());

/*global WebSocket: false*/

/**
 * @fileoverview Transport
 */

/**
 * @augments JsSIP
 * @class Transport
 * @param {JsSIP.UA} ua
 * @param {Object} server outbound_proxy_set Object
 */

JsSIP.Transport = function(ua, server) {
  this.ua = ua;
  this.ws = null;
  this.server = server;
  this.reconnection_attempts = 0;
  this.closed = false;
  this.connected = false;
  this.reconnectTimer = null;

  this.ua.transport = this;

  // Connect
  this.connect();
};

JsSIP.Transport.prototype = {
  /**
   * Send a message.
   * @param {JsSIP.OutgoingRequest|String} msg
   * @returns {Boolean}
   */
  send: function(msg) {
    var message = msg.toString();

    if(this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (this.ua.configuration.trace_sip === true) {
        console.info(JsSIP.c.LOG_TRANSPORT +'Sending WebSocket message: \n\n' + message + '\n');
      }
      this.ws.send(message);
      return true;
    } else {
      console.info(JsSIP.c.LOG_TRANSPORT +'Unable to send message. WebSocket is not open\n\n');
      return false;
    }
  },

  /**
  * Disconnect socket.
  */
  disconnect: function() {
    if(this.ws) {
      this.closed = true;
      console.log(JsSIP.c.LOG_TRANSPORT +'closing WebSocket connection ' + this.server.ws_uri);
      this.ws.close();
    }
  },

  /**
  * Connect socket.
  */
  connect: function() {
    var transport = this;

    if(this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      console.log(JsSIP.c.LOG_TRANSPORT +'WebSocket ' + this.server.ws_uri + ' is already connected');
      return false;
    }

    if(this.ws) {
      this.ws.close();
    }

    console.log(JsSIP.c.LOG_TRANSPORT +'Connecting to WebSocket URI ' + this.server.ws_uri);

    try {
      this.ws = new WebSocket(this.server.ws_uri, 'sip');
    } catch(e) {
      console.log(JsSIP.c.LOG_TRANSPORT +'Error connecting to ' + this.server.ws_uri + ': ' + e);
    }

    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = function(e) {
      transport.onOpen(e);
    };

    this.ws.onclose = function(e) {
      transport.onClose(e);
    };

    this.ws.onmessage = function(e) {
      transport.onMessage(e);
    };

    this.ws.onerror = function(e) {
      transport.onError(e);
    };
  },

  // Transport Event Handlers

  /**
  * @event
  * @param {event} e
  */
  onOpen: function(e) {
    this.connected = true;

    console.log(JsSIP.c.LOG_TRANSPORT +'WebSocket connected: ' + this.server.ws_uri);
    // Clear reconnectTimer since we are not disconnected
    window.clearTimeout(this.reconnectTimer);
    // Disable closed
    this.closed = false;
    // Trigger onTransportConnected callback
    this.ua.onTransportConnected(this);
  },

  /**
  * @event
  * @param {event} e
  */
  onClose: function(e) {
    var connected_before = this.connected;

    this.connected = false;
    console.warn(JsSIP.c.LOG_TRANSPORT +'WebSocket disconnected: code=' + e.code + (e.reason? ', reason=' + e.reason : ''));

    if(e.wasClean === false) {
      console.log(JsSIP.c.LOG_TRANSPORT +'ERROR: abrupt disconnection');
    }
    // Transport was connected
    if(connected_before === true) {
      this.ua.onTransportClosed(this);
      // Check whether the user requested to close.
      if(!this.closed) {
        // Reset reconnection_attempts
        this.reconnection_attempts = 0;
        this.reConnect();
      }
    } else {
      // This is the first connection attempt
      //Network error
      this.ua.onTransportError(this);
    }
  },

  /**
  * @event
  * @param {event} e
  */
  onMessage: function(e) {
    var message, transaction,
      data = e.data;

    // CRLF Keep Alive response from server. Ignore it.
    if(data === '\r\n') {
      if (this.ua.configuration.trace_sip === true) {
        console.info(JsSIP.c.LOG_TRANSPORT +'Received WebSocket message with CRLF Keep Alive response');
      }
      return;
    }

    // WebSocket binary message.
    else if (typeof data !== 'string') {
      try {
        data = String.fromCharCode.apply(null, new Uint8Array(e.data));
      } catch(e) {
        console.warn(JsSIP.c.LOG_TRANSPORT +'Received WebSocket binary message failed to be converted into String, message ignored');
        return;
      }

      if (this.ua.configuration.trace_sip === true) {
        console.info(JsSIP.c.LOG_TRANSPORT +'Received WebSocket binary message: \n\n' + data + '\n');
      }
    }

    // WebSocket text message.
    else {
      if (this.ua.configuration.trace_sip === true) {
        console.info(JsSIP.c.LOG_TRANSPORT +'Received WebSocket text message: \n\n' + data + '\n');
      }
    }

    message = JsSIP.Parser.parseMessage(data);

    if(this.ua.status === JsSIP.c.UA_STATUS_USER_CLOSED && message instanceof JsSIP.IncomingRequest) {
      return;
    }

    // Do some sanity check
    if(message && JsSIP.sanityCheck(message, this.ua, this)) {
      if(message instanceof JsSIP.IncomingRequest) {
        message.transport = this;
        this.ua.receiveRequest(message);
      } else if(message instanceof JsSIP.IncomingResponse) {
        /* Unike stated in 18.1.2, if a response does not match
        * any transaction, it is discarded here and no passed to the core
        * in order to be discarded there.
        */
        switch(message.method) {
          case JsSIP.c.INVITE:
            transaction = this.ua.transactions.ict[message.via_branch];
            if(transaction) {
              transaction.receiveResponse(message);
            }
            break;
          case JsSIP.c.ACK:
            // Just in case ;-)
            break;
          default:
            transaction = this.ua.transactions.nict[message.via_branch];
            if(transaction) {
              transaction.receiveResponse(message);
            }
            break;
        }
      }
    }
  },

  /**
  * @event
  * @param {event} e
  */
  onError: function(e) {
    console.log(JsSIP.c.LOG_TRANSPORT +'WebSocket connection error');
  },

  /**
  * Reconnection attempt logic.
  * @private
  */
  reConnect: function() {
    var transport = this;

    this.reconnection_attempts += 1;

    if(this.reconnection_attempts > this.ua.configuration.max_reconnection) {
      console.log(JsSIP.c.LOG_TRANSPORT +'Maximum reconnection attempts for: ' + this.server.ws_uri);
      this.ua.onTransportError(this);
    } else {
      console.log(JsSIP.c.LOG_TRANSPORT +'Trying to reconnect to: ' + this.server.ws_uri + '. Reconnection attempt number ' + this.reconnection_attempts);

      this.reconnectTimer = window.setTimeout(function() {
        transport.reConnect();}, this.ua.configuration.reconnection_timeout * 1000);

      this.connect();
    }
  }
};

/**
 * @fileoverview Parser
 */

/**
 * Extract and parse every header of a SIP message.
 * @augments JsSIP
 * @namespace
 */
JsSIP.Parser = (function() {

  /** @private */
  function getHeader(msg, header_start) {
    var

      // 'start' position of the header.
      start = header_start,

      // 'end' position of the header.
      end = 0,

      // 'partial end' of the header -char position-.
      pend = 0;

    //End of message.
    if(msg.substring(start, start + 2).match(/(^\r\n)/)) {
      return -2;
    }

    while(end === 0) {
      // Partial End of Header.
      pend = msg.indexOf('\r\n', start);
      // 'indexOf' returns -1 if the value to be found never occurs.
      if(!msg.substring(pend + 2, pend + 4).match(/(^\r\n)/) && msg.charAt(pend + 2).match(/(^\s+)/)) {
        // continue from the next position.
        start = pend + 2;
      } else {
        end = pend;
      }
    }

    return end;
  }

  /** @private */
  function parseHeader(message, msg, header_start, header_end) {
    var header, length, idx, parsed,
      hcolonIndex = msg.indexOf(':', header_start),
      header_name = msg.substring(header_start, hcolonIndex).replace(/\s+/, ''),
      header_value = msg.substring(hcolonIndex + 1, header_end);

      // Delete all spaces before and after the body.
      header_value = header_value.replace(/^\s+/g, '').replace(/\s+$/g, '');

    // If header-field is well-known, parse it.
    switch(header_name.toLowerCase()) {
      case 'via':
      case 'v':
        message.addHeader('via', header_value);
        if(message.countHeader('via') === 1) {
          parsed = message.parseHeader('Via');
          if(parsed) {
            message.via = parsed;
            message.via_branch = parsed.branch;
          }
        } else {
          parsed = 0;
        }
        break;
      case 'from':
      case 'f':
        message.setHeader('from', header_value);
        parsed = message.parseHeader('from');
        if(parsed) {
          message.from = header_value;
          message.from_tag = parsed.tag;
        }
        break;
      case 'to':
      case 't':
        message.setHeader('to', header_value);
        parsed = message.parseHeader('to');
        if(parsed) {
          message.to = header_value;
          message.to_tag = parsed.tag;
        }
        break;
      case 'record-route':
        header = header_value.match(/([^\"\',]*((\'[^\']*\')*||(\"[^\"]*\")*))+/gm);
        length = header.length;
        parsed = 0;

        for(idx=0; idx < length; idx++) {
          if (header[idx].length > 0) {
            message.addHeader('record-route', header[idx]);
          }
        }
        break;
      case 'call-id':
      case 'i':
        message.setHeader('call-id', header_value);
        parsed = message.parseHeader('call-id');
        if(parsed) {
          message.call_id = header_value;
        }
        break;
      case 'contact':
      case 'm':
        header = header_value.match(/([^\"\',]*((\'[^\']*\')*||(\"[^\"]*\")*))+/gm);
        length = header.length;

        for(idx=0; idx < length; idx++) {
          if (header[idx].length > 0) {
            message.addHeader('contact', header[idx]);
            parsed = message.parseHeader('contact', idx);
            if (parsed === undefined) {
              break;
            }
          }
        }
        break;
      case 'content-length':
      case 'l':
        message.setHeader('content-length', header_value);
        parsed = message.parseHeader('content-length');
        break;
      case 'content-type':
      case 'c':
        message.setHeader('content-type', header_value);
        parsed = message.parseHeader('content-type');
        break;
      case 'cseq':
        message.setHeader('cseq', header_value);
        parsed = message.parseHeader('cseq');
        if(parsed) {
          message.cseq = parsed.value;
        }
        if(message instanceof JsSIP.IncomingResponse) {
          message.method = parsed.method;
        }
        break;
      case 'max-forwards':
        message.setHeader('max-forwards', header_value);
        parsed = message.parseHeader('max-forwards');
        break;
      case 'www-authenticate':
        message.setHeader('www-authenticate', header_value);
        parsed = message.parseHeader('www-authenticate');
        break;
      case 'proxy-authenticate':
        message.setHeader('proxy-authenticate', header_value);
        parsed = message.parseHeader('proxy-authenticate');
        break;
      default:
        // This is not a well known header. Do not parse it.
        message.setHeader(header_name, header_value);
        parsed = 0;
    }

    if (parsed === undefined) {
      return {
        'header_name': header_name,
        'header_value': header_value
      };
    }
  }

  /** @private */
  function parseMessage(data) {
    var message, firstLine, contentLength, body_start, parsed,
      header_start = 0,
      header_end = data.indexOf('\r\n');

    if(header_end === -1) {
      console.log(JsSIP.c.LOG_PARSER +'No CRLF found. Not a SIP message.');
    }

    // Parse first line. Check if it is a Request or a Reply.
    firstLine = data.substring(0, header_end);
    parsed = JsSIP.grammar.parse(firstLine, 'Request_Response');

    if(parsed === -1) {
      console.log(JsSIP.c.LOG_PARSER +'Error parsing first line of SIP message: "' + firstLine + '"');
      return;
    } else if(!parsed.status_code) {
      message = new JsSIP.IncomingRequest();
      message.method = parsed.method;
      message.ruri = parsed;
    } else {
      message = new JsSIP.IncomingResponse();
      message.status_code = parsed.status_code;
      message.reason_phrase = parsed.reason_phrase;
    }

    message.data = data;
    header_start = header_end + 2;

    /* Loop over every line in msg. Detect the end of each header and parse
    * it or simply add to the headers collection.
    */
    while(true) {
      header_end = getHeader(data, header_start);

      // The SIP message has normally finished.
      if(header_end === -2) {
        body_start = header_start + 2;
        break;
      }
      // msg.indexOf returned -1 due to a malformed message.
      else if(header_end === -1) {
        return;
      }

      parsed = parseHeader(message, data, header_start, header_end);

      if(parsed) {
        console.log(JsSIP.c.LOG_PARSER +'Error parsing "' + parsed.header_name + '" header field with value: "' + parsed.header_value + '"');
        return;
      }

      header_start = header_end + 2;
    }

    /* RFC3261 18.3.
     * If there are additional bytes in the transport packet
     * beyond the end of the body, they MUST be discarded.
     */
    if(message.hasHeader('content-length')) {
      contentLength = message.getHeader('content-length');
      message.body = data.substr(body_start, contentLength);
    } else {
      message.body = data.substring(body_start);
    }

    return message;
 }

 return {
   /** Parse SIP Message
    * @function
    * @param {String} message SIP message.
    * @returns {JsSIP.IncomingRequest|JsSIP.IncomingResponse|undefined}
    */
   parseMessage: parseMessage
 };
}());

/**
 * @fileoverview SIP User Agent
 */

/**
 * @augments JsSIP
 * @class Class for outgoing SIP request.
 * @param {String} method request method
 * @param {String} ruri request uri
 * @param {JsSIP.UA} ua
 * @param {Object} params parameters that will have priority over ua.configuration parameters:
 * <br>
 *  - cseq, call_id, from_tag, from_uri, from_display_name, to_uri, to_tag, route_set
 * @param {Object} [headers] extra headers
 * @param {String} [body]
 */
JsSIP.OutgoingRequest = function(method, ruri, ua, params, extraHeaders, body) {
  var
    to_display_name,
    to_uri,
    to_tag,
    to,
    from_display_name,
    from_uri,
    from_tag,
    from,
    call_id,
    cseq,
    header;

  params = params || {};

  // Mandatory parameters check
  if(!method || !ruri || !ua) {
    return null;
  }

  this.headers = {};
  this.method = method;
  this.ruri = ruri;
  this.body = body;
  this.extraHeaders = extraHeaders || [];

  // Fill the Common SIP Request Headers

  //ROUTE
  if (params.route_set) {
    this.setHeader('route', params.route_set);
  } else {
    this.setHeader('route', ua.transport.server.sip_uri);
  }

  // VIA
  // Empty Via header. Will be filled by the client transaction
  this.setHeader('via', '');

  //MAX-FORWARDS
  this.setHeader('max-forwards', JsSIP.c.MAX_FORWARDS);

  //TO
  to_display_name = params.to_display_name ? '"' + params.to_display_name + '" ' : '';
  to_uri = params.to_uri || ruri;
  to_tag = params.to_tag ? ';tag=' + params.to_tag : '';
  to = to_display_name ? '<' + to_uri + '>' : to_uri;
  to += to_tag;
  this.setHeader('to', to);

  //FROM
  from_display_name = params.from_display_name || ua.configuration.display_name || '';
  from_uri = params.from_uri || ua.configuration.from_uri;
  from_tag = params.from_tag || JsSIP.utils.newTag();
  from = from_display_name ? '"' + from_display_name + '" ' : '';
  from += from_display_name ? '<' + from_uri + '>' : from_uri;
  from += ';tag=' + from_tag;
  this.setHeader('from', from);

  //CALL-ID
  if(params.call_id) {
    call_id = params.call_id;
  } else {
    call_id = ua.configuration.jssip_id + Math.random().toString(36).substr(2, 15);
  }
  this.setHeader('call-id', call_id);

  //CSEQ
  cseq = params.cseq || Math.floor(Math.random() * 10000);
  cseq = cseq + ' ' + method;
  this.setHeader('cseq', cseq);
};

JsSIP.OutgoingRequest.prototype = {
  /**
   * Replace the the given header by the given value.
   * @param {String} name header name
   * @param {String | Array} value header value
   */
  setHeader: function(name, value) {
    this.headers[JsSIP.utils.headerize(name)] = (value instanceof Array) ? value : [value];
  },
  toString: function() {
    var msg = '', header, length, idx;

    msg += this.method + ' ' + this.ruri + ' SIP/2.0\r\n';

    for(header in this.headers) {
      for(idx in this.headers[header]) {
        msg += header + ': ' + this.headers[header][idx] + '\r\n';
      }
    }

    length = this.extraHeaders.length;
    for(idx=0; idx < length; idx++) {
      msg += this.extraHeaders[idx] +'\r\n';
    }

    msg += 'Supported: ' +  JsSIP.c.SUPPORTED +'\r\n';
    msg += 'User-Agent: ' + JsSIP.c.USER_AGENT +'\r\n';

    if(this.body) {
      length = JsSIP.utils.str_utf8_length(this.body);
      msg += 'Content-Length: ' + length + '\r\n\r\n';
      msg += this.body;
    } else {
      msg += 'Content-Length: ' + 0 + '\r\n\r\n';
    }

    return msg;
  }
};

/**
 * @augments JsSIP
 * @class Class for incoming SIP message.
 */
JsSIP.IncomingMessage = function(){
  this.data = null;
  this.headers = null;
  this.method =  null;
  this.via = null;
  this.via_branch = null;
  this.call_id = null;
  this.cseq = null;
  this.from = null;
  this.from_tag = null;
  this.to = null;
  this.to_tag = null;
  this.body = null;
};

JsSIP.IncomingMessage.prototype = {
  /**
  * Insert a header of the given name and value into the last position of the
  * header array.
  * @param {String} name header name
  * @param {String} value header value
  */
  addHeader: function(name, value) {
    var header = { raw: value };

    name = JsSIP.utils.headerize(name);

    if(this.headers[name]) {
      this.headers[name].push(header);
    } else {
      this.headers[name] = [header];
    }
  },

  /**
   * Count the number of headers of the given header name.
   * @param {String} name header name
   * @returns {Number} Number of headers with the given name
   */
  countHeader: function(name) {
    var header = this.headers[JsSIP.utils.headerize(name)];

    if(header) {
      return header.length;
    } else {
      return 0;
    }
  },

  /**
   * Get the value of the given header name at the given position.
   * @param {String} name header name
   * @param {Number} [idx=0] header index
   * @returns {String|undefined} Returns the specified header, null if header doesn't exist.
   */
  getHeader: function(name, idx) {
    var header = this.headers[JsSIP.utils.headerize(name)];

    idx = idx || 0;

    if(header) {
      if(header[idx]) {
        return header[idx].raw;
      }
    } else {
      return;
    }
  },

  /**
   * Get the header/s of the given name.
   * @param {String} name header name
   * @returns {Array} Array with all the headers of the specified name.
   */
  getHeaderAll: function(name) {
    var idx,
      header = this.headers[JsSIP.utils.headerize(name)],
      result = [];

    if(!header) {
      return [];
    }

    for(idx in header) {
      result.push(header[idx].raw);
    }

    return result;
  },

  /**
   * Get the URI value of the given header at the given value.
   * @param {String} name header name
   * @param {Number} [idx=0] header index
   * @returns {String|undefined} uri attribute of the header. null if header or uri doesn't exist.
   */
  getHeaderUri: function(name, idx) {
    var header = this.headers[JsSIP.utils.headerize(name)];

    idx = idx || 0;

    if(header) {
      if(header[idx] && header[idx].parsed && header[idx].parsed.uri) {
        return header[idx].parsed.uri;
      }
    } else {
      return;
    }
  },

  /**
   * Verify the existence of the given header.
   * @param {String} name header name
   * @returns {boolean} true if header with given name exists, false otherwise
   */
  hasHeader: function(name) {
    return(this.headers[JsSIP.utils.headerize(name)]) ? true : false;
  },

  /**
  * Parse the given header on the given index.
  * @param {String} name header name
  * @param {Number} [idx=0] header index
  * @returns {Object|undefined} Parsed header object, undefined if the header is not present or in case of a parsing error.
  */
  parseHeader: function(name, idx) {
    var header, value, parsed;

    name = JsSIP.utils.headerize(name);

    idx = idx || 0;

    if(!this.headers[name]) {
      console.info(JsSIP.c.LOG_MESSAGE +'Header "' + name + '" not present');
      return;
    } else if(idx >= this.headers[name].length) {
      console.info(JsSIP.c.LOG_MESSAGE +'Not so many "' + name + '" headers present');
      return;
    }

    header = this.headers[name][idx];
    value = header.raw;

    if(header.parsed) {
      return header.parsed;
    }

    //substitute '-' by '_' for grammar rule matching.
    name = name.replace(/-/g, '_');
    parsed = JsSIP.grammar.parse(value, name);

    if(parsed === -1) {
      this.headers[name].splice(idx, 1); //delete from headers
      console.error(JsSIP.c.LOG_MESSAGE +'Error parsing Header ' + name + ':"' + value + '"');
      return;
    } else {
      header.parsed = parsed;
      return parsed;
    }
  },

  /**
   * Message Header attribute selector. Alias of parseHeader.
   * @param {String} name header name
   * @param {Number} [idx=0] header index
   * @returns {Object|undefined} Parsed header object, undefined if the header is not present or in case of a parsing error.
   *
   * @example
   * message.s('via',3).port
   */
  s: function(name, idx) {
    return this.parseHeader(name, idx);
  },

  /**
  * Replace the value of the given header by the value.
  * @param {String} name header name
  * @param {String} value header value
  */
  setHeader: function(name, value) {
    var header = { raw: value };
    this.headers[JsSIP.utils.headerize(name)] = [header];
  },

  toString: function() {
    return this.data;
  }
};

/**
 * @augments JsSIP.IncomingMessage
 * @class Class for incoming SIP request.
 */
JsSIP.IncomingRequest = (function() {

  var IncomingRequest = function() {
    this.headers = {};
    this.ruri = null;
    this.transport = null;
    this.server_transaction = null;
  };
  IncomingRequest.prototype = new JsSIP.IncomingMessage();

  /**
  * Stateful reply.
  * @param {Number} code status code
  * @param {String} reason reason phrase
  * @param {Object} headers extra headers
  * @param {String} body body
  * @param {Function} [onSuccess] onSuccess callback
  * @param {Function} [onFailure] onFailure callback
  */
  IncomingRequest.prototype.reply = function(code, reason, extraHeaders, body, onSuccess, onFailure) {
    var rr, vias, header, length, idx,
      response = 'SIP/2.0 ' + code + ' ' + reason + '\r\n',
      to = this.to,
      r = 0,
      v = 0;

    extraHeaders = extraHeaders || [];

    if(this.method === JsSIP.c.INVITE && code > 100 && code <= 200) {
      rr = this.countHeader('record-route');

      for(r; r < rr; r++) {
        response += 'Record-Route: ' + this.getHeader('record-route', r) + '\r\n';
      }
    }

    vias = this.countHeader('via');

    for(v; v < vias; v++) {
      response += 'Via: ' + this.getHeader('via', v) + '\r\n';
    }

    response += 'Max-Forwards: ' + JsSIP.c.MAX_FORWARDS + '\r\n';

    if(code !== 100 && !this.to_tag) {
      to += ';tag=' + JsSIP.utils.newTag();
    } else if(this.to_tag && !this.s('to').tag) {
      to += ';tag=' + this.to_tag;
    }

    response += 'To: ' + to + '\r\n';
    response += 'From: ' + this.from + '\r\n';
    response += 'Call-ID: ' + this.call_id + '\r\n';
    response += 'CSeq: ' + this.cseq + ' ' + this.method + '\r\n';

    length = extraHeaders.length;
    for(idx=0; idx < length; idx++) {
      response += extraHeaders[idx] +'\r\n';
    }

    if(body) {
      length = JsSIP.utils.str_utf8_length(body);
      response += 'Content-Type: application/sdp\r\n';
      response += 'Content-Length: ' + length + '\r\n\r\n';
      response += body;
    } else {
      response += "\r\n";
    }

    this.server_transaction.receiveResponse(code, response, onSuccess, onFailure);
  };

  /**
  * Stateless reply.
  * @param {Number} code status code
  * @param {String} reason reason phrase
  */
  IncomingRequest.prototype.reply_sl = function(code, reason) {
    var to,
      response = 'SIP/2.0 ' + code + ' ' + reason + '\r\n',
      vias = this.countHeader('via');

    for(var v = 0; v < vias; v++) {
      response += 'Via: ' + this.getHeader('via', v) + '\r\n';
    }

    to = this.to;

    if(!this.to_tag) {
      to += ';tag=' + JsSIP.utils.newTag();
    }

    response += 'To: ' + to + '\r\n';
    response += 'From: ' + this.from + '\r\n';
    response += 'Call-ID: ' + this.call_id + '\r\n';
    response += 'CSeq: ' + this.cseq + ' ' + this.method + '\r\n\r\n';

    this.transport.send(response);
  };

  return IncomingRequest;
}());

/**
 * @augments JsSIP.IncomingMessage
 * @class Class for incoming SIP response.
 */
JsSIP.IncomingResponse = (function() {
  var IncomingResponse = function() {
    this.headers = {};
    this.response_code = null;
    this.reason_phrase = null;
  };
  IncomingResponse.prototype = new JsSIP.IncomingMessage();

  return IncomingResponse;
}());

/**
 * @fileoverview Transactions
 */

/**
 * SIP Transactions module.
 * @augments JsSIP
 */


  /**
  * @class Client Transaction
  * @private
  */
var ClientTransaction = function() {
  this.init = function(request_sender, request, transport) {
    var via;

    this.transport = transport;
    this.id = 'z9hG4bK' + Math.floor(Math.random() * 10000000);
    this.request_sender = request_sender;
    this.request = request;

    via = 'SIP/2.0/' + (request_sender.ua.configuration.hack_via_tcp ? 'TCP' : transport.server.scheme);
    via += ' ' + request_sender.ua.configuration.via_host + ';branch=' + this.id;

    this.request.setHeader('via', via);
  };
};

/**
* @class Non Invite Client Transaction Prototype
* @private
*/
var NonInviteClientTransactionPrototype = function() {
  this.send = function() {
    var tr = this;

    this.state = JsSIP.c.TRANSACTION_TRYING;
    this.F = window.setTimeout(function() {tr.timer_F();}, JsSIP.Timers.TIMER_F);

    if(!this.transport.send(this.request)) {
      this.onTransportError();
    }
  };

  this.onTransportError = function() {
    console.log(JsSIP.c.LOG_TRANSACTION +'Transport Error occurred. Deleting non invite client transaction: ' + this.id);
    window.clearTimeout(this.F);
    window.clearTimeout(this.K);
    delete this.request_sender.ua.transactions.nict[this.id];
    this.request_sender.onTransportError();
  };

  this.timer_F = function() {
    console.log(JsSIP.c.LOG_TRANSACTION +'Timer F expired ' + this.id);
    this.state = JsSIP.c.TRANSACTION_TERMINATED;
    this.request_sender.onRequestTimeout();
    delete this.request_sender.ua.transactions.nict[this.id];
  };

  this.timer_K = function() {
    this.state = JsSIP.c.TRANSACTION_TERMINATED;
    delete this.request_sender.ua.transactions.nict[this.id];
  };

  this.receiveResponse = function(response) {
    var
      tr = this,
      status_code = response.status_code;

    if(status_code < 200) {
      switch(this.state) {
        case JsSIP.c.TRANSACTION_TRYING:
        case JsSIP.c.TRANSACTION_PROCEEDING:
          this.state = JsSIP.c.TRANSACTION_PROCEEDING;
          this.request_sender.receiveResponse(response);
          break;
      }
    } else {
      switch(this.state) {
        case JsSIP.c.TRANSACTION_TRYING:
        case JsSIP.c.TRANSACTION_PROCEEDING:
          this.state = JsSIP.c.TRANSACTION_COMPLETED;
          window.clearTimeout(this.F);

          if(status_code === 408) {
            this.request_sender.onRequestTimeout();
          } else {
            this.request_sender.receiveResponse(response);
          }

          this.K = window.setTimeout(function() {tr.timer_K();}, JsSIP.Timers.TIMER_K);
          break;
        case JsSIP.c.TRANSACTION_COMPLETED:
          break;
      }
    }
  };
};
NonInviteClientTransactionPrototype.prototype = new ClientTransaction();


/**
 * @class Invite Client Transaction Prototype
 * @private
 */
var InviteClientTransactionPrototype = function() {

  this.send = function() {
    var tr = this;
    this.state = JsSIP.c.TRANSACTION_CALLING;
    this.B = window.setTimeout(function() {
      tr.timer_B();
    }, JsSIP.Timers.TIMER_B);

    if(!this.transport.send(this.request)) {
      this.onTransportError();
    }
  };

  this.onTransportError = function() {
    console.log(JsSIP.c.LOG_TRANSACTION +'Transport Error occurred. Deleting invite client transaction: ' + this.id);
    window.clearTimeout(this.B);
    window.clearTimeout(this.D);
    window.clearTimeout(this.M);
    delete this.request_sender.ua.transactions.ict[this.id];
    this.request_sender.onTransportError();
  };

  // RFC 6026 7.2
  this.timer_M = function() {
  console.log(JsSIP.c.LOG_TRANSACTION +'Timer M expired ' + this.id);

  if(this.state === JsSIP.c.TRANSACTION_ACCEPTED) {
    this.state = JsSIP.c.TRANSACTION_TERMINATED;
    window.clearTimeout(this.B);
    delete this.request_sender.ua.transactions.ict[this.id];
  }
  };

  // RFC 3261 17.1.1
  this.timer_B = function() {
  console.log(JsSIP.c.LOG_TRANSACTION +'Timer B expired ' + this.id);
  if(this.state === JsSIP.c.TRANSACTION_CALLING) {
    this.state = JsSIP.c.TRANSACTION_TERMINATED;
    this.request_sender.onRequestTimeout();
    delete this.request_sender.ua.transactions.ict[this.id];
  }
  };

  this.timer_D = function() {
    console.log(JsSIP.c.LOG_TRANSACTION +'Timer D expired ' + this.id);
    this.state = JsSIP.c.TRANSACTION_TERMINATED;
    window.clearTimeout(this.B);
    delete this.request_sender.ua.transactions.ict[this.id];
  };

  this.sendACK = function(response) {
    var tr = this;

    this.ack = 'ACK ' + this.request.ruri + ' SIP/2.0\r\n';
    this.ack += 'Via: ' + this.request.headers['Via'].toString() + '\r\n';

    if(this.request.headers['Route']) {
      this.ack += 'Route: ' + this.request.headers['Route'].toString() + '\r\n';
    }

    this.ack += 'To: ' + response.getHeader('to') + '\r\n';
    this.ack += 'From: ' + this.request.headers['From'].toString() + '\r\n';
    this.ack += 'Call-ID: ' + this.request.headers['Call-ID'].toString() + '\r\n';
    this.ack += 'CSeq: ' + this.request.headers['CSeq'].toString().split(' ')[0];
    this.ack += ' ACK\r\n\r\n';

    this.D = window.setTimeout(function() {tr.timer_D();}, JsSIP.Timers.TIMER_D);

    this.transport.send(this.ack);
  };

  this.cancel_request = function(tr, reason) {
    var request = tr.request;

    this.cancel = JsSIP.c.CANCEL + ' ' + request.ruri + ' SIP/2.0\r\n';
    this.cancel += 'Via: ' + request.headers['Via'].toString() + '\r\n';

    if(this.request.headers['Route']) {
      this.cancel += 'Route: ' + request.headers['Route'].toString() + '\r\n';
    }

    this.cancel += 'To: ' + request.headers['To'].toString() + '\r\n';
    this.cancel += 'From: ' + request.headers['From'].toString() + '\r\n';
    this.cancel += 'Call-ID: ' + request.headers['Call-ID'].toString() + '\r\n';
    this.cancel += 'CSeq: ' + request.headers['CSeq'].toString().split(' ')[0] +
    ' CANCEL\r\n';

    if(reason) {
      this.cancel += 'Reason:' + 'SIP ;cause=200 ;text=' + reason + '\r\n';
    }

    this.cancel += 'Content-Length: 0\r\n\r\n';

    // Send only if a provisional response (>100) has been received.
    if(this.state === JsSIP.c.TRANSACTION_PROCEEDING) {
      this.transport.send(this.cancel);
    }
  };

  this.receiveResponse = function(response) {
    var
      tr = this,
      status_code = response.status_code;

    if(status_code >= 100 && status_code <= 199) {
      switch(this.state) {
        case JsSIP.c.TRANSACTION_CALLING:
          this.state = JsSIP.c.TRANSACTION_PROCEEDING;
          this.request_sender.receiveResponse(response);
          if(this.cancel) {
            this.transport.send(this.cancel);
          }
          break;
        case JsSIP.c.TRANSACTION_PROCEEDING:
          this.request_sender.receiveResponse(response);
          break;
      }
    } else if(status_code >= 200 && status_code <= 299) {
      switch(this.state) {
        case JsSIP.c.TRANSACTION_CALLING:
        case JsSIP.c.TRANSACTION_PROCEEDING:
          this.state = JsSIP.c.TRANSACTION_ACCEPTED;
          this.M = window.setTimeout(function() {
            tr.timer_M();
          }, JsSIP.Timers.TIMER_M);
          this.request_sender.receiveResponse(response);
          break;
        case JsSIP.c.TRANSACTION_ACCEPTED:
          this.request_sender.receiveResponse(response);
          break;
      }
    } else if(status_code >= 300 && status_code <= 699) {
      switch(this.state) {
        case JsSIP.c.TRANSACTION_CALLING:
        case JsSIP.c.TRANSACTION_PROCEEDING:
          this.state = JsSIP.c.TRANSACTION_COMPLETED;
          this.sendACK(response);
          this.request_sender.receiveResponse(response);
          break;
        case JsSIP.c.TRANSACTION_COMPLETED:
          this.sendACK(response);
          break;
      }
    }
  };
};
InviteClientTransactionPrototype.prototype = new ClientTransaction();

/**
 * @class Server Transaction
 * @private
 */
var ServerTransaction = function() {
  this.init = function(request, ua) {
    this.id = request.via_branch;
    this.request = request;
    this.transport = request.transport;
    this.ua = ua;
    this.last_response = '';
    request.server_transaction = this;
  };
};

/**
 * @class Non Invite Server Transaction Prototype
 * @private
 */
var NonInviteServerTransactionPrototype = function() {
  this.timer_J = function() {
    console.log(JsSIP.c.LOG_TRANSACTION +'Timer J expired ' + this.id);
    this.state = JsSIP.c.TRANSACTION_TERMINATED;
    delete this.ua.transactions.nist[this.id];
  };

  this.onTransportError = function() {
    if (!this.transportError) {
      this.transportError = true;

      console.log(JsSIP.c.LOG_TRANSACTION +'Transport Error occurred. Deleting non invite server transaction: ' + this.id);

      window.clearTimeout(this.J);
      delete this.ua.transactions.nist[this.id];
    }
  };

  this.receiveResponse = function(status_code, response, onSuccess, onFailure) {
    var tr = this;

    if(status_code === 100) {
      /* RFC 4320 4.1
       * 'A SIP element MUST NOT
       * send any provisional response with a
       * Status-Code other than 100 to a non-INVITE request.'
       */
      switch(this.state) {
        case JsSIP.c.TRANSACTION_TRYING:
          this.state = JsSIP.c.TRANSACTION_PROCEEDING;
          if(!this.transport.send(response))  {
            this.onTransportError();
          }
          break;
        case JsSIP.c.TRANSACTION_PROCEEDING:
          this.last_response = response;
          if(!this.transport.send(response)) {
            this.onTransportError();
            if (onFailure) {
              onFailure();
            }
          } else if (onSuccess) {
            onSuccess();
          }
          break;
      }
    } else if(status_code >= 200 && status_code <= 699) {
      switch(this.state) {
        case JsSIP.c.TRANSACTION_TRYING:
        case JsSIP.c.TRANSACTION_PROCEEDING:
          this.state = JsSIP.c.TRANSACTION_COMPLETED;
          this.last_response = response;
          this.J = window.setTimeout(function() {
            tr.timer_J();
          }, JsSIP.Timers.TIMER_J);
          if(!this.transport.send(response)) {
            this.onTransportError();
            if (onFailure) {
              onFailure();
            }
          } else if (onSuccess) {
            onSuccess();
          }
          break;
        case JsSIP.c.TRANSACTION_COMPLETED:
          break;
      }
    }
  };
};
NonInviteServerTransactionPrototype.prototype = new ServerTransaction();

/**
 * @class Invite Server Transaction Prototype
 * @private
 */
var InviteServerTransactionPrototype = function() {
  this.timer_H = function() {
    console.log(JsSIP.c.LOG_TRANSACTION +'Timer H expired ' + this.id);

    if(this.state === JsSIP.c.TRANSACTION_COMPLETED) {
      console.log(JsSIP.c.LOG_TRANSACTION +'transactions', 'ACK for ist was never received. Call will be terminated');
      this.state = JsSIP.c.TRANSACTION_TERMINATED;
    }

    delete this.ua.transactions.ist[this.id];
  };

  this.timer_I = function() {
    this.state = JsSIP.c.TRANSACTION_TERMINATED;
    delete this.ua.transactions.ist[this.id];
  };

  // RFC 6026 7.1
  this.timer_L = function() {
  console.log(JsSIP.c.LOG_TRANSACTION +'Timer L expired ' + this.id);

  if(this.state === JsSIP.c.TRANSACTION_ACCEPTED) {
    this.state = JsSIP.c.TRANSACTION_TERMINATED;
    delete this.ua.transactions.ist[this.id];
  }
  };

  this.onTransportError = function() {
    if (!this.transportError) {
      this.transportError = true;

      console.log(JsSIP.c.LOG_TRANSACTION +'Transport Error occurred. Deleting invite server transaction: ' + this.id);

      window.clearTimeout(this.reliableProvisionalTimer);
      window.clearTimeout(this.L);
      window.clearTimeout(this.H);
      window.clearTimeout(this.I);
      delete this.ua.transactions.ist[this.id];
    }
  };

  this.timer_reliableProvisional = function(retransmissions) {
    var
      tr = this,
      response = this.last_response,
      timeout = JsSIP.Timers.T1 * (Math.pow(2, retransmissions + 1));

    if(retransmissions > 8) {
      window.clearTimeout(this.reliableProvisionalTimer);
    } else {
      retransmissions += 1;
      if(!this.transport.send(response)) {
        this.onTransportError();
      }
      this.reliableProvisionalTimer = window.setTimeout(function() {
        tr.timer_reliableProvisional(retransmissions);}, timeout);
    }
  };

  // INVITE Server Transaction RFC 3261 17.2.1
  this.receiveResponse = function(status_code, response, onSuccess, onFailure) {
    var tr = this;

    if(status_code >= 100 && status_code <= 199) {
      switch(this.state) {
        case JsSIP.c.TRANSACTION_PROCEEDING:
          if(!this.transport.send(response)) {
            this.onTransportError();
          }
          this.last_response = response;
          break;
      }
    }

    if(status_code > 100 && status_code <= 199) {
      // Trigger the reliableProvisionalTimer only for the first non 100 provisional response.
      if(!this.reliableProvisionalTimer) {
        this.reliableProvisionalTimer = window.setTimeout(function() {
          tr.timer_reliableProvisional(1);}, JsSIP.Timers.T1);
      }
    } else if(status_code >= 200 && status_code <= 299) {
      switch(this.state) {
        case JsSIP.c.TRANSACTION_PROCEEDING:
          this.state = JsSIP.c.TRANSACTION_ACCEPTED;
          this.last_response = response;
          this.L = window.setTimeout(function() {
            tr.timer_L();
          }, JsSIP.Timers.TIMER_L);
          window.clearTimeout(this.reliableProvisionalTimer);
          /* falls through */
        case JsSIP.c.TRANSACTION_ACCEPTED:
          // Note that this point will be reached for proceeding tr.state also.
          if(!this.transport.send(response)) {
            this.onTransportError();
            if (onFailure) {
              onFailure();
            }
          } else if (onSuccess) {
            onSuccess();
          }
          break;
      }
    } else if(status_code >= 300 && status_code <= 699) {
      switch(this.state) {
        case JsSIP.c.TRANSACTION_PROCEEDING:
          window.clearTimeout(this.reliableProvisionalTimer);
          if(!this.transport.send(response)) {
            this.onTransportError();
            if (onFailure) {
              onFailure();
            }
          } else {
            this.state = JsSIP.c.TRANSACTION_COMPLETED;
            this.H = window.setTimeout(function() {
              tr.timer_H();
            }, JsSIP.Timers.TIMER_H);
            if (onSuccess) {
              onSuccess();
            }
          }
          break;
      }
    }
  };
};
InviteServerTransactionPrototype.prototype = new ServerTransaction();


JsSIP.Transactions = {};
/**
* @augments JsSIP.Transactions
* @class Non Invite Client Transaction
* @param {JsSIP.RequestSender} request_sender
* @param {JsSIP.OutgoingRequest} request
* @param {JsSIP.Transport} transport
*/
JsSIP.Transactions.NonInviteClientTransaction = function(request_sender, request, transport) {
  this.init(request_sender, request, transport);
  this.request_sender.ua.transactions.nict[this.id] = this;
};
JsSIP.Transactions.NonInviteClientTransaction.prototype = new NonInviteClientTransactionPrototype();

/**
* @augments JsSIP.Transactions
* @class Invite Client Transaction
* @param {JsSIP.RequestSender} request_sender
* @param {JsSIP.OutgoingRequest} request
* @param {JsSIP.Transport} transport
*/
JsSIP.Transactions.InviteClientTransaction = function(request_sender, request, transport) {
  var tr = this;

  this.init(request_sender, request, transport);
  this.request_sender.ua.transactions.ict[this.id] = this;

  // Add the cancel property to the request.
  //Will be called from the request instance, not the transaction itself.
  this.request.cancel = function(reason) {
    tr.cancel_request(tr, reason);
  };
};
JsSIP.Transactions.InviteClientTransaction.prototype = new InviteClientTransactionPrototype();

JsSIP.Transactions.AckClientTransaction = function(request_sender, request, transport) {
  this.init(request_sender, request, transport);
  this.send = function() {
    this.transport.send(request);
  };
};
JsSIP.Transactions.AckClientTransaction.prototype = new NonInviteClientTransactionPrototype();


/**
* @augments JsSIP.Transactions
* @class Non Invite Server Transaction
* @param {JsSIP.IncomingRequest} request
* @param {JsSIP.UA} ua
*/
JsSIP.Transactions.NonInviteServerTransaction = function(request, ua) {
  this.init(request, ua);
  this.state = JsSIP.c.TRANSACTION_TRYING;

  ua.transactions.nist[this.id] = this;
};
JsSIP.Transactions.NonInviteServerTransaction.prototype = new NonInviteServerTransactionPrototype();



/**
* @augments JsSIP.Transactions
* @class Invite Server Transaction
* @param {JsSIP.IncomingRequest} request
* @param {JsSIP.UA} ua
*/
JsSIP.Transactions.InviteServerTransaction = function(request, ua) {
  this.init(request, ua);
  this.state = JsSIP.c.TRANSACTION_PROCEEDING;

  ua.transactions.ist[this.id] = this;

  this.reliableProvisionalTimer = null;

  request.reply(100, JsSIP.c.REASON_100);
};
JsSIP.Transactions.InviteServerTransaction.prototype = new InviteServerTransactionPrototype();

/**
 * @function
 * @param {JsSIP.UA} ua
 * @param {JsSIP.IncomingRequest} request
 *
 * @return {boolean}
 * INVITE:
 *  _true_ if retransmission
 *  _false_ new request
 *
 * ACK:
 *  _true_  ACK to non2xx response
 *  _false_ ACK must be passed to TU (accepted state)
 *          ACK to 2xx response
 *
 * CANCEL:
 *  _true_  no matching invite transaction
 *  _false_ matching invite transaction and no final response sent
 *
 * OTHER:
 *  _true_  retransmission
 *  _false_ new request
 */
JsSIP.Transactions.checkTransaction = function(ua, request) {
  var tr;

  switch(request.method) {
    case JsSIP.c.INVITE:
      tr = ua.transactions.ist[request.via_branch];
      if(tr) {
        switch(tr.state) {
          case JsSIP.c.TRANSACTION_PROCEEDING:
            tr.transport.send(tr.last_response);
            break;

            // RFC 6026 7.1 Invite retransmission
            //received while in JsSIP.c.TRANSACTION_ACCEPTED state. Absorb it.
          case JsSIP.c.TRANSACTION_ACCEPTED:
            break;
        }
        return true;
      }
      break;
    case JsSIP.c.ACK:
      tr = ua.transactions.ist[request.via_branch];

      // RFC 6026 7.1
      if(tr) {
        if(tr.state === JsSIP.c.TRANSACTION_ACCEPTED) {
          return false;
        } else if(tr.state === JsSIP.c.TRANSACTION_COMPLETED) {
          tr.state = JsSIP.c.TRANSACTION_CONFIRMED;
          tr.I = window.setTimeout(function() {tr.timer_I();}, JsSIP.Timers.TIMER_I);
          return true;
        }
      }

      // ACK to 2XX Response.
      else {
        return false;
      }
      break;
    case JsSIP.c.CANCEL:
      tr = ua.transactions.ist[request.via_branch];
      if(tr) {
        if(tr.state === JsSIP.c.TRANSACTION_PROCEEDING) {
          tr.request.reply(487, JsSIP.c.REASON_487);
          return false;
        } else {
          return true;
        }
      } else {
        request.reply_sl(481, JsSIP.c.REASON_481);
        return true;
      }
      break;
    default:

      // Non-INVITE Server Transaction RFC 3261 17.2.2
      tr = ua.transactions.nist[request.via_branch];
      if(tr) {
        switch(tr.state) {
          case JsSIP.c.TRANSACTION_TRYING:
            break;
          case JsSIP.c.TRANSACTION_PROCEEDING:
          case JsSIP.c.TRANSACTION_COMPLETED:
            tr.transport.send(tr.last_response);
            break;
        }
        return true;
      }
      break;
  }
};

/**
 * @fileoverview SIP dialog
 */

/**
 * @augments JsSIP
 * @class Class creating a SIP dialog.
 * @param {JsSIP.Session} session
 * @param {JsSIP.IncomingRequest|JsSIP.IncomingResponse} msg
 * @param {Enum} type UAC / UAS
 * @param {Enum} state JsSIP.c.DIALOG_EARLY / JsSIP.c.DIALOG_CONFIRMED
 */

// RFC 3261 12.1
JsSIP.Dialog = function(session, msg, type, state) {
  var contact;

  if(msg.countHeader('contact') === 0) {
    console.log(JsSIP.c.LOG_DIALOG + 'No contact header field. Silently discarded');
    return false;
  }

  if(msg instanceof JsSIP.IncomingResponse) {
    state = (msg.status_code < 200) ? JsSIP.c.DIALOG_EARLY : JsSIP.c.DIALOG_CONFIRMED;
  } else if (msg instanceof JsSIP.IncomingRequest) {
    // Create confirmed dialog if state is not defined
    state = state || JsSIP.c.DIALOG_CONFIRMED;
  } else {
    console.log(JsSIP.c.LOG_DIALOG + 'Received message is not a request neither a response');
    return false;
  }

  contact = msg.s('contact');

  // RFC 3261 12.1.1
  if(type === 'UAS') {
    this.id = {
      call_id: msg.call_id,
      local_tag: msg.to_tag,
      remote_tag: msg.from_tag,
      toString: function() {
        return this.call_id + this.local_tag + this.remote_tag;
      }
    };
    this.state = state;
    this.remote_seqnum = msg.cseq;
    this.local_uri = msg.parseHeader('to').uri;
    this.remote_uri = msg.parseHeader('from').uri;
    this.remote_target = contact.uri;
    this.route_set = msg.getHeaderAll('record-route');
  }
  // RFC 3261 12.1.2
  else if(type === 'UAC') {
    this.id = {
      call_id: msg.call_id,
      local_tag: msg.from_tag,
      remote_tag: msg.to_tag,
      toString: function() {
        return this.call_id + this.local_tag + this.remote_tag;
      }
    };
    this.state = state;
    this.local_seqnum = msg.cseq;
    this.local_uri = msg.parseHeader('from').uri;
    this.remote_uri = msg.parseHeader('to').uri;
    this.remote_target = contact.uri;
    this.route_set = msg.getHeaderAll('record-route').reverse();
  }

  this.session = session;
  session.ua.dialogs[this.id.toString()] = this;
  console.log(JsSIP.c.LOG_DIALOG +'New ' + type + ' dialog created: ' + this.state);
};

JsSIP.Dialog.prototype = {
  /**
   * @param {JsSIP.IncomingMessage} message
   * @param {Enum} UAC/UAS
   */
  update: function(message, type) {
    this.state = JsSIP.c.DIALOG_CONFIRMED;

    console.log(JsSIP.c.LOG_DIALOG +'dialog state changed to \'CONFIRMED\' state');

    if(type === 'UAC') {
      // RFC 3261 13.2.2.4
      this.route_set = message.getHeaderAll('record-route').reverse();
    }
  },

  terminate: function() {
    console.log(JsSIP.c.LOG_DIALOG +'dialog state: ' + this.id.toString() + ' deleted');
    delete this.session.ua.dialogs[this.id.toString()];
  },

  /**
  * @param {String} method request method
  * @param {Object} extraHeaders extra headers
  * @returns {JsSIP.OutgoingRequest}
  */

  // RFC 3261 12.2.1.1
  createRequest: function(method, extraHeaders) {
    var cseq, request, length, idx;
    extraHeaders = extraHeaders || [];

    if(!this.local_seqnum) { this.local_seqnum = Math.floor(Math.random() * 10000); }

    cseq = (method === JsSIP.c.CANCEL || method === JsSIP.c.ACK) ? this.local_seqnum : this.local_seqnum += 1;

    request = new JsSIP.OutgoingRequest(
      method,
      this.remote_target,
      this.session.ua, {
        'cseq': cseq,
        'call_id': this.id.call_id,
        'from_uri': this.local_uri,
        'from_tag': this.id.local_tag,
        'to_uri': this.remote_uri,
        'to_tag': this.id.remote_tag,
        'route_set': this.route_set
      }, extraHeaders);

    request.dialog = this;

    return request;
  },

  /**
  * @param {JsSIP.IncomingRequest} request
  * @returns {Boolean}
  */

  // RFC 3261 12.2.2
  checkInDialogRequest: function(request) {
    if(!this.remote_seqnum) {
      this.remote_seqnum = request.cseq;
    } else if(request.method !== JsSIP.c.INVITE && request.cseq < this.remote_seqnum) {
        //Do not try to reply to an ACK request.
        if (request.method !== JsSIP.c.ACK) {
          request.reply(500, JsSIP.c.REASON_500);
        }
        return false;
    } else if(request.cseq > this.remote_seqnum) {
      this.remote_seqnum = request.cseq;
    }

    switch(request.method) {
      // RFC3261 14.2 Modifying an Existing Session -UAS BEHAVIOR-
      case JsSIP.c.INVITE:
        if(request.cseq < this.remote_seqnum) {
          if(this.state === JsSIP.c.DIALOG_EARLY) {
            var retryAfter = (Math.random() * 10 | 0) + 1;
            request.reply(500, JsSIP.c.REASON_500, [
              'Retry-After:'+ retryAfter
            ]);
          } else {
            request.reply(500, JsSIP.c.REASON_500);
          }
          return false;
        }
        // RFC3261 14.2
        if(this.state === JsSIP.c.DIALOG_EARLY) {
          request.reply(491, JsSIP.c.REASON_491);
          return false;
        }
        // RFC3261 12.2.2 Replace the dialog`s remote target URI
        if(request.hasHeader('contact')) {
          this.remote_target = request.parseHeader('contact').uri;
        }
        break;
      case JsSIP.c.NOTIFY:
        // RFC6655 3.2 Replace the dialog`s remote target URI
        if(request.hasHeader('contact')) {
          this.remote_target = request.parseHeader('contact').uri;
        }
        break;
    }

    return true;
  },

  /**
  * @param {JsSIP.IncomingRequest} request
  */
  receiveRequest: function(request) {
    //Check in-dialog request
    if(!this.checkInDialogRequest(request)) {
      return;
    }

    this.session.receiveRequest(request);
  }
};

/**
 * @fileoverview Request Sender
 */

/**
 * @augments JsSIP
 * @class Class creating a request sender.
 * @param {Object} applicant
 * @param {JsSIP.UA} ua
 */

JsSIP.RequestSender = function(applicant, ua) {
  this.ua = ua;
  this.applicant = applicant;
  this.method = applicant.request.method;
  this.request = applicant.request;
  this.challenged = false;

  // If ua is in closing process or even closed just allow sending Bye and ACK
  if (ua.status === JsSIP.c.UA_STATUS_USER_CLOSED && (this.method !== JsSIP.c.BYE || this.method !== JsSIP.c.ACK)) {
    this.onTransportError();
  }
};

/**
* Create the client transaction and send the message.
*/
JsSIP.RequestSender.prototype = {
  send: function() {
    switch(this.method) {
      case "INVITE":
        this.clientTransaction = new JsSIP.Transactions.InviteClientTransaction(this, this.request, this.ua.transport);
        break;
      case "ACK":
        this.clientTransaction = new JsSIP.Transactions.AckClientTransaction(this, this.request, this.ua.transport);
        break;
      default:
        this.clientTransaction = new JsSIP.Transactions.NonInviteClientTransaction(this, this.request, this.ua.transport);
    }
    this.clientTransaction.send();
  },

  /**
  * Callback fired when receiving a request timeout error from the client transaction.
  * To be re-defined by the applicant.
  * @event
  */
  onRequestTimeout: function() {
    this.applicant.onRequestTimeout();
  },

  /**
  * Callback fired when receiving a transport error from the client transaction.
  * To be re-defined by the applicant.
  * @event
  */
  onTransportError: function() {
    this.applicant.onTransportError();
  },

  /**
  * Called from client transaction when receiving a correct response to the request.
  * Authenticate request if needed or pass the response back to the applicant.
  * @param {JsSIP.IncomingResponse} response
  */
  receiveResponse: function(response) {
    var authorization, cseq,
      status_code = response.status_code;

    /*
    * Authentication
    * Authenticate once. _challenged_ flag used to avoid infinite authentications.
    */
    if ((status_code === 401 || status_code === 407) && !this.challenged && this.ua.configuration.password !== null) {
      authorization = JsSIP.DigestAuthentication(this.ua, this.request, response);

      if (status_code === 401) {
        this.request.setHeader('authorization', authorization);
      } else {
        this.request.setHeader('proxy-authorization', authorization);
      }

      if (response.method === JsSIP.c.REGISTER) {
        cseq = this.applicant.cseq += 1;
      } else if (this.request.dialog){
        cseq = this.request.dialog.local_seqnum += 1;
      } else {
        cseq = this.request.headers.CSeq.toString().split(' ')[0];
        cseq = parseInt(cseq,10) +1;
      }

      this.request.setHeader('cseq', cseq +' '+ this.method);
      this.challenged = true;
      this.send();
    } else {
      this.applicant.receiveResponse(response);
    }
  }
};

/**
 * @fileoverview Registrator Agent
 */

/**
 * @augments JsSIP
 * @class Class creating a registrator agent.
 * @param {JsSIP.UA} ua
 * @param {JsSIP.Transport} transport
 */
JsSIP.Registrator = function(ua, transport) {
  var reg_id=1; //Force reg_id to 1.

  this.ua = ua;
  this.transport = transport;

  this.expires = ua.configuration.register_expires;
  this.min_expires = ua.configuration.register_min_expires;

  // Call-ID and CSeq values RFC3261 10.2
  this.call_id = Math.random().toString(36).substr(2, 22);
  this.cseq = 80;

  this.registrar = 'sip:'+ ua.configuration.domain;
  // this.to_uri
  this.from_uri = ua.configuration.from_uri;

  this.registrationTimer = null;

  // Set status
  this.registered = this.registered_before = false;

  // Save into ua instance
  this.ua.registrator = this;

  // Contact header
  if(reg_id) {
    this.contact = '<' + this.ua.contact.uri + '>';
    this.contact += ';reg-id='+ reg_id;
    this.contact += ';+sip.instance="<urn:uuid:'+ this.ua.configuration.instance_id+'>"';
  } else {
    this.contact = '<' + this.ua.contact.uri + '>';
  }

  this.register();
};

JsSIP.Registrator.prototype = {
  register: function() {
    var request_sender, cause,
      self = this;

    this.request = new JsSIP.OutgoingRequest(JsSIP.c.REGISTER, this.registrar, this.ua, {
        'to_uri': this.from_uri,
        'call_id': this.call_id,
        'cseq': (this.cseq += 1)
      }, [
        'Contact: '+ this.contact + ';expires=' + this.expires,
        'Allow: '+ JsSIP.c.ALLOWED_METHODS
      ]);

    request_sender = new JsSIP.RequestSender(this, this.ua);

    /**
    * @private
    */
    this.receiveResponse = function(response) {
      var contact, expires, min_expires,
        contacts = response.countHeader('contact');

      // Discard responses to older Register/Unregister requests.
      if(response.cseq !== this.cseq) {
        return;
      }

      switch(true) {
        case /^1[0-9]{2}$/.test(response.status_code):
          // Ignore provisional responses.
          break;
        case /^2[0-9]{2}$/.test(response.status_code):
          if(response.hasHeader('expires')) {
            expires = response.getHeader('expires');
          }

          // Search the contact pointing to us and update the expires value
          //accordingly
          if (!contacts) {
            console.log(JsSIP.c.LOG_REGISTRATOR +'No Contact header positive response to Register. Ignore response');
            break;
          }

          while(contacts--) {
            contact = response.parseHeader('contact', contacts);
            if(contact.uri === this.ua.contact.uri) {
              expires = contact.params.expires;
              break;
            }
          }

          if (!contact) {
            console.log(JsSIP.c.LOG_REGISTRATOR +'No Contact header pointing to us. Ignore response');
            break;
          }

          if(!expires) {
            expires = this.expires;
          } else if(expires < this.min_expires) {
            // Set the expires value to min_expires in case it is slower
            console.log(JsSIP.c.LOG_REGISTRATOR +'Received expires value: ' + expires + ' is smaller than the minimum expires time: ' + this.min_expires);
            expires = this.min_expires;
          }

          // Re-Register before the expiration interval has elapsed.
          // For that, decrease the expires value. ie: 3 seconds
          this.registrationTimer = window.setTimeout(function() {
            self.register();
          }, (expires * 1000) - 3000);

          //Save gruu values
          if (contact.params['temp-gruu']) {
            this.ua.contact.temp_gruu = contact.params['temp-gruu'].replace(/"/g,'');
          }
          if (contact.params['pub-gruu']) {
            this.ua.contact.pub_gruu = contact.params['pub-gruu'].replace(/"/g,'');
          }

          this.registered = true;
          this.ua.emit('registered', this.ua, {
            response: response
          });
          break;
        // Interval too brief RFC3261 10.2.8
        case /^423$/.test(response.status_code):
          if(response.hasHeader('min-expires')) {
            min_expires = response.getHeader('min-expires');
            expires = (min_expires - this.expires);
            this.registrationTimer = window.setTimeout(function() {
              self.register();
            }, this.expires * 1000);
          } else { //This response MUST contain a Min-Expires header field
          console.log(JsSIP.c.LOG_REGISTRATOR +'423 response code received to a REGISTER without min-expires. Unregister');
          this.registrationFailure(response, JsSIP.c.causes.SIP_FAILURE_CODE);
          }
          break;
        default:
          cause = JsSIP.utils.sipErrorCause(response.status_code);

          if (cause) {
            cause = JsSIP.c.causes[cause];
          } else {
            cause = JsSIP.c.causes.SIP_FAILURE_CODE;
          }

          this.registrationFailure(response, cause);
      }
    };

    /**
    * @private
    */
    this.onRequestTimeout = function() {
      this.registrationFailure(null, JsSIP.c.causes.REQUEST_TIMEOUT);
    };

    /**
    * @private
    */
    this.onTransportError = function() {
      this.registrationFailure(null, JsSIP.c.causes.CONNECTION_ERROR);
    };

    request_sender.send();
  },

  /**
  * @param {Boolean} [all=false]
  */
  unregister: function(all) {
    /* Parameters:
    *
    * - all: If true, then perform a "unregister all" action ("Contact: *");
    */
    if(!this.registered) {
      console.log(JsSIP.c.LOG_REGISTRATOR +"Already unregistered");
      return;
    }

    this.registered = false;
    this.ua.emit('unregistered');

    // Clear the registration timer.
    window.clearTimeout(this.registrationTimer);

    if(all) {
      this.request = new JsSIP.OutgoingRequest(JsSIP.c.REGISTER, this.registrar, this.ua, {
          'to_uri': this.from_uri,
          'call_id': this.call_id,
          'cseq': (this.cseq += 1)
        }, [
          'Contact: *',
          'Expires : 0'
        ]);
    } else {
      this.request = new JsSIP.OutgoingRequest(JsSIP.c.REGISTER, this.registrar, this.ua, {
          'to_uri': this.from_uri,
          'call_id': this.call_id,
          'cseq': (this.cseq += 1)
        }, [
          'Contact: '+ this.contact + ';expires=0'
        ]);
    }

    var request_sender = new JsSIP.RequestSender(this, this.ua);

    /**
    * @private
    */
    this.receiveResponse = function(response) {
      console.log(JsSIP.c.LOG_REGISTRATOR +response.status_code + ' ' + response.reason_phrase + ' received to unregister request');
    };

    /**
    * @private
    */
    this.onRequestTimeout = function() {
      console.log(JsSIP.c.LOG_REGISTRATOR +'Request Timeout received for unregister request');
    };

    /**
    * @private
    */
    this.onTransportError = function() {
      console.log(JsSIP.c.LOG_REGISTRATOR +'Transport Error received for unregister request');
    };

    request_sender.send();
  },

  /**
  * @private
  */
  registrationFailure: function(response, cause) {
    if (this.registered) {
      this.registered = false;
      this.ua.emit('unregistered', this.ua);
    }
    this.ua.emit('registrationFailed', this.ua, {
      response: response || null,
      cause: cause
    });
  },

  /**
  * @private
  */
  onTransportClosed: function() {
    this.registered_before = this.registered;
    window.clearTimeout(this.registrationTimer);

    if(this.registered) {
      this.registered = false;
      this.ua.emit('unregistered', this.ua);
    }
  },

  /**
  * @private
  */
  onTransportConnected: function() {
    this.register();
  },

  /**
  * @private
  */
  close: function() {
    this.registered_before = this.registered;
    this.unregister();
  }
};


/**
 * @fileoverview Invite Session
 */

/**
 * @augments JsSIP
 * @class Invite Session
 */
JsSIP.Session = (function() {

  var Session = function(ua) {
    var events = [
    'connecting',
    'progress',
    'failed',
    'started',
    'ended'
    ];

    this.ua = ua;
    this.status = null;
    this.dialog = null;
    this.earlyDialogs = [];
    this.mediaSession = null;

    // Session Timers
    // A BYE will be sent if ACK for the response establishing the session is not received
    this.ackTimer = null;
    this.expiresTimer = null;
    this.invite2xxTimer = null;
    this.userNoAnswerTimer = null;
    this.closeTimer = null;

    // Session info
    this.direction = null;
    this.local_identity = null;
    this.remote_identity = null;
    this.start_time = null;
    this.end_time = null;

    // Custom session empty object for high user
    this.data = {};

    this.initEvents(events);

    // Self contact value. _gruu_ or not.
    if (ua.contact.pub_gruu) {
      this.contact = ua.contact.pub_gruu;
    } else {
      this.contact = ua.contact.uri;
    }
  };
  Session.prototype = new JsSIP.EventEmitter();

  /*
   * Session Management
   */

  /**
  * @private
  */
  Session.prototype.init_incoming = function(request) {
    // Session parameter initialization
    this.from_tag = request.from_tag;
    this.status = JsSIP.c.SESSION_INVITE_RECEIVED;
    this.id = request.call_id + this.from_tag;

    //Save the session into the ua sessions collection.
    this.ua.sessions[this.id] = this;

    this.receiveInitialRequest(this.ua, request);
  };

  /**
   * @private
   */
  Session.prototype.connect = function(target, options) {
    var event, eventHandlers, request, selfView, remoteView, mediaType, extraHeaders, requestParams;

    // Check UA Status
    JsSIP.utils.checkUAStatus(this.ua);

    // Check WebRTC support
    if(!JsSIP.utils.isWebRtcSupported()) {
      console.log(JsSIP.c.LOG_UA +'rtcweb not supported.');
      throw new JsSIP.exceptions.WebRtcNotSupportedError();
    }

    // Check Session Status
    if (this.status !== null) {
      throw new JsSIP.exceptions.InvalidStateError();
    }

    // Get call options
    options = options || {};
    selfView = options.views ? options.views.selfView : null;
    remoteView = options.views ? options.views.remoteView : null;
    mediaType = options.mediaType || {audio: true, video: true};
    extraHeaders = options.extraHeaders || [];
    eventHandlers = options.eventHandlers || {};

    // Set event handlers
    for (event in eventHandlers) {
      this.on(event, eventHandlers[event]);
    }

    // Check target validity
    target = JsSIP.utils.normalizeUri(target, this.ua.configuration.domain);
    if (!target) {
      throw new JsSIP.exceptions.InvalidTargetError();
    }

    // Session parameter initialization
    this.from_tag = JsSIP.utils.newTag();
    this.status = JsSIP.c.SESSION_NULL;
    this.mediaSession = new JsSIP.MediaSession(this, selfView, remoteView);

    // Set anonymous property
    this.anonymous = options.anonymous;

    // OutgoingSession specific parameters
    this.isCanceled = false;
    this.received_100 = false;

    requestParams = {from_tag: this.from_tag};

    if (options.anonymous) {
      if (this.ua.contact.temp_gruu) {
        this.contact = this.ua.contact.temp_gruu;
      }

      requestParams.from_display_name = 'Anonymous';
      requestParams.from_uri = 'sip:anonymous@anonymous.invalid';

      extraHeaders.push('P-Preferred-Identity: '+ this.ua.configuration.from_uri);
      extraHeaders.push('Privacy: id');
    }

    extraHeaders.push('Contact: <'+ this.contact + ';ob>');
    extraHeaders.push('Allow: '+ JsSIP.c.ALLOWED_METHODS);
    extraHeaders.push('Content-Type: application/sdp');

    request = new JsSIP.OutgoingRequest(JsSIP.c.INVITE, target, this.ua, requestParams, extraHeaders);

    this.id = request.headers['Call-ID'] + this.from_tag;

    //Save the session into the ua sessions collection.
    this.ua.sessions[this.id] = this;

    /**
     * @private
     */
    this.cancel = function() {
      if (this.status === JsSIP.c.SESSION_INVITE_SENT) {
        if(this.received_100) {
          request.cancel();
        } else {
          this.isCanceled = true;
        }
      } else if(this.status === JsSIP.c.SESSION_1XX_RECEIVED) {
        request.cancel();
      }

      this.failed('local', null, JsSIP.c.causes.CANCELED);
    };

    this.send = function() {
      this.newSession('local', request, target);
      this.connecting('local', request, target);

      new InitialRequestSender(this, this.ua, request, mediaType);
    };

    this.send();
  };

  /**
  * @private
  */
  Session.prototype.close = function(event, sender, data) {
    if(this.status !== JsSIP.c.SESSION_TERMINATED) {
      var session = this;

      console.log(JsSIP.c.LOG_INVITE_SESSION +'Closing Invite Session ' + this.id);

      // 1st Step. Terminate media.
      if (this.mediaSession){
        this.mediaSession.close();
      }

      // 2nd Step. Terminate signaling.

      // Clear session timers
      window.clearTimeout(this.ackTimer);
      window.clearTimeout(this.expiresTimer);
      window.clearTimeout(this.invite2xxTimer);
      window.clearTimeout(this.userNoAnswerTimer);

      this.terminateEarlyDialogs();
      this.terminateConfirmedDialog();
      this.status = JsSIP.c.SESSION_TERMINATED;
      this.closeTimer = window.setTimeout(
        function() {
          if (session && session.ua.sessions[session.id]) {
            delete session.ua.sessions[session.id];
          }
        }, '5000'
      );
    }
  };

  /*
   * Dialog Management
   */

  /**
  * @private
  */
  Session.prototype.createEarlyDialog = function(message, type) {
    // Create an early Dialog given a message and type ('UAC' or 'UAS').
    var earlyDialog,
      local_tag = (type === 'UAS') ? message.to_tag : message.from_tag,
      remote_tag = (type === 'UAS') ? message.from_tag : message.to_tag,
      id = message.call_id + local_tag + remote_tag;

    if (this.earlyDialogs[id]) {
      return true;
    } else {
      earlyDialog = new JsSIP.Dialog(this, message, type, JsSIP.c.DIALOG_EARLY);

      // Dialog has been successfully created.
      if(earlyDialog) {
        this.earlyDialogs[id] = earlyDialog;
        return true;
      }
      // Dialog not created due to an error.
      else {
        return false;
      }
    }
  };

  /**
  * @private
  */
  Session.prototype.createConfirmedDialog = function(message, type) {
    // Create a confirmed dialog given a message and type ('UAC' or 'UAS')
    var dialog,
      local_tag = (type === 'UAS') ? message.to_tag : message.from_tag,
      remote_tag = (type === 'UAS') ? message.from_tag : message.to_tag,
      id = message.call_id + local_tag + remote_tag;

    dialog = this.earlyDialogs[id];
    // In case the dialog is in _early_ state, update it
    if (dialog) {
      dialog.update(message, type);
      this.dialog = dialog;
      delete this.earlyDialogs[id];
      return true;
    }

    // Otherwise, create a _confirmed_ dialog
    dialog = new JsSIP.Dialog(this, message, type);

    if(dialog) {
      this.to_tag = message.to_tag;
      this.dialog = dialog;
      return true;
    }
    // Dialog not created due to an error
    else {
      return false;
    }
  };

  /**
  * @private
  */
  Session.prototype.terminateConfirmedDialog = function() {
    // Terminate confirmed dialog
    if(this.dialog) {
      this.dialog.terminate();
      delete this.dialog;
    }
  };

  /**
  * @private
  */
  Session.prototype.terminateEarlyDialogs = function() {
    // Terminate early Dialogs
    var idx;

    for(idx in this.earlyDialogs) {
      this.earlyDialogs[idx].terminate();
      delete this.earlyDialogs[idx];
    }
  };


  /*
   * Request Reception
   */

  /**
  * @private
  */
  Session.prototype.receiveRequest = function(request) {
    var reason,
      session = this;

    if(request.method === JsSIP.c.CANCEL) {
      /* RFC3261 15 States that a UAS may have accepted an invitation while a CANCEL
      * was in progress and that the UAC MAY continue with the session established by
      * any 2xx response, or MAY terminate with BYE. JsSIP does continue with the
      * established session. So the CANCEL is processed only if the session is not yet
      * established.
      */

      // Transaction layer already responded 487 to the initial request.

      // Reply 200 to CANCEL
      request.reply(200, JsSIP.c.REASON_200);

      /*
      * Terminate the whole session in case the user didn't accept nor reject the
      *request opening the session.
      */
      if(this.status === JsSIP.c.SESSION_WAITING_FOR_ANSWER) {
        reason = request.getHeader('Reason');

        this.status = JsSIP.c.SESSION_CANCELED;

        this.failed('remote', request, JsSIP.c.causes.CANCELED);
      }

    }
    // Requests different to CANCEL.
    // Requests arriving here are in-dialog requests.
    else {
      switch(request.method) {
        case JsSIP.c.ACK:
          if(this.status === JsSIP.c.SESSION_WAITING_FOR_ACK) {
            window.clearTimeout(this.ackTimer);
            window.clearTimeout(this.invite2xxTimer);
            this.status = JsSIP.c.SESSION_CONFIRMED;
          }
          break;
        case JsSIP.c.BYE:
          request.reply(200, JsSIP.c.REASON_200);

          this.ended('remote', request, JsSIP.c.causes.BYE);
          break;
        case JsSIP.c.INVITE:
          if(this.status === JsSIP.c.SESSION_CONFIRMED) {
            console.log(JsSIP.c.LOG_INVITE_SESSION +'Re-INVITE received');
          }
          break;
        case JsSIP.c.MESSAGE:
          JsSIP.messageReceiver(this.ua, request);
          break;
      }
    }
  };


  /*
   * Initial Request Reception
   */

  /**
   * @private
   */
  Session.prototype.receiveInitialRequest = function(ua, request) {
    var body, contentType, expires,
      session = this;

    //Get the Expires header value if exists
    if(request.hasHeader('expires')) {
      expires = request.getHeader('expires') * 1000;
      this.expiresTimer = window.setTimeout(function() { session.expiresTimeout(request); }, expires);
    }

    // Process the INVITE request
    body = request.body;
    contentType = request.getHeader('Content-Type');

    // Request with sdp Offer
    if(body && (contentType === 'application/sdp')) {
      // ** Set the to_tag before replying a response code that will create a dialog
      request.to_tag = JsSIP.utils.newTag();

      if(!this.createEarlyDialog(request, 'UAS')) {
        return;
      }

      this.status = JsSIP.c.SESSION_WAITING_FOR_ANSWER;

      this.userNoAnswerTimer = window.setTimeout(
        function() { session.userNoAnswerTimeout(request); },
        ua.configuration.no_answer_timeout
      );

      /**
      * Answer the call.
      * @param {HTMLVideoElement} selfView
      * @param {HTMLVideoElement} remoteView
      */
      this.answer = function(selfView, remoteView) {
        var offer, onMediaSuccess, onMediaFailure, onSdpFailure;

        // Check UA Status
        JsSIP.utils.checkUAStatus(this.ua);

        // Check Session Status
        if (this.status !== JsSIP.c.SESSION_WAITING_FOR_ANSWER) {
          throw new JsSIP.exceptions.InvalidStateError();
        }

        offer = request.body;

        onMediaSuccess = function() {
          var sdp = session.mediaSession.peerConnection.localDescription.sdp;

          if(!session.createConfirmedDialog(request, 'UAS')) {
            return;
          }

          request.reply(200, JsSIP.c.REASON_200, [
            'Contact: <' + session.contact + '>'],
            sdp,
            // onSuccess
            function(){
              session.status = JsSIP.c.SESSION_WAITING_FOR_ACK;

              session.invite2xxTimer = window.setTimeout(
                function() {session.invite2xxRetransmission(1, request,sdp);},JsSIP.Timers.T1
              );

              window.clearTimeout(session.userNoAnswerTimer);

              session.ackTimer = window.setTimeout(
                function() { session.ackTimeout(); },
                JsSIP.Timers.TIMER_H
              );

              session.started('local');
            },
            // onFailure
            function() {
              session.failed('system', null, JsSIP.c.causes.CONNECTION_ERROR);
            }
          );
        };

        onMediaFailure = function(e) {
          // Unable to get User Media
          request.reply(486, JsSIP.c.REASON_486);
          session.failed('local', null, JsSIP.c.causes.USER_DENIED_MEDIA_ACCESS);
        };

        onSdpFailure = function(e) {
          /* Bad SDP Offer
          * peerConnection.setRemoteDescription throws an exception
          */
          console.log(JsSIP.c.LOG_SERVER_INVITE_SESSION +'PeerConnection Creation Failed: --'+e+'--');
          request.reply(488, JsSIP.c.REASON_488);
          session.failed('remote', request, JsSIP.c.causes.BAD_MEDIA_DESCRIPTION);
        };

        //Initialize Media Session
        session.mediaSession = new JsSIP.MediaSession(session, selfView, remoteView);
        session.mediaSession.startCallee(onMediaSuccess, onMediaFailure, onSdpFailure, offer);
      };

      /**
      * Reject the call
      * @private
      */
      this.reject = function() {
        if (this.status === JsSIP.c.SESSION_WAITING_FOR_ANSWER) {
          request.reply(486, JsSIP.c.REASON_486);

          this.failed('local', null, JsSIP.c.causes.REJECTED);
        }
      };

      // Fire 'call' event callback
      this.newSession('remote', request);

      // Reply with 180 if the session is not closed. It may be closed in the newSession event.
      if (this.status !== JsSIP.c.SESSION_TERMINATED) {
        this.progress('local');

        request.reply(180, JsSIP.c.REASON_180, [
          'Contact: <' + this.contact + '>'
        ]);
      }
    } else {
      request.reply(415, JsSIP.c.REASON_415);
    }
  };


  /*
   * Reception of Response for Initial Request
   */

  /**
   * @private
   */
  Session.prototype.receiveInitialRequestResponse = function(label, response) {
    var cause,
    session = this;

    if(this.status === JsSIP.c.SESSION_INVITE_SENT || this.status === JsSIP.c.SESSION_1XX_RECEIVED) {
      switch(label) {
        case 100:
          this.received_100 = true;
          break;
        case '1xx':
          // same logic for 1xx and 1xx_answer
        case '1xx_answer':
          // Create Early Dialog
          if(!this.createEarlyDialog(response, 'UAC')) {
            break;
          }

          this.status = JsSIP.c.SESSION_1XX_RECEIVED;
          this.progress('remote', response);
          break;
        case '2xx':
          // Dialog confirmed already
          if (this.dialog) {
            if (response.to_tag === this.to_tag) {
              console.log(JsSIP.c.LOG_CLIENT_INVITE_SESSION +'2xx retransmission received');
            } else {
              console.log(JsSIP.c.LOG_CLIENT_INVITE_SESSION +'2xx received from an endpoint not establishing the dialog');
            }
            return;
          }

          this.acceptAndTerminate(response,'SIP ;cause= 400 ;text= "Missing session description"');
          session.failed('remote', response, JsSIP.c.causes.BAD_MEDIA_DESCRIPTION);

          break;
        case '2xx_answer':
          // Dialog confirmed already
          if (this.dialog) {
            if (response.to_tag === this.to_tag) {
              console.log(JsSIP.c.LOG_CLIENT_INVITE_SESSION +'2xx_answer retransmission received');
            } else {
              console.log(JsSIP.c.LOG_CLIENT_INVITE_SESSION +'2xx_answer received from an endpoint not establishing the dialog');
            }
            return;
          }

          this.mediaSession.onMessage(
            'answer',
            response.body,
            /*
             * OnSuccess.
             * SDP Answer fits with Offer. MediaSession will start.
             */
            function() {
              if(!session.createConfirmedDialog(response, 'UAC')) {
                return;
              }
              session.sendACK();
              session.status = JsSIP.c.SESSION_CONFIRMED;

              session.started('remote', response);
            },
            /*
             * OnFailure.
             * SDP Answer does not fit with Offer. Accept the call and Terminate.
             */
            function(e) {
              console.warn(e);
              session.acceptAndTerminate(response, 'SIP ;cause= 488 ;text= "Not Acceptable Here"');
              session.failed('remote', response, JsSIP.c.causes.BAD_MEDIA_DESCRIPTION);
            }
          );
          break;
        case 'failure':
          cause = JsSIP.utils.sipErrorCause(response.status_code);

          if (cause) {
            cause = JsSIP.c.causes[cause];
          } else {
            cause = JsSIP.c.causes.SIP_FAILURE_CODE;
          }

          session.failed('remote', response, cause);
          break;
      }
    }
  };


  /*
   * Timer Handlers
   */

  /**
  * RFC3261 14.2
  * If a UAS generates a 2xx response and never receives an ACK,
  *  it SHOULD generate a BYE to terminate the dialog.
  * @private
  */
  Session.prototype.ackTimeout = function() {
    if(this.status === JsSIP.c.SESSION_WAITING_FOR_ACK) {
      console.log(JsSIP.c.LOG_INVITE_SESSION + 'No ACK received. Call will be terminated');
      window.clearTimeout(this.invite2xxTimer);
      this.sendBye();

      this.ended('remote', null, JsSIP.c.causes.NO_ACK);
    }
  };

  /**
  * RFC3261 13.3.1
  * @private
  */
  Session.prototype.expiresTimeout = function(request) {
    if(this.status === JsSIP.c.SESSION_WAITING_FOR_ANSWER) {
      request.reply(487, JsSIP.c.REASON_487);

      this.failed('system', null, JsSIP.c.causes.EXPIRES);
    }
  };

  /**
  * RFC3261 13.3.1.4
  * Response retransmissions cannot be accomplished by transaction layer
  *  since it is destroyed when receiving the first 2xx answer
  * @private
  */
  Session.prototype.invite2xxRetransmission = function(retransmissions, request, body) {
    var timeout,
      session = this;

    timeout = JsSIP.Timers.T1 * (Math.pow(2, retransmissions));

    if((retransmissions * JsSIP.Timers.T1) <= JsSIP.Timers.T2) {
      retransmissions += 1;

      request.reply(200, JsSIP.c.REASON_200, [
        'Contact: <' + this.contact + '>'],
        body);

      this.invite2xxTimer = window.setTimeout(
        function() {
          session.invite2xxRetransmission(retransmissions, request, body);},
        timeout
      );
    } else {
      window.clearTimeout(this.invite2xxTimer);
    }
  };

  /**
  * @private
  */
  Session.prototype.userNoAnswerTimeout = function(request) {
    request.reply(408, JsSIP.c.REASON_408);

    this.failed('local',null, JsSIP.c.causes.NO_ANSWER);
  };

  /*
   * Private Methods
   */

  /**
  * @private
  */
  Session.prototype.acceptAndTerminate = function(response, reason) {
    // Create _confirmed_ Dialog
    if(!this.createConfirmedDialog(response, 'UAC')) {
      return;
    }

      // Send ACK
      this.sendACK();

      // Now send a BYE and terminate the session
      this.sendBye(reason);
  };

  /**
  * @private
  */
  Session.prototype.sendACK = function() {
    var request, ackSender,
      session = this;

    function AckSender(request) {
      this.request = request;
      this.send = function() {
        var request_sender = new JsSIP.RequestSender(this, session.ua);
        this.receiveResponse = function(response){};

        this.onTransportError = function() {
          session.onTransportError();
        };

        request_sender.send();
      };
    }

    request = this.dialog.createRequest(JsSIP.c.ACK);
    ackSender = new AckSender(request);
    ackSender.send();
  };

  /**
  * @private
  */
  Session.prototype.sendBye = function(reason) {
    var request, byeSender,
      session = this,
      extraHeaders = [];

    function ByeSender(request) {
      this.request = request;
      this.send = function() {
        var request_sender = new JsSIP.RequestSender(this, session.ua);
        this.receiveResponse = function(response){};

        this.onRequestTimeout = function() {
          session.onRequestTimeout();
        };

        this.onTransportError = function() {
          session.onTransportError();
        };

        request_sender.send();
      };
    }

    if (reason) {
      extraHeaders.push('Reason: '+ reason);
    }

    request = this.dialog.createRequest(JsSIP.c.BYE, extraHeaders);
    byeSender = new ByeSender(request);

    byeSender.send();
  };

  /*
   * Session Callbacks
   */

  /**
  * Callback to be called from UA instance when TransportError occurs
  * @private
  */
  Session.prototype.onTransportError = function() {
    if(this.status !== JsSIP.c.SESSION_TERMINATED) {
      this.ended('system', null, JsSIP.c.causes.CONNECTION_ERROR);
    }
  };

  /**
  * Callback to be called from UA instance when RequestTimeout occurs
  * @private
  */
  Session.prototype.onRequestTimeout = function() {
    if(this.status !== JsSIP.c.SESSION_TERMINATED) {
      this.ended('system', null, JsSIP.c.causes.REQUEST_TIMEOUT);
    }
  };

  /**
   * Internal Callbacks
   */
  Session.prototype.newSession = function(originator, request, target) {
    var session = this,
      event_name = 'newSession';

    session.direction = (originator === 'local') ? 'outgoing' : 'incoming';

    if (originator === 'remote') {
      session.local_identity = request.s('to').uri;
      session.remote_identity = request.s('from').uri;
    } else if (originator === 'local'){
      session.local_identity = session.ua.configuration.user;
      session.remote_identity = target;
    }

    session.ua.emit(event_name, session.ua, {
      originator: originator,
      session: session,
      request: request
    });
  };

  Session.prototype.connecting = function(originator, request) {
    var session = this,
    event_name = 'connecting';

    session.emit(event_name, session, {
      originator: 'local',
      request: request
    });
  };

  Session.prototype.progress = function(originator, response) {
    var session = this,
      event_name = 'progress';

    session.emit(event_name, session, {
      originator: originator,
      response: response || null
    });
  };

  Session.prototype.started = function(originator, message) {
    var session = this,
      event_name = 'started';

    session.start_time = new Date();

    session.emit(event_name, session, {
      response: message || null
    });
  };

  Session.prototype.ended = function(originator, message, cause) {
    var session = this,
      event_name = 'ended';

    session.end_time = new Date();

    session.close();
    session.emit(event_name, session, {
      originator: originator,
      message: message || null,
      cause: cause
    });
  };


  Session.prototype.failed = function(originator, response, cause) {
    var session = this,
      event_name = 'failed';

    session.close();
    session.emit(event_name, session, {
      originator: originator,
      response: response,
      cause: cause
    });
  };



  /*
   * User API
   */

  /**
  * Terminate the call.
  * @param {String} [reason]
  */
  Session.prototype.terminate = function() {
    // Check UA Status
    JsSIP.utils.checkUAStatus(this.ua);

    // Check Session Status
    if (this.status === JsSIP.c.SESSION_TERMINATED) {
      throw new JsSIP.exceptions.InvalidStateError();
    }

    switch(this.status) {
      // - UAC -
      case JsSIP.c.SESSION_NULL:
      case JsSIP.c.SESSION_INVITE_SENT:
      case JsSIP.c.SESSION_1XX_RECEIVED:
        this.cancel();
        break;
        // - UAS -
      case JsSIP.c.SESSION_WAITING_FOR_ANSWER:
        this.reject();
        break;
      case JsSIP.c.SESSION_WAITING_FOR_ACK:
      case JsSIP.c.SESSION_CONFIRMED:
        // Send Bye
        this.sendBye();

        this.ended('local', null, JsSIP.c.causes.BYE);
        break;
    }

    this.close();
  };

  /**
  * Send an in-dialog message.
  * @param {String} body message content
  * @param {String} [content_type='text/plain']
  * @param {Function} [onSuccess]
  * @param {Function} [onFailure]
  */
  Session.prototype.message = function(body, content_type, onSuccess, onFailure) {
    var request, request_sender,
      extraHeaders = [];

    // Check Session Status
    if (this.status !== JsSIP.c.SESSION_CONFIRMED) {
      throw new JsSIP.exceptions.InvalidStateError();
    }

    onSuccess = (JsSIP.utils.isFunction(onSuccess)) ? onSuccess : null;
    onFailure = (JsSIP.utils.isFunction(onFailure)) ? onFailure : null;

    extraHeaders.push("Content-Type: "+ (content_type ? content_type : 'text/plain'));

    // Create Request
    request = this.dialog.createRequest(JsSIP.c.MESSAGE, extraHeaders);
    request.body = body;

    // Define receiveResponse logic
    function receiveResponse(response) {
      switch(true) {
        case /^2[0-9]{2}$/.test(response.status_code):
          console.log(JsSIP.c.LOG_INVITE_SESSION +'Positive response received to in-dialog Message.');
          if (onSuccess) {
            onSuccess();
          }
          break;
        case /^[3456][0-9]{2}$/.test(response.status_code):
          console.log(JsSIP.c.LOG_INVITE_SESSION +'Negative response received to in-dialog Message.');
          if (onFailure) {
            onFailure();
          }
          break;
      }
    }

    // Create InDialogRequestSender
    request_sender = new InDialogRequestSender(this, request, receiveResponse, onFailure);
    // Send the request
    request_sender.send();
  };


  /**
   * Initial Request Sender
   */

  /**
   * @private
   */
  var InitialRequestSender = function(session, ua, request, mediaType) {
    var
    self = this,
    label = null;

    this.request = request;

    function send() {
      var request_sender = new JsSIP.RequestSender(self, ua);

      self.receiveResponse = function(response) {
        switch(true) {
          case /^100$/.test(response.status_code):
            session.received_100 = true;
            break;
          case /^1[0-9]{2}$/.test(response.status_code):
            if(!response.to_tag) {
              // Do nothing with 1xx responses without To tag.
              break;
            }
            if(response.body) {
              label = '1xx_answer';
            } else {
              label = '1xx';
            }
            break;
          case /^2[0-9]{2}$/.test(response.status_code):
            if(response.body) {
              label = '2xx_answer';
            } else {
              label = '2xx';
            }
            break;
          default:
            label = 'failure';
        }

        // Proceed to cancelation if the user requested.
        if(session.isCanceled) {
          if(response.status_code >= 100 && response.status_code < 200) {
            self.request.cancel();
          } else if(response.status_code >= 200 && response.status_code < 299) {
            session.sendACK(request);
            session.sendBye();
            self.request.send();
          }
          // Process the response otherwhise.
        } else {
          session.receiveInitialRequestResponse(label, response);
        }
      };

      self.onRequestTimeout = function() {
        session.onRequestTimeout();
      };

      self.onTransportError = function() {
        session.onTransportError();
      };

      request_sender.send();
    }

    function onMediaSuccess() {
      if (session.status === JsSIP.c.SESSION_TERMINATED) {
        session.mediaSession.close();
        return;
      }

      // Set the body to the request and send it.
      request.body = session.mediaSession.peerConnection.localDescription.sdp;

      // Hack to quit m=video section from sdp defined in http://code.google.com/p/webrtc/issues/detail?id=935
      // To be deleted when the fix arrives to chrome stable version
      if (!mediaType.video) {
        if (request.body.indexOf('m=video') !== -1){
          request.body = request.body.substring(0, request.body.indexOf('m=video'));
        }
      }
      // End of Hack

      session.status = JsSIP.c.SESSION_INVITE_SENT;
      send();
    }

    function onMediaFailure(fail,e) {
      if (session.status !== JsSIP.c.SESSION_TERMINATED) {
        console.log(JsSIP.c.LOG_CLIENT_INVITE_SESSION +'Media Access denied');
        session.failed('local', null, JsSIP.c.causes.USER_DENIED_MEDIA_ACCESS);
      }
    }

    session.mediaSession.startCaller(mediaType, onMediaSuccess, onMediaFailure);
  };


  var InDialogRequestSender = function(session, request, onReceiveResponse, onFailure) {
    this.session = session;
    this.request = request;
    this.onReceiveResponse = onReceiveResponse;
    this.onFailure = onFailure;
    this.reatempt = false; // Due to a 491 response
    this.reatemptTimer = null;
  };

  InDialogRequestSender.prototype = {
    send: function() {
      var request_sender = new JsSIP.RequestSender(this, this.session.ua);

      this.receiveResponse = function(response) {
        var status_code = response.status_code;

        // RFC3261 14.1.
        // Terminate the dialog if a 408 or 481 is received from a re-Invite.
        if (status_code === 408 || status_code === 481) {
          this.session.ended('remote', null, JsSIP.c.causes.IN_DIALOG_408_OR_481);
          this.session.onFailure(response);
          this.onReceiveResponse(response);
        } else if (status_code === 491 && response.method === JsSIP.c.INVITE) {
          if(!this.reatempt && this.session.status !== JsSIP.c.SESSION_TERMINATED) {
            this.request.cseq.value = this.request.dialog.local_seqnum += 1;
            this.reatemptTimer = window.setTimeout(
              function() { request_sender.send(); },
              this.getReatempTimeout()
            );
          }
        } else {
          this.onReceiveResponse(response);
        }
      };

      this.onRequestTimeout = function() {
        this.session.onRequestTimeout();
        if (this.onFailure) {
          this.onFailure(JsSIP.c.REQUEST_TIMEOUT);
        }
      };

      this.onTransportError = function() {
        this.session.onTransportError();
        if (this.onFailure) {
          this.onFailure(JsSIP.c.causes.CONNECTION_ERROR);
        }
      };

      request_sender.send();
    },

    getReatempTimeout: function() { // RFC3261 14.1
      var timeout;

      if(this.direction === 'outgoing') {
        timeout = (Math.random() * (4 - 2.1) + 2.1).toFixed(2);
      } else {
        timeout = (Math.random() * 2).toFixed(2);
      }

      return timeout;
    }
  };

  return Session;
}());


/*global SessionDescription: false, webkitURL: false, webkitRTCPeerConnection: false*/

/**
 * @fileoverview SIP User Agent
 */

/**
 * @augments JsSIP
 * @class PeerConnection helper Class.
 * @param {JsSIP.Session} session
 * @param {HTMLVideoElement} selfView
 * @param {HTMLVideoElement} remoteView
 */
JsSIP.MediaSession = function(session, selfView, remoteView) {
  this.session = session;
  this.selfView = selfView || null;
  this.remoteView = remoteView || null;
  this.localMedia = null;
  this.peerConnection = null;
};

JsSIP.MediaSession.prototype = {
  /**
   * Establish peerConnection for Caller.
   * <br> - Prompt the user for permission to use the Web cam or other video or audio input.
   * <br> -- If the user consents, create a peerConnection.
   * <br> -- If the user doesn't consent, fire onFailure callback.
   *
   * @param {Object} mediaType {audio:true/false, video:true/false}
   * @param {Function} onSuccess
   * @param {Function} onFailure
   */
  startCaller: function(mediaType, onSuccess, onFailure) {
    var self = this;

    /** @private */
    function onGetUserMediaSuccess(stream) {
      // Start peerConnection
      self.start(onSuccess, onFailure);

      // add stream to peerConnection
      self.peerConnection.addStream(stream);

      // Set local description and start Ice.
      self.peerConnection.createOffer(function(sessionDescription){
        self.peerConnection.setLocalDescription(sessionDescription);
      });
    }

    /** @private */
    function onGetUserMediaFailure() {
      onFailure();
    }

    this.getUserMedia(mediaType, onGetUserMediaSuccess, onGetUserMediaFailure);
  },

  /**
  * Establish peerConnection for Callee.
  * <br> - Prompt the user for permission to use the Web cam or other video or audio input.
  * <br> -- If the user consents, create a peerConnection.
  * <br> -- If the user doesn't consent, fire onMediaFailure callback.
  * <br>
  * <br> - Set the received SDP offer to the just created peerConnection.
  * <br> -- If the SDP offer is not valid, fire onSdpFailure callback.
  * <br> -- If the SDP offer is valid, fire onSuccess callback
  *
  * @param {Function} onSuccess
  * @param {Function} onMediaFailure
  * @param {Function} onSdpFailure
  * @param {String} sdp
  */
  startCallee: function(onSuccess, onMediaFailure, onSdpFailure, sdp) {
    var offer, mediaType,
      self = this;

    function onGetUserMediaSuccess(stream) {
      // Start peerConnection
      self.start(onSuccess, onMediaFailure);

      // add stream to peerConnection
      self.peerConnection.addStream(stream);

      self.peerConnection.setRemoteDescription(new window.RTCSessionDescription({type:'offer', sdp:sdp}));

      // Set local description and start Ice.
      self.peerConnection.createAnswer(function(sessionDescription){
        self.peerConnection.setLocalDescription(sessionDescription);
      });
    }

    function onGetUserMediaFailure() {
      onMediaFailure();
    }

    self.getUserMedia({'audio':true, 'video':true}, onGetUserMediaSuccess, onGetUserMediaFailure);
   },

  /**
  * peerConnection creation.
  * @param {Function} onSuccess Fired when there are no more ICE candidates
  */
  start: function(onSuccess, onFailure) {
    var
      session = this,
      sent = false,
      stun_config = 'stun:'+this.session.ua.configuration.stun_server,
      servers = [{"url": stun_config}];

    this.peerConnection = new webkitRTCPeerConnection({"iceServers": servers});

    this.peerConnection.onicecandidate = function(event) {
      if (event.candidate) {
        console.log(JsSIP.c.LOG_MEDIA_SESSION +'ICE candidate received: '+ event.candidate.candidate);
      } else {
        console.info(JsSIP.c.LOG_MEDIA_SESSION +'No more ICE candidate');
        console.log(JsSIP.c.LOG_MEDIA_SESSION +'Peerconnection status: '+ this.readyState);
        console.log(JsSIP.c.LOG_MEDIA_SESSION +'Ice Status: '+ this.iceState);
        if (!sent) { // Execute onSuccess just once.
          sent = true;
          onSuccess();
        }
        else {
          onFailure();
        }
      }
    };

    this.peerConnection.onopen = function() {
      console.log(JsSIP.c.LOG_MEDIA_SESSION +'Media session oppened');
    };

    this.peerConnection.onaddstream = function(mediaStreamEvent) {
      console.warn('stream added');

      if (session.remoteView && this.remoteStreams.length > 0) {
        session.remoteView.src = webkitURL.createObjectURL(mediaStreamEvent.stream);
      }
    };

    this.peerConnection.onremovestream = function(stream) {
      console.log(JsSIP.c.LOG_MEDIA_SESSION +'Stream rmeoved: '+ stream);
    };

    this.peerConnection.onstatechange = function(e) {
      console.log(e);
      console.warn('Status changed to: '+ this.readyState);
      console.warn('ICE state is: '+ this.iceState);
    };
  },

  close: function() {
    console.log(JsSIP.c.LOG_MEDIA_SESSION +'Closing peerConnection');
    if(this.peerConnection) {
      this.peerConnection.close();

      if(this.localMedia) {
        this.localMedia.stop();
      }
    }
  },

  /**
  * @param {Object} mediaType
  * @param {Function} onSuccess
  * @param {Function} onFailure
  */
  getUserMedia: function(mediaType, onSuccess, onFailure) {
    var self = this;

    function getSuccess(stream) {
      console.log(JsSIP.c.LOG_MEDIA_SESSION +"Got stream " + stream);

      //Save the localMedia in order to revoke access to devices later.
      self.localMedia = stream;

      // Attach the stream to the view if it exists.
      if (self.selfView){
        self.selfView.src = webkitURL.createObjectURL(stream);
      }

      onSuccess(stream);
    }

    function getFailure() {
      onFailure();
    }

    // Get User Media
    console.log(JsSIP.c.LOG_MEDIA_SESSION +"Requesting access to local media.");
    navigator.webkitGetUserMedia(mediaType, getSuccess, getFailure);

  },

  /**
  * Message reception once PeerConnection is active.
  * @param {String} type
  * @param {String} sdp
  * @param {Function} onSuccess
  * @param {Function} onFailure
  */
  onMessage: function(type, sdp, onSuccess, onFailure) {
    if (type === 'offer') {
      console.log(JsSIP.c.LOG_MEDIA_SESSION +'re-Invite received');
    } else if (type === 'answer') {
      try {
        this.peerConnection.setRemoteDescription(new window.RTCSessionDescription({type:'answer', sdp:sdp}));
        onSuccess();
      } catch (e) {
        onFailure(e);
      }
    }
  }
};

/**
 * @fileoverview Message Sender
 */

/**
 * @augments JsSIP
 * @class Class creating SIP MESSAGE request.
 * @param {JsSIP.UA} ua
 */

JsSIP.Message = function(ua) {
  this.ua = ua;
  this.direction = null;
  this.local_identity = null;
  this.remote_identity = null;
};
JsSIP.Message.prototype = new JsSIP.EventEmitter();


JsSIP.Message.prototype.send = function(target, body, contentType, options) {
  var request_sender, event, eventHandlers, extraHeaders,
    events = [
      'sending',
      'succeeded',
      'failed'
    ];

  JsSIP.utils.checkUAStatus(this.ua);

  this.initEvents(events);

  // Get call options
  options = options || {};
  extraHeaders = options.extraHeaders || [];
  eventHandlers = options.eventHandlers || {};

  // Set event handlers
  for (event in eventHandlers) {
    this.on(event, eventHandlers[event]);
  }

  // Check target validity
  target = JsSIP.utils.normalizeUri(target, this.ua.configuration.domain);
  if (!target) {
    throw new JsSIP.exceptions.InvalidTargetError();
  }

  // Message parameter initialization
  this.direction = 'outgoing';
  this.local_identity = this.ua.configuration.user;
  this.remote_identity = target;

  this.closed = false;
  this.ua.applicants[this] = this;

  extraHeaders.push('Content-Type: '+ (contentType ? contentType : 'text/plain'));

  this.request = new JsSIP.OutgoingRequest(JsSIP.c.MESSAGE, target, this.ua, null, extraHeaders);

  if(body) {
    this.request.body = body;
  }

  request_sender = new JsSIP.RequestSender(this, this.ua);

  this.ua.emit('newMessage', this.ua, {
    originator: 'local',
    message: this,
    request: this.request
  });

  this.emit('sending', this, {
    originator: 'local',
    request: this.request
  });

  request_sender.send();
};

/**
* @private
*/
JsSIP.Message.prototype.receiveResponse = function(response) {
  var cause;

  if(this.closed) {
    return;
  }
  switch(true) {
    case /^1[0-9]{2}$/.test(response.status_code):
      // Ignore provisional responses.
      break;

    case /^2[0-9]{2}$/.test(response.status_code):
      delete this.ua.applicants[this];
      this.emit('succeeded', this, {
        originator: 'remote',
        response: response
      });
      break;

    default:
      delete this.ua.applicants[this];

      cause = JsSIP.utils.sipErrorCause(response.status_code);

      if (cause) {
        cause = JsSIP.c.causes[cause];
      } else {
        cause = JsSIP.c.causes.SIP_FAILURE_CODE;
      }

      this.emit('failed', this, {
        originator: 'remote',
        response: response,
        cause: cause
      });
      break;
  }
};


/**
* @private
*/
JsSIP.Message.prototype.onRequestTimeout = function() {
  if(this.closed) {
    return;
  }
  this.emit('failed', this, {
    originator: 'system',
    cause: JsSIP.c.causes.REQUEST_TIMEOUT
  });
};

/**
* @private
*/
JsSIP.Message.prototype.onTransportError = function() {
  if(this.closed) {
    return;
  }
  this.emit('failed', this, {
    originator: 'system',
    cause: JsSIP.c.causes.CONNECTION_ERROR
  });
};

/**
* @private
*/
JsSIP.Message.prototype.close = function() {
  this.closed = true;
  delete this.ua.applicants[this];
};

/**
 * @private
 */
JsSIP.Message.prototype.init_incoming = function(request) {
  var contentType = request.getHeader('content-type');

  this.direction = 'incoming';
  this.local_identity = request.s('to').uri;
  this.remote_identity = request.s('from').uri;

  request.reply(200, JsSIP.c.REASON_200);

  if (contentType && contentType === "text/plain") {
    this.ua.emit('newMessage', this.ua, {
      originator: 'remote',
      message: this,
      request: request
    });
  }
};


/**
 * @fileoverview SIP Subscriber (SIP-Specific Event Notifications RFC6665)
 */


/**
 * @augments JsSIP
 * @class Class creating a SIP Subscriber.
 */

JsSIP.Subscriber = function() {};
JsSIP.Subscriber.prototype = {
  /**
   * @private
   */
  initSubscriber: function(){
    this.N = null;
    this.subscriptions = {};
  },

  /**
  * @private
  */
  timer_N: function(){
    this.close();
  },

  /**
  * @private
  */
  close: function() {
    var subscription;

    if (this.state !== 'terminated') {
      console.log(JsSIP.c.LOG_SUBSCRIBER,'Terminating Subscriber');

      this.state = 'terminated';
      window.clearTimeout(this.N);

      for (subscription in this.subscriptions) {
        this.subscriptions[subscription].unsubscribe();
      }

      //Delete subscriber from ua.sessions
      delete this.ua.sessions[this.id];

      this.onTerminate();
    }
  },

  /**
  * @private
  */
  onSubscriptionTerminate: function(subscription) {

    delete this.subscriptions[subscription.id];

    if (Object.keys(this.subscriptions).length === 0) {
      this.close();
    }
  },

  subscribe: function() {
    var subscriber, from_tag, expires;

    if (['notify_wait', 'pending', 'active', 'terminated'].indexOf(this.state) !== -1) {
      console.log(JsSIP.c.LOG_SUBSCRIBER,'Subscription is already on');
      return;
    }

    subscriber = this;
    from_tag = JsSIP.utils.newTag();

    new function() {
      this.request = subscriber.createSubscribeRequest(null,{from_tag:from_tag});
      var request_sender = new JsSIP.RequestSender(this, subscriber.ua);

      this.receiveResponse = function(response) {
        switch(true) {
          case /^1[0-9]{2}$/.test(response.status_code): // Ignore provisional responses.
            break;
          case /^2[0-9]{2}$/.test(response.status_code):
            expires = response.s('Expires');

            if (expires && expires <= subscriber.expires) {
              window.clearTimeout(subscriber.N);
              subscriber.N = window.setTimeout(
                function() {subscriber.timer_N();},
                (expires * 1000)
              );
              // Save route set and to tag for backwards compatibility (3265)
              subscriber.route_set_2xx =  response.getHeaderAll('record-route').reverse();
              subscriber.to_tag_2xx = response.s('to').tag;
              subscriber.initial_local_seqnum = parseInt(response.s('cseq').value,10);
            }
            else {
              subscriber.close();

              if (!expires) {
                console.log(JsSIP.c.LOG_SUBSCRIBER,'Expires header missing in a 200-class response to SUBSCRIBE');
                subscriber.onFailure(null, JsSIP.c.EXPIRES_HEADER_MISSING);
              } else {
                console.log(JsSIP.c.LOG_SUBSCRIBER,'Expires header in a 200-class response to SUBSCRIBE with a higher value than the indicated in the request');
                subscriber.onFailure(null, JsSIP.c.INVALID_EXPIRES_HEADER);
              }
            }
            break;
          default:
            subscriber.close();
            subscriber.onFailure(response,null);
            break;
        }
      };

      this.onRequestTimeout = function() {
        subscriber.onFailure(null, JsSIP.c.REQUEST_TIMEOUT);
      };

      this.onTransportError = function() {
        subscriber.onFailure(null, JsSIP.c.causes.CONNECTION_ERROR);
      };

      this.send = function() {
        subscriber.id = this.request.headers['Call-ID'] + from_tag;
        subscriber.ua.sessions[subscriber.id] = subscriber;
        subscriber.state = 'notify_wait';
        subscriber.N = window.setTimeout(
          function() {subscriber.timer_N();},
          (JsSIP.Timers.T1 * 64)
        );
        request_sender.send();
      };
      this.send();
    };

  },

  unsubscribe: function() {
    this.close();
  },

  /**
  * Every Session needs a 'terminate' method in order to be called by JsSIP.UA
  * when user fires JsSIP.UA.close()
  * @private
  */
  terminate: function() {
    this.unsubscribe();
  },

  refresh: function() {
    var subscription;

    for (subscription in this.subscriptions) {
      this.subscriptions[subscription].subscribe();
    }
  },

  /**
  * @private
  */
  receiveRequest: function(request) {
    var subscription_state, expires;

    if (!this.matchEvent(request)) {
      return;
    }

    subscription_state = request.s('Subscription-State');
    expires = subscription_state.expires || this.expires;

    switch (subscription_state.state) {
      case 'pending':
      case 'active':
        //create the subscription.
        window.clearTimeout(this.N);
        new JsSIP.Subscription(this, request, subscription_state.state, expires);
        break;
      case 'terminated':
        if (subscription_state.reason) {
          console.log(JsSIP.c.LOG_SUBSCRIBER,'Terminating subscription with reason: '+ subscription_state.reason);
        }
        window.clearTimeout(this.N);
        this.close();
        break;
    }
  },

  /**
  * @private
  */
  matchEvent: function(request) {
    var event;

    // Check mandatory header Event
    if (!request.hasHeader('Event')) {
      console.log(JsSIP.c.LOG_SUBSCRIBER,'Missing "Event" header');
      return false;
    }
    // Check mandatory header Subscription-State
    if (!request.hasHeader('Subscription-State')) {
      console.log(JsSIP.c.LOG_SUBSCRIBER,'Missing "Subscription-State" header');
      return false;
    }

    // Check whether the event in NOTIFY matches the event in SUBSCRIBE
    event = request.s('event').event;

    if (this.event !== event) {
      console.log(JsSIP.c.LOG_SUBSCRIBER,'Event match failed');
      request.reply(481, 'Event match failed');
      return false;
    } else {
      return true;
    }
  }
};

/**
 * @augments JsSIP
 * @class Class creating a SIP Subscription.
 */
JsSIP.Subscription = function (subscriber, request, state, expires) {

    this.id = null;
    this.subscriber = subscriber;
    this.ua = subscriber.ua;
    this.state = state;
    this.expires = expires;
    this.dialog = null;
    this.N = null;
    this.error_codes  = [404,405,410,416,480,481,482,483,484,485,489,501,604];

    //Create dialog and pass the request to receiveRequest method.
    if (this.createConfirmedDialog(request,'UAS')) {
      this.id = this.dialog.id.toString();
      this.subscriber.subscriptions[this.id] = this;

      /* Update the route_set
      * If the endpoint responded with a 2XX to the initial subscribe
      */
      if (request.from_tag === this.subscriber.to_tag_2xx) {
        this.dialog.route_set = this.subscriber.route_set_2xx;
      }

      this.dialog.local_seqnum = this.subscriber.initial_local_seqnum;

      this.receiveRequest(request, true);
    }
};

JsSIP.Subscription.prototype = {
  /**
  * @private
  */
  timer_N: function(){
    if (this.state === 'terminated') {
      this.close();
    } else if (this.state === 'pending') {
      this.state = 'terminated';
      this.close();
    } else {
      this.subscribe();
    }
  },

  /**
  * @private
  */
  close: function() {
    this.state = 'terminated';
    this.terminateDialog();
    window.clearTimeout(this.N);
    this.subscriber.onSubscriptionTerminate(this);
  },

  /**
  * @private
  */
  createConfirmedDialog: function(message, type) {
    var local_tag, remote_tag, id, dialog;

    // Create a confirmed dialog given a message and type ('UAC' or 'UAS')
    local_tag = (type === 'UAS') ? message.to_tag : message.from_tag;
    remote_tag = (type === 'UAS') ? message.from_tag : message.to_tag;
    id = message.call_id + local_tag + remote_tag;

    dialog = new JsSIP.Dialog(this, message, type);

    if(dialog) {
      this.dialog = dialog;
      return true;
    }
    // Dialog not created due to an error
    else {
      return false;
    }
  },

  /**
  * @private
  */
  terminateDialog: function() {
    if(this.dialog) {
      this.dialog.terminate();
      delete this.dialog;
    }
  },

  /**
  * @private
  */
  receiveRequest: function(request, initial) {
    var subscription_state,
      subscription = this;

    if (!initial && !this.subscriber.matchEvent(request)) {
      console.log(JsSIP.c.LOG_SUBSCRIBER,'Notify request does not match event');
      return;
    }

    request.reply(200, JsSIP.c.REASON_200, [
      'Contact: <'+ this.subscriber.contact +'>'
    ]);

    subscription_state = request.s('Subscription-State');

    switch (subscription_state.state) {
      case 'active':
        this.state = 'active';
        this.subscriber.receiveInfo(request);
        /* falls through */
      case 'pending':
        this.expires = subscription_state.expires || this.expires;
        window.clearTimeout(subscription.N);
        subscription.N = window.setTimeout(
          function() {subscription.timer_N();},
          (this.expires * 1000)
        );
        break;
      case 'terminated':
        if (subscription_state.reason) {
          console.log(JsSIP.c.LOG_SUBSCRIBER,'Terminating subscription with reason: '+ subscription_state.reason);
        }
        this.close();
        this.subscriber.receiveInfo(request);
        break;
    }
  },

  subscribe: function() {
    var expires,
      subscription = this;

    new function() {
      this.request = subscription.subscriber.createSubscribeRequest(subscription.dialog);

      var request_sender = new JsSIP.RequestSender(this, subscription.subscriber.ua);

      this.receiveResponse = function(response) {
        if (subscription.error_codes.indexOf(response.status_code) !== -1) {
          subscription.close();
          subscription.subscriber.onFailure(response, null);
        } else {
          switch(true) {
            case /^1[0-9]{2}$/.test(response.status_code): // Ignore provisional responses.
              break;
            case /^2[0-9]{2}$/.test(response.status_code):
              expires = response.s('Expires');

              if (expires && expires <= subscription.expires) {
                window.clearTimeout(subscription.N);
                subscription.N = window.setTimeout(
                  function() {subscription.timer_N();},
                  (expires * 1000)
                );
              }else {
                subscription.close();

                if (!expires) {
                  console.log(JsSIP.c.LOG_SUBSCRIBER,'Expires header missing in a 200-class response to SUBSCRIBE');
                  subscription.subscriber.onFailure(null, JsSIP.c.EXPIRES_HEADER_MISSING);
                } else {
                  console.log(JsSIP.c.LOG_SUBSCRIBER,'Expires header in a 200-class response to SUBSCRIBE with a higher value than the indicated in the request');
                  subscription.subscriber.onFailure(null, JsSIP.c.INVALID_EXPIRES_HEADER);
                }
              }
              break;
            default:
              subscription.close();
              subscription.subscriber.onFailure(response,null);
              break;
          }
        }
      };

      this.send = function() {
        window.clearTimeout(subscription.N);
        subscription.N = window.setTimeout(
          function() {subscription.timer_N();},
          (JsSIP.Timers.T1 * 64)
        );
        request_sender.send();
      };

      this.onRequestTimeout = function() {
        subscription.subscriber.onFailure(null, JsSIP.c.REQUEST_TIMEOUT);
      };

      this.onTransportError = function() {
        subscription.subscriber.onFailure(null, JsSIP.c.causes.CONNECTION_ERROR);
      };

      this.send();
    };
  },

  unsubscribe: function() {
    var subscription = this;

    this.state = 'terminated';

    new function() {
      this.request = subscription.subscriber.createSubscribeRequest(subscription.dialog);
      this.request.setHeader('Expires', 0);

      var request_sender = new JsSIP.RequestSender(this, subscription.subscriber.ua);

      //Don't care about response.
      this.receiveResponse = function(){};

      this.send = function() {
        window.clearTimeout(subscription.N);
        subscription.N = window.setTimeout(
          function() {subscription.timer_N();},
          (JsSIP.Timers.T1 * 64)
        );
        request_sender.send();
      };

      this.onRequestTimeout = function() {
        subscription.subscriber.onFailure(null, JsSIP.c.REQUEST_TIMEOUT);
      };
      this.onTransportError = function() {
        subscription.subscriber.onFailure(null, JsSIP.c.causes.CONNECTION_ERROR);
      };

      this.send();
    };
  }
};

/**
 * @fileoverview SIP User Agent
 */


/**
 * @augments JsSIP
 * @class Class creating a SIP User Agent.
 */
JsSIP.UA = function(configuration) {
  var events = [
    'connected',
    'disconnected',
    'registered',
    'unregistered',
    'registrationFailed',
    'newSession',
    'newMessage'
  ];

  this.configuration = {};
  this.dialogs = {};
  this.registrator = null;

  //User actions outside any session/dialog (MESSAGE)
  this.applicants = {};

  this.sessions = {};
  this.transport = null;
  this.contact = {};
  this.status = JsSIP.c.UA_STATUS_INIT;
  this.error = null;
  this.transactions = {
    nist: {},
    nict: {},
    ist: {},
    ict: {}
  };

  /**
   * Load configuration
   *
   * @throws {JsSIP.exceptions.ConfigurationError}
   */
  if(!configuration || !this.loadConfig(configuration)) {
    this.status = JsSIP.c.UA_STATUS_NOT_READY;
    this.error = JsSIP.c.UA_CONFIGURATION_ERROR;
    throw new JsSIP.exceptions.ConfigurationError();
  } else {
    this.initEvents(events);
  }
};
JsSIP.UA.prototype = new JsSIP.EventEmitter();

//=================
//  High Level API
//=================

/**
 * Notify the UA about network availability.
 */
JsSIP.UA.prototype.networkIsReady = function() {
  console.log('Network Ready notification received');
  // Stablish connection if needed.
  if(this.status === JsSIP.c.UA_STATUS_NOT_READY && this.error === JsSIP.c.UA_NETWORK_ERROR) {
    this.transport.connect();
  }
};

/**
 * Register.
 *
 * @throws {JsSIP.exceptions.NotReadyError} If JsSIP.UA is not ready (see JsSIP.UA.status, JsSIP.UA.error parameters).
 */
JsSIP.UA.prototype.register = function() {
  if(this.status === JsSIP.c.UA_STATUS_READY) {
    this.configuration.register = true;
    this.registrator.register();
  } else {
      throw new JsSIP.exceptions.NotReadyError();
  }
};

/**
 * Unregister.
 * @param {Boolean} [all] unregister all user bindings.
 *
 * @throws {JsSIP.exceptions.NotReadyError} If JsSIP.UA is not ready (see JsSIP.UA.status, JsSIP.UA.error parameters).
 */
JsSIP.UA.prototype.unregister = function(all) {
  if(this.status === JsSIP.c.UA_STATUS_READY) {
    this.configuration.register = false;
    this.registrator.unregister(all);
  } else {
    throw new JsSIP.exceptions.NotReadyError();
  }
};

/**
 * Registration state.
 * @param {Boolean}
 */
JsSIP.UA.prototype.isRegistered = function() {
  if(this.registrator && this.registrator.registered) {
    return true;
  } else {
    return false;
  }
};

/**
 * Connection state.
 * @param {Boolean}
 */
JsSIP.UA.prototype.isConnected = function() {
  if(this.transport) {
    return this.transport.connected;
  } else {
    return false;
  }
};

/**
 * Make an outgoing call.
 *
 * @param {String} target
 * @param {Boolean} useAudio
 * @param {Boolean} useVideo
 * @param {Object} [eventHandlers]
 * @param {Object} videoViews
 *
 * @throws {JsSIP.exceptions.NotReadyError} If JsSIP.UA is not ready (see JsSIP.UA.status, JsSIP.UA.error parameters).
 * @throws {JsSIP.exceptions.WebRtcNotSupportedError} If rtcweb is not supported by the client.
 * @throws {JsSIP.exceptions.InvalidTargetError} If the calling target is invalid.
 *
 */
JsSIP.UA.prototype.call = function(target, useAudio, useVideo, eventHandlers, videoViews) {
  var session, options;

  // Call Options
  options = {
    views: videoViews,
    mediaType: {audio: useAudio, video: useVideo},
    eventHandlers: eventHandlers
  };

  session = new JsSIP.Session(this);
  session.connect(target, options);
};

/**
 * Send a message.
 * @param {String} target
 * @param {String} body
 * @param {String} [contentType]
 * @param {Object} [eventHandlers]
 *
 * @throws {JsSIP.exceptions.NotReadyError} If JsSIP.UA is not ready (see JsSIP.UA.status, JsSIP.UA.error parameters).
 * @throws {JsSIP.exceptions.InvalidTargetError} If the calling target is invalid.
 *
 */
JsSIP.UA.prototype.sendMessage = function(target, body, contentType, eventHandlers) {
  var message, options;

  // Message Options
  options = {
    eventHandlers: eventHandlers
  };

  message = new JsSIP.Message(this);
  message.send(target, body, contentType, options);
};

/**
 * Gracefully close.
 *
 * @throws {JsSIP.exceptions.NotReadyError} If JsSIP.UA is not ready (see JsSIP.UA.status, JsSIP.UA.error parameters).
 */
JsSIP.UA.prototype.stop = function() {
  var session, applicant,
    ua = this;

  if(this.status !== JsSIP.c.UA_STATUS_READY) {
    throw new JsSIP.exceptions.NotReadyError();
  }

  console.log(JsSIP.c.LOG_UA +'User requested closure.');

  // Close registrator
  if(this.registrator) {
    console.log(JsSIP.c.LOG_UA +'Closing registrator');
    this.registrator.close();
  }

  // Run  _terminate_ on every Session
  for(session in this.sessions) {
    console.log(JsSIP.c.LOG_UA +'Closing session' + session);
    this.sessions[session].terminate();
  }

  // Run  _close_ on every applicant
  for(applicant in this.applicants) {
    this.applicants[applicant].close();
  }

  this.status = JsSIP.c.UA_STATUS_USER_CLOSED;
  this.shutdownGraceTimer = window.setTimeout(
    function() { ua.transport.disconnect(); },
    '5000'
  );
};

/**
 * Connect to the WS server if status = UA_STATUS_INIT.
 * Resume UA after being closed.
 *
 * @throws {JsSIP.exceptions.NotReadyError} If JsSIP.UA is not ready (see JsSIP.UA.status, JsSIP.UA.error parameters).
 */
JsSIP.UA.prototype.start = function() {
  var server;

  if (this.status === JsSIP.c.UA_STATUS_INIT) {
      server = this.getNextWsServer();
      new JsSIP.Transport(this, server);
  } else if(this.status === JsSIP.c.UA_STATUS_USER_CLOSED) {
    console.log(JsSIP.c.LOG_UA +'Resuming..');
    this.status = JsSIP.c.UA_STATUS_READY;
    this.transport.connect();
  } else if (this.status === JsSIP.c.UA_STATUS_READY) {
    console.log(JsSIP.c.LOG_UA +'UA is in ready status. Not resuming');
  } else {
    throw new JsSIP.exceptions.NotReadyError();
  }
};

//==========================
// Event Handlers
//==========================

/**
 * Transport Close event.
 * @private
 * @event
 * @param {JsSIP.Transport} transport.
 */
JsSIP.UA.prototype.onTransportClosed = function(transport) {
  // Run _onTransportError_ callback on every client transaction using _transport_
  var type, idx,
    client_transactions = ['nict', 'ict', 'nist', 'ist'];

  transport.server.status = JsSIP.c.WS_SERVER_DISCONNECTED;
  console.log(JsSIP.c.LOG_UA +'connection status set to: '+ JsSIP.c.WS_SERVER_DISCONNECTED);

  for(type in client_transactions) {
    for(idx in this.transactions[client_transactions[type]]) {
      this.transactions[client_transactions[type]][idx].onTransportError();
    }
  }

  // Close sessions if GRUU is not being used
  if (!this.contact.pub_gruu) {
    this.closeSessionsOnTransportError();
  }

};

/**
 * Unrecoverable transport event.
 * Connection reattempt logic has been done and didn't success.
 * @private
 * @event
 * @param {JsSIP.Transport} transport.
 */
JsSIP.UA.prototype.onTransportError = function(transport) {
  var server;

  console.log(JsSIP.c.LOG_UA +'Transport ' + transport.server.ws_uri + ' failed');

  // Close sessions.
  //Mark this transport as 'down' and try the next one
  transport.server.status = JsSIP.c.WS_SERVER_ERROR;
  console.log(JsSIP.c.LOG_UA +'connection status set to: '+ JsSIP.c.WS_SERVER_ERROR);

  server = this.getNextWsServer();

  if(server) {
    new JsSIP.Transport(this, server);
  }else {
    this.closeSessionsOnTransportError();
    this.status = JsSIP.c.UA_STATUS_NOT_READY;
    this.error = JsSIP.c.UA_NETWORK_ERROR;
    this.emit('disconnected');
  }
};

/**
 * Transport connection event.
 * @private
 * @event
 * @param {JsSIP.Transport} transport.
 */
JsSIP.UA.prototype.onTransportConnected = function(transport) {
  this.transport = transport;

  transport.server.status = JsSIP.c.WS_SERVER_READY;
  console.log(JsSIP.c.LOG_UA +'connection status set to: '+ JsSIP.c.WS_SERVER_READY);

  if(this.status === JsSIP.c.UA_STATUS_USER_CLOSED) {
    return;
  }

  if(this.configuration.register) {
    if(this.registrator) {
      this.registrator.onTransportConnected();
    } else {
      this.registrator = new JsSIP.Registrator(this, transport);
    }
  }
  this.status = JsSIP.c.UA_STATUS_READY;
  this.error = null;
  this.emit('connected', this);
};

//=========================
// receiveRequest
//=========================

/**
 * Request reception
 * @private
 * @param {JsSIP.IncomingRequest} request.
 */
JsSIP.UA.prototype.receiveRequest = function(request) {
  var dialog, session, message,
    method = request.method;

  //Check that Ruri points to us
  if(request.ruri.user !== this.configuration.user) {
    console.log(JsSIP.c.LOG_UA +'Request URI does not point to us');
    request.reply_sl(404, JsSIP.c.REASON_404);
    return;
  }

  // Check transaction
  if(JsSIP.Transactions.checkTransaction(this, request)) {
    return;
  }

  // Create the server transaction
  if(method === JsSIP.c.INVITE) {
    new JsSIP.Transactions.InviteServerTransaction(request, this);
  } else if(method !== JsSIP.c.ACK) {
    new JsSIP.Transactions.NonInviteServerTransaction(request, this);
  }

  /* RFC3261 12.2.2
   * Requests that do not change in any way the state of a dialog may be
   * received within a dialog (for example, an OPTIONS request).
   * They are processed as if they had been received outside the dialog.
   */
  if(method === JsSIP.c.OPTIONS) {
    request.reply(200, JsSIP.c.REASON_200, [
      'Allow: '+ JsSIP.c.ALLOWED_METHODS,
      'Accept: '+ JsSIP.c.ACCEPTED_BODY_TYPES
    ]);
  }

  // Initial Request
  if(!request.to_tag) {
    if(!this.registrator || (this.registrator && !this.registrator.registered)) {
      // High user does not want to be contacted
      request.reply(410, JsSIP.c.REASON_410);
      return;
    }

    switch(method) {
      case JsSIP.c.MESSAGE:
        message = new JsSIP.Message(this);
        message.init_incoming(request);
        break;
      case JsSIP.c.INVITE:
        if(!JsSIP.utils.isWebRtcSupported()) {
          console.warn(JsSIP.c.LOG_UA +'Call invitation received but rtcweb is not supported');
        } else {
          session = new JsSIP.Session(this);
          session.init_incoming(request);
        }
        break;
      case JsSIP.c.BYE:
        // Out of dialog BYE received
        request.reply(481, JsSIP.c.REASON_481);
        break;
      case JsSIP.c.CANCEL:
        session = this.findSession(request);
        if(session) {
          session.receiveRequest(request);
        } else {
          console.warn(JsSIP.c.LOG_UA +'Received CANCEL request for a non existent session');
        }
        break;
      case JsSIP.c.ACK:
        /* Absorb it.
         * ACK request without a corresponding Invite Transaction
         * and without To tag.
         */
        break;
      default:
        request.reply(405, JsSIP.c.REASON_405);
        break;
    }
  }
  // In-dialog request
  else {
    dialog = this.findDialog(request);

    if(dialog) {
      dialog.receiveRequest(request);
    } else if (method === JsSIP.c.NOTIFY) {
      session = this.findSession(request);
      if(session) {
        session.receiveRequest(request);
      } else {
        console.warn(JsSIP.c.LOG_UA +'Received a NOTIFY request for a non existent session');
        request.reply(481, 'Subscription does not exist');
      }
    }
    /* RFC3261 12.2.2
     * Request with to tag, but no matching dialog found.
     * Exception: ACK for an Invite request for which a dialog has not
     * been created.
     */
    else {
      if(method !== JsSIP.c.ACK) {
        request.reply(481, JsSIP.c.REASON_481);
      }
    }
  }
};

//=================
// Utils
//=================

/**
 * Get the session to which the request belongs to, if any.
 * @private
 * @param {JsSIP.IncomingRequest} request.
 * @returns {JsSIP.OutgoingSession|JsSIP.IncomingSession|null}
 */
JsSIP.UA.prototype.findSession = function(request) {
  var
    sessionIDa = request.call_id + request.from_tag,
    sessionA = this.sessions[sessionIDa],
    sessionIDb = request.call_id + request.to_tag,
    sessionB = this.sessions[sessionIDb];

  if(sessionA) {
    return sessionA;
  } else if(sessionB) {
    return sessionB;
  } else {
    return null;
  }
};

/**
 * Get the dialog to which the request belongs to, if any.
 * @private
 * @param {JsSIP.IncomingRequest}
 * @returns {JsSIP.Dialog|null}
 */
JsSIP.UA.prototype.findDialog = function(request) {
  var
    id = request.call_id + request.from_tag + request.to_tag,
    dialog = this.dialogs[id];

  if(dialog) {
    console.log(JsSIP.c.LOG_UA +'dialogs', 'dialog found');
    return dialog;
  } else {
    id = request.call_id + request.to_tag + request.from_tag;
    dialog = this.dialogs[id];
    if(dialog) {
      console.log(JsSIP.c.LOG_UA +'dialogs', 'dialog found');
      return dialog;
    } else {
      console.log(JsSIP.c.LOG_UA +'dialogs', 'No dialog found');
      return null;
    }
  }
};

/**
 * Retrieve the next server to which connect.
 * @private
 * @returns {Object} outbound_proxy_set
 */
JsSIP.UA.prototype.getNextWsServer = function() {
  // Order servers by weight
  var idx, outbound_proxy_set,
    candidates = [];

  for (idx in this.configuration.outbound_proxy_set) {
    outbound_proxy_set = this.configuration.outbound_proxy_set[idx];

    if (outbound_proxy_set.status === 2) {
      continue;
    } else if (candidates.length === 0) {
      candidates.push(outbound_proxy_set);
    } else if (outbound_proxy_set.weight > candidates[0].weight) {
      candidates = [];
      candidates.push(outbound_proxy_set);
    } else if (outbound_proxy_set.weight === candidates[0].weight) {
      candidates.push(outbound_proxy_set);
    }
  }

  idx = Math.floor((Math.random()* candidates.length));

  return candidates[idx];
};

/**
 * Close all sessions on transport error.
 * @private
 */
JsSIP.UA.prototype.closeSessionsOnTransportError = function() {
  var idx;

  // Run _transportError_ for every Session
  for(idx in this.sessions) {
    this.sessions[idx].onTransportError();
  }
  // Call registrator _onTransportClosed_
  if(this.registrator){
    this.registrator.onTransportClosed();
  }
};

/**
 * Configuration load.
 * @private
 * returns {Boolean}
 */
JsSIP.UA.prototype.loadConfig = function(configuration) {
  // Settings and default values
  var name, parameter, attribute, idx, uri, host, ws_uri, contact,
    settings = {
      /* Host address
      * Value to be set in Via sent_by and host part of Contact FQDN
      */
      via_host: Math.random().toString(36).substr(2, 12) + '.invalid',

      // Password
      password: null,

      // Registration parameters
      register_expires: 600,
      register_min_expires: 120,
      register: true,

      // Transport related parameters
      max_reconnection: 3,
      reconnection_timeout: 4,

      // Session parameters
      no_answer_timeout: 60,
      stun_server: 'stun.l.google.com:19302',

      // Loggin parameters
      trace_sip: false,

      // Hacks
      hack_via_tcp: false,
      hack_ip_in_contact: false
    };

  // Pre-Configuration

  /* Allow defining outbound_proxy_set parameter as:
   *  String: "host"
   *  Array of Strings: ["host1", "host2"]
   *  Array of Objects: [{ws_uri:"host1", weight:1}, {ws_uri:"host2", weight:0}]
   *  Array of Objects and Strings: [{ws_uri:"host1"}, "host2"]
   */
  if (typeof configuration.outbound_proxy_set === 'string'){
    configuration.outbound_proxy_set = [{ws_uri:configuration.outbound_proxy_set}];
  } else if (configuration.outbound_proxy_set instanceof Array) {
    for(idx in configuration.outbound_proxy_set) {
      if (typeof configuration.outbound_proxy_set[idx] === 'string'){
        configuration.outbound_proxy_set[idx] = {ws_uri:configuration.outbound_proxy_set[idx]};
      }
    }
  }

  // Check Mandatory parameters
  for(name in JsSIP.UA.configuration_check.mandatory) {
    parameter = configuration[name];

    if(!parameter) {
      console.error('Missing config parameter: ' + name);
      return false;
    } else if(JsSIP.UA.configuration_check.mandatory[name](parameter)) {
      settings[name]= parameter;
    } else {
      console.error('Bad configuration parameter: ' + name);
      return false;
    }
  }

  // Check Optional parameters
  for(name in JsSIP.UA.configuration_check.optional) {
    parameter = configuration[name];

    if(parameter) {
      if(JsSIP.UA.configuration_check.optional[name](parameter)) {
        settings[name] = parameter;
      } else {
        console.error('Bad configuration parameter: ' + name);
        return false;
      }
    }
  }

  // Post Configuration Process

  // Instance-id for GRUU
  settings.instance_id = JsSIP.utils.newUUID();

  // Create a jssip_id parameter which is a static random tag of length 5
  //for this instance.
  settings.jssip_id = Math.random().toString(36).substr(2, 5);

  uri = JsSIP.grammar.parse(settings.uri, 'lazy_uri');

  settings.user = uri.user;
  settings.domain = uri.host;

  // Check whether authorization_user is explicitly defined and take user value otherwise.
  if (!settings.authorization_user) {
    settings.authorization_user = settings.user;
  }

  // Create the From uri
  settings.from_uri = (uri.scheme ? '':'sip:') + settings.uri;

  // User no_answer_timeout
  settings.no_answer_timeout = settings.no_answer_timeout * 1000;

  // Via Host
  if (settings.hack_ip_in_contact) {
    settings.via_host = JsSIP.utils.getRandomIP();
  }

  // Transports
  for (idx in configuration.outbound_proxy_set) {
    ws_uri = JsSIP.grammar.parse(settings.outbound_proxy_set[idx].ws_uri, 'absoluteURI');

    settings.outbound_proxy_set[idx].sip_uri = '<sip:' + ws_uri.host + (ws_uri.port ? ':' + ws_uri.port : '') + ';transport=ws;lr>';

    if (!settings.outbound_proxy_set[idx].weight) {
      settings.outbound_proxy_set[idx].weight = 0;
    }

    settings.outbound_proxy_set[idx].status = 0;
    settings.outbound_proxy_set[idx].scheme = ws_uri.scheme.toUpperCase();

  }

  contact = {
    uri: {value: 'sip:' + uri.user + '@' + settings.via_host + ';transport=ws', writable: false, configurable: false}
  };
  Object.defineProperties(this.contact, contact);

  // Fill the value of the configuration_skeleton
  for(attribute in settings) {
    JsSIP.UA.configuration_skeleton[attribute].value = settings[attribute];
  }

  Object.defineProperties(this.configuration, JsSIP.UA.configuration_skeleton);

  // Clean JsSIP.UA.configuration_skeleton
  for(attribute in settings) {
    JsSIP.UA.configuration_skeleton[attribute].value = '';
  }

  return true;
};


/**
 * Configuration Object skeleton.
 * @private
 */
JsSIP.UA.configuration_skeleton = (function() {
  var idx,  parameter,
    skeleton = {},
    parameters = [
      // Internal parameters
      "instance_id",
      "jssip_id",
      "max_reconnection",

      "reconnection_timeout",
      "register_min_expires",

      // Mandatory user configurable parameters
      "outbound_proxy_set",
      "uri",

      // Optional user configurable parameters
      "authorization_user",
      "display_name",
      "hack_via_tcp", // false.
      "hack_ip_in_contact", //false
      "password",
      "stun_server",
      "no_answer_timeout", // 30 seconds.
      "register_expires", // 600 seconds.
      "trace_sip",
      "via_host", // random.

      // Post-configuration generated parameters
      "domain",
      "from_uri",
      "via_core_value",
      "user"
    ];

  for(idx in parameters) {
    parameter = parameters[idx];
    skeleton[parameter] = {
      value: '',
      writable: false,
      configurable: false
    };
  }

  skeleton['register'] = {
    value: '',
    writable: true,
    configurable: false
  };

  return skeleton;
}());

/**
 * Configuration checker.
 * @private
 * @return {Boolean}
 */
JsSIP.UA.configuration_check = {
  mandatory: {
    outbound_proxy_set: function(outbound_proxy_set) {
      var idx, url;

      if (outbound_proxy_set.length === 0) {
        return false;
      }

      for (idx in outbound_proxy_set) {
        if (!outbound_proxy_set[idx].ws_uri) {
          console.log(JsSIP.c.LOG_UA +'Missing "ws_uri" attribute in outbound_proxy_set parameter');
          return false;
        }
        if (outbound_proxy_set[idx].weight && !Number(outbound_proxy_set[idx].weight)) {
          console.log(JsSIP.c.LOG_UA +'"weight" attribute in outbound_proxy_set parameter must be a Number');
          return false;
        }

        url = JsSIP.grammar.parse(outbound_proxy_set[idx].ws_uri, 'absoluteURI');

        if(url === -1) {
          console.log(JsSIP.c.LOG_UA +'Invalid "ws_uri" attribute in outbound_proxy_set parameter: ' + outbound_proxy_set[idx].ws_uri);
          return false;
        } else if(url.scheme !== 'wss' && url.scheme !== 'ws') {
          console.log(JsSIP.c.LOG_UA +'Invalid url scheme: ' + url.scheme);
          return false;
        }
      }
      return true;
    },
    uri: function(uri) {
      var parsed;

      parsed = JsSIP.grammar.parse(uri, 'lazy_uri');

      if(parsed === -1) {
        console.log(JsSIP.c.LOG_UA +'Invalid uri: ' + uri);
        return false;
      } else if (!parsed.host) {
        console.log(JsSIP.c.LOG_UA +'Invalid uri. Missing uri domain.');
        return false;
      } else {
        return true;
      }
    }
  },
  optional: {
    authorization_user: function(authorization_user) {
      if(JsSIP.grammar.parse('"'+ authorization_user +'"', 'quoted_string') === -1) {
        return false;
      } else {
        return true;
      }
    },
    register: function(register) {
      if(typeof register !== 'boolean') {
        console.log(JsSIP.c.LOG_UA +'register must be true or false');
        return false;
      } else {
        return true;
      }
    },
    display_name: function(display_name) {
      if(JsSIP.grammar.parse('"' + display_name + '"', 'display_name') === -1) {
        return false;
      } else {
        return true;
      }
    },
    register_expires: function(register_expires) {
      if(!Number(register_expires)) {
        return false;
      } else {
        return true;
      }
    },
    trace_sip: function(trace_sip) {
      if(typeof trace_sip !== 'boolean') {
        return false;
      } else {
        return true;
      }
    },
    password: function(password) {
      if(JsSIP.grammar.parse(password, 'password') === -1) {
        return false;
      } else {
        return true;
      }
    },
    stun_server: function(stun_server) {
      var parsed;

      parsed = JsSIP.grammar.parse(stun_server, 'hostport');

      if(parsed === -1) {
        console.log(JsSIP.c.LOG_UA +'Invalid stun_server: ' + stun_server);
        return false;
      } else {
        return true;
      }
    },
    no_answer_timeout: function(no_answer_timeout) {
      if(!Number(no_answer_timeout)) {
        return false;
      } else if(no_answer_timeout < 0 || no_answer_timeout > 600) {
        return false;
      } else {
        return true;
      }
    },
    hack_via_tcp: function(hack_via_tcp) {
      if(typeof hack_via_tcp !== 'boolean') {
        return false;
      } else {
        return true;
      }
    },
    hack_ip_in_contact: function(hack_ip_in_contact) {
      if(typeof hack_ip_in_contact !== 'boolean') {
        return false;
      } else {
        return true;
      }
    }
  }
};

JsSIP.utils = {

  str_utf8_length: function(string) {
    return window.unescape(encodeURIComponent(string)).length;
  },

  isFunction: function(fn) {
    if (fn !== undefined) {
      return (Object.prototype.toString.call(fn) === '[object Function]')? true : false;
    } else {
      return false;
    }
  },

  newTag: function() {
    return Math.random().toString(36).substr(2,JsSIP.c.TAG_LENGTH);
  },

  // http://stackoverflow.com/users/109538/broofa
  newUUID: function() {
    var UUID =  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });

    return UUID;
  },

  checkUri: function(target) {
    if (!target) {
      return false;
    } else if(JsSIP.grammar.parse(target, 'lazy_uri') === -1) {
      return false;
    } else {
      return true;
    }
  },

  /**
  * Normalize SIP URI
  * @private
  * @param {String} target
  * @param {String} [domain]
  */
  normalizeUri: function(target, domain) {
    var uri, parameter, string;

    if (!JsSIP.utils.checkUri(target)) {
      console.log('Invalid target: '+ target);
      return;
    }

    uri = JsSIP.grammar.parse(target, 'lazy_uri');

    if (!uri.host && !domain) {
      console.log('No domain specified in target nor as function parameter');
      return;
    }

    string = (uri.scheme)? uri.scheme +':' : 'sip:';
    string += uri.user;
    string += '@' + (uri.host? uri.host : domain);
    string += (uri.port)? ':' + uri.port : '';

    for (parameter in uri.params) {
      string += ';'+ parameter;
      string += (uri.params[parameter] === true)? '' : '='+ uri.params[parameter];
    }
    return string;
  },

  headerize: function(string) {
    var exceptions = {
      'Call-Id': 'Call-ID',
      'Cseq': 'CSeq',
      'Www-Authenticate': 'WWW-Authenticate'
      },
      name = string.toLowerCase().replace(/_/g,'-').split('-'),
      hname = '', part;

    for (part in name) {
      if (part !== '0') {
        hname +='-';
      }
      hname += name[part].charAt(0).toUpperCase()+name[part].substring(1);
    }
    if (exceptions[hname]) {
      hname = exceptions[hname];
    }
    return hname;
  },

  isWebRtcSupported: (function() {
    var supported = false;

    try {
      if (navigator.webkitGetUserMedia && window.webkitRTCPeerConnection) {
        supported = true;
      }
    } catch(e) {
    }

    return function(){ return supported; };
  }()),

  sipErrorCause: function(status_code) {
    var cause;

    for (cause in JsSIP.c.SIP_ERROR_CAUSES) {
      if (JsSIP.c.SIP_ERROR_CAUSES[cause].indexOf(status_code) !== -1) {
        return cause;
      }
    }

    return;
  },

  getRandomIP: function() {
    function get_octet() {
      return (Math.random() * 255 | 0) + 1;
    }
    return get_octet()+'.'+get_octet()+'.'+get_octet()+'.'+get_octet();
  },

  checkUAStatus: function(ua) {
    if(ua.status !== JsSIP.c.UA_STATUS_READY) {
      throw new JsSIP.exceptions.NotReadyError();
    }
  },

  // MD5 (Message-Digest Algorithm) http://www.webtoolkit.info
  MD5: function(string) {
    function RotateLeft(lValue, iShiftBits) {
      return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }

    function AddUnsigned(lX,lY) {
      var lX4,lY4,lX8,lY8,lResult;
      lX8 = (lX & 0x80000000);
      lY8 = (lY & 0x80000000);
      lX4 = (lX & 0x40000000);
      lY4 = (lY & 0x40000000);
      lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
      if (lX4 & lY4) {
        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
      }
      if (lX4 | lY4) {
        if (lResult & 0x40000000) {
          return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        } else {
          return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        }
      } else {
        return (lResult ^ lX8 ^ lY8);
      }
    }

    function F(x,y,z) {
      return (x & y) | ((~x) & z);
    }

    function G(x,y,z) {
      return (x & z) | (y & (~z));
    }

    function H(x,y,z) {
      return (x ^ y ^ z);
    }

    function I(x,y,z) {
      return (y ^ (x | (~z)));
    }

    function FF(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function GG(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function HH(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function II(a,b,c,d,x,s,ac) {
      a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
      return AddUnsigned(RotateLeft(a, s), b);
    }

    function ConvertToWordArray(string) {
      var lWordCount;
      var lMessageLength = string.length;
      var lNumberOfWords_temp1=lMessageLength + 8;
      var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
      var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
      var lWordArray=Array(lNumberOfWords-1);
      var lBytePosition = 0;
      var lByteCount = 0;
      while ( lByteCount < lMessageLength ) {
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
        lByteCount++;
      }
      lWordCount = (lByteCount-(lByteCount % 4))/4;
      lBytePosition = (lByteCount % 4)*8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
      lWordArray[lNumberOfWords-2] = lMessageLength<<3;
      lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
      return lWordArray;
    }

    function WordToHex(lValue) {
      var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
      for (lCount = 0;lCount<=3;lCount++) {
        lByte = (lValue>>>(lCount*8)) & 255;
        WordToHexValue_temp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
      }
      return WordToHexValue;
    }

    function Utf8Encode(string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    }

    var x=[];
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
      AA=a; BB=b; CC=c; DD=d;
      a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
      d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
      c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
      b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
      a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
      d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
      c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
      b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
      a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
      d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
      c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
      b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
      a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
      d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
      c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
      b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
      a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
      d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
      c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
      b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
      a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
      d=GG(d,a,b,c,x[k+10],S22,0x2441453);
      c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
      b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
      a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
      d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
      c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
      b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
      a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
      d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
      c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
      b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
      a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
      d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
      c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
      b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
      a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
      d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
      c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
      b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
      a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
      d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
      c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
      b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
      a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
      d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
      c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
      b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
      a=II(a,b,c,d,x[k+0], S41,0xF4292244);
      d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
      c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
      b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
      a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
      d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
      c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
      b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
      a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
      d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
      c=II(c,d,a,b,x[k+6], S43,0xA3014314);
      b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
      a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
      d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
      c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
      b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
      a=AddUnsigned(a,AA);
      b=AddUnsigned(b,BB);
      c=AddUnsigned(c,CC);
      d=AddUnsigned(d,DD);
    }

    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

    return temp.toLowerCase();
  }
};

/**
 * @fileoverview Incoming SIP Message Sanity Check
 */

/**
 * SIP message sanity check.
 * @augments JsSIP
 * @function
 * @param {JsSIP.IncomingMessage} message
 * @param {JsSIP.UA} ua
 * @param {JsSIP.Transport} transport
 * @returns {Boolean}
 */
JsSIP.sanityCheck = (function() {
  /*
   * Sanity Check for incoming Messages
   *
   * Requests:
   *  - _rfc3261_8_2_2_1_ Receive a Request with a non supported URI scheme
   *  - _rfc3261_16_3_4_ Receive a Request already sent by us
   *   Does not look at via sent-by but at jssip_id, which is inserted as
   *   a prefix in all initial requests generated by the ua
   *  - _rfc3261_18_3_request_ Body Content-Length
   *  - _rfc3261_8_2_2_2_ Merged Requests
   *
   * Responses:
   *  - _rfc3261_8_1_3_3_ Multiple Via headers
   *  - _rfc3261_18_1_2_ sent-by mismatch
   *  - _rfc3261_18_3_response_ Body Content-Length
   *
   * All:
   *  - Minimum headers in a SIP message
   */
  var requests = [], responses = [], all = [], message, ua, transport;

  // Sanity Check functions for requests
  function rfc3261_8_2_2_1() {
    if(message.s('to').scheme !== 'sip') {
      reply(416, JsSIP.c.REASON_416);
      return false;
    }
  }

  function rfc3261_16_3_4() {
    if(!message.to_tag) {
      if(message.call_id.substr(0, 5) === ua.configuration.jssip_id) {
        reply(482, JsSIP.c.REASON_482);
        return false;
      }
    }
  }

  function rfc3261_18_3_request() {
    var len = JsSIP.utils.str_utf8_length(message.body),
    contentLength = message.getHeader('content-length');

    if(len < contentLength) {
      reply(400, JsSIP.c.REASON_400);
      return false;
    }
  }

  function rfc3261_8_2_2_2() {
    var tr, idx,
      fromTag = message.from_tag,
      call_id = message.call_id,
      cseq = message.cseq;

    if(!message.to_tag) {
      if(message.method === JsSIP.c.INVITE) {
        tr = ua.transactions.ist[message.via_branch];
        if(!tr) {
          return;
        } else {
          for(idx in ua.transactions.ist) {
            tr = ua.transactions.ist[idx];
            if(tr.request.from_tag === fromTag && tr.request.call_id === call_id && tr.request.cseq === cseq) {
              reply(482, JsSIP.c.REASON_482);
              return false;
            }
          }
        }
      } else {
        tr = ua.transactions.nist[message.via_branch];
        if(!tr) {
          return;
        } else {
          for(idx in ua.transactions.nist) {
            tr = ua.transactions.nist[idx];
            if(tr.request.from_tag === fromTag && tr.request.call_id === call_id && tr.request.cseq === cseq) {
              reply(482, JsSIP.c.REASON_482);
              return false;
            }
          }
        }
      }
    }
  }

  // Sanity Check functions for responses
  function rfc3261_8_1_3_3() {
    if(message.countHeader('via') > 1) {
      return false;
    }
  }

  function rfc3261_18_1_2() {
    var via_host = ua.configuration.via_host;
    if(message.via.host !== via_host) {
      return false;
    }
  }

  function rfc3261_18_3_response() {
    var
      len = JsSIP.utils.str_utf8_length(message.body),
      contentLength = message.getHeader('content-length');

      if(len < contentLength) {
        return false;
      }
  }

  // Sanity Check functions for requests and responses
  function minimumHeaders() {
    var
      mandatoryHeaders = ['from', 'to', 'call_id', 'cseq', 'via'],
      idx = mandatoryHeaders.length;

    while(idx--) {
      if(!message.hasHeader(mandatoryHeaders[idx])) {
        return false;
      }
    }
  }

  // Reply
  function reply(status_code, reason_phrase) {
    var to,
      response = "SIP/2.0 " + status_code + " " + reason_phrase + "\r\n",
      via_length = message.countHeader('via'),
      idx = 0;

    for(idx; idx < via_length; idx++) {
      response += "Via: " + message.getHeader('via', idx) + "\r\n";
    }

    to = message.to;

    if(!message.to_tag) {
      to += ';tag=' + JsSIP.utils.newTag();
    }

    response += "To: " + to + "\r\n";
    response += "From: " + message.from + "\r\n";
    response += "Call-ID: " + message.call_id + "\r\n";
    response += "CSeq: " + message.cseq + " " + message.method + "\r\n";
    response += "\r\n";

    transport.send(response);
  }

  requests.push(rfc3261_8_2_2_1);
  requests.push(rfc3261_16_3_4);
  requests.push(rfc3261_18_3_request);
  requests.push(rfc3261_8_2_2_2);

  responses.push(rfc3261_8_1_3_3);
  responses.push(rfc3261_18_1_2);
  responses.push(rfc3261_18_3_response);

  all.push(minimumHeaders);

  // Run the Sanity Check collections according to the message instance
  return function(m, u, t) {
    var len, pass;

    message = m;
    ua = u;
    transport = t;

    len = all.length;
    while(len--) {
      pass = all[len](message);
      if(pass === false) {
        return false;
      }
    }

    if(message instanceof JsSIP.IncomingRequest) {
      len = requests.length;
      while(len--) {
        pass = requests[len](message);
        if(pass === false) {
          return false;
        }
      }
    }

    else if(message instanceof JsSIP.IncomingResponse) {
      len = responses.length;
      while(len--) {
        pass = responses[len](message);
        if(pass === false) {
          return false;
        }
      }
    }

    //Everything OK
    return true;
  };
}());

/**
 * @fileoverview DigestAuthentication
 */

/**
 * SIP Digest Authentication.
 * @augments JsSIP.
 * @function Digest Authentication
 * @param {JsSIP.UA} ua
 * @param {JsSIP.OutgoingRequest} request
 * @param {JsSIP.IncomingResponse} response
 * @returns {String}
 */
JsSIP.DigestAuthentication = function (ua, request, response) {
  var authenticate, ha1, ha2, param,
    authorization = {},
    digest = '',
    nc = "00000001",
    cnonce = Math.random().toString(36).substr(2, 12),
    credentials = {
      username: ua.configuration.authorization_user,
      password: ua.configuration.password
    };

  if(response.status_code === 401) {
    authenticate = response.parseHeader('www-authenticate');
  } else {
    authenticate = response.parseHeader('proxy-authenticate');
  }

  response = {
    realm: authenticate.realm.replace(/"/g,''),
    qop: authenticate.qop || null,
    nonce: authenticate.nonce.replace(/"/g,'')
  };

  // HA1 = MD5(A1) = MD5(username:realm:password)
  ha1 = JsSIP.utils.MD5(credentials.username + ":" + response.realm + ":" + credentials.password);

  switch(response.qop) {
    case 'auth-int':
      // HA2 = MD5(A2) = MD5(method:digestURI:MD5(entityBody))
      ha2 = JsSIP.utils.MD5(request.method + ":" + request.ruri + ":" + JsSIP.utils.MD5(request.body ? request.body : ""));
      break;
    default:
      // HA2 = MD5(A2) = MD5(method:digestURI)
      ha2 = JsSIP.utils.MD5(request.method + ":" + request.ruri);
  }

  if(response.qop) {
    // response = MD5(HA1:nonce:nonceCount:credentialsNonce:qop:HA2)
    response = JsSIP.utils.MD5(ha1 + ":" + response.nonce + ":" + nc + ":" + cnonce + ":" + response.qop + ":" + ha2);
  } else {
    // response = MD5(HA1:nonce:HA2)
    response = JsSIP.utils.MD5(ha1 + ":" + response.nonce + ":" + ha2);
  }

  // Fill the Authorization object
  authorization.username = '"' + credentials.username + '"';
  authorization.realm = authenticate.realm;
  authorization.nonce = authenticate.nonce;
  authorization.uri = '"' + request.ruri + '"';
  authorization.qop = authenticate.qop || null;
  authorization.response = '"' + response + '"';
  authorization.algorithm = "MD5";
  authorization.opaque = authenticate.opaque || null;
  authorization.cnonce = authenticate.qop ? '"' + cnonce + '"' : null;
  authorization.nc = authenticate.qop ? nc : null;

  for(param in authorization) {
    if(authorization[param] !== null) {
      digest += ',' + param + '=' + authorization[param];
    }
  }

  return 'Digest ' + digest.substr(1);
};


  window.JsSIP = JsSIP;
}(window));

JsSIP.grammar = (function(){
  /*
   * Generated by PEG.js 0.7.0.
   *
   * http://pegjs.majda.cz/
   */
  
  function quote(s) {
    /*
     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
     * string literal except for the closing quote character, backslash,
     * carriage return, line separator, paragraph separator, and line feed.
     * Any character may appear in the form of an escape sequence.
     *
     * For portability, we also escape escape all control and non-ASCII
     * characters. Note that "\0" and "\v" escape sequences are not used
     * because JSHint does not like the first and IE the second.
     */
     return '"' + s
      .replace(/\\/g, '\\\\')  // backslash
      .replace(/"/g, '\\"')    // closing quote character
      .replace(/\x08/g, '\\b') // backspace
      .replace(/\t/g, '\\t')   // horizontal tab
      .replace(/\n/g, '\\n')   // line feed
      .replace(/\f/g, '\\f')   // form feed
      .replace(/\r/g, '\\r')   // carriage return
      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
      + '"';
  }
  
  var result = {
    /*
     * Parses the input with a generated parser. If the parsing is successfull,
     * returns a value explicitly or implicitly specified by the grammar from
     * which the parser was generated (see |PEG.buildParser|). If the parsing is
     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
     */
    parse: function(input, startRule) {
      var parseFunctions = {
        "CRLF": parse_CRLF,
        "DIGIT": parse_DIGIT,
        "ALPHA": parse_ALPHA,
        "HEXDIG": parse_HEXDIG,
        "WSP": parse_WSP,
        "OCTET": parse_OCTET,
        "DQUOTE": parse_DQUOTE,
        "SP": parse_SP,
        "HTAB": parse_HTAB,
        "alphanum": parse_alphanum,
        "reserved": parse_reserved,
        "unreserved": parse_unreserved,
        "mark": parse_mark,
        "escaped": parse_escaped,
        "LWS": parse_LWS,
        "SWS": parse_SWS,
        "HCOLON": parse_HCOLON,
        "TEXT_UTF8_TRIM": parse_TEXT_UTF8_TRIM,
        "TEXT_UTF8char": parse_TEXT_UTF8char,
        "UTF8_NONASCII": parse_UTF8_NONASCII,
        "UTF8_CONT": parse_UTF8_CONT,
        "LHEX": parse_LHEX,
        "token": parse_token,
        "token_nodot": parse_token_nodot,
        "separators": parse_separators,
        "word": parse_word,
        "STAR": parse_STAR,
        "SLASH": parse_SLASH,
        "EQUAL": parse_EQUAL,
        "LPAREN": parse_LPAREN,
        "RPAREN": parse_RPAREN,
        "RAQUOT": parse_RAQUOT,
        "LAQUOT": parse_LAQUOT,
        "COMMA": parse_COMMA,
        "SEMI": parse_SEMI,
        "COLON": parse_COLON,
        "LDQUOT": parse_LDQUOT,
        "RDQUOT": parse_RDQUOT,
        "comment": parse_comment,
        "ctext": parse_ctext,
        "quoted_string": parse_quoted_string,
        "qdtext": parse_qdtext,
        "quoted_pair": parse_quoted_pair,
        "SIP_URI_simple": parse_SIP_URI_simple,
        "SIP_URI": parse_SIP_URI,
        "uri_scheme": parse_uri_scheme,
        "userinfo": parse_userinfo,
        "user": parse_user,
        "user_unreserved": parse_user_unreserved,
        "password": parse_password,
        "hostport": parse_hostport,
        "host": parse_host,
        "hostname": parse_hostname,
        "domainlabel": parse_domainlabel,
        "toplabel": parse_toplabel,
        "IPv6reference": parse_IPv6reference,
        "IPv6address": parse_IPv6address,
        "h16": parse_h16,
        "ls32": parse_ls32,
        "IPv4address": parse_IPv4address,
        "dec_octet": parse_dec_octet,
        "port": parse_port,
        "uri_parameters": parse_uri_parameters,
        "uri_parameter": parse_uri_parameter,
        "transport_param": parse_transport_param,
        "user_param": parse_user_param,
        "method_param": parse_method_param,
        "ttl_param": parse_ttl_param,
        "maddr_param": parse_maddr_param,
        "lr_param": parse_lr_param,
        "other_param": parse_other_param,
        "pname": parse_pname,
        "pvalue": parse_pvalue,
        "paramchar": parse_paramchar,
        "param_unreserved": parse_param_unreserved,
        "headers": parse_headers,
        "header": parse_header,
        "hname": parse_hname,
        "hvalue": parse_hvalue,
        "hnv_unreserved": parse_hnv_unreserved,
        "Request_Response": parse_Request_Response,
        "Request_Line": parse_Request_Line,
        "Request_URI": parse_Request_URI,
        "absoluteURI": parse_absoluteURI,
        "hier_part": parse_hier_part,
        "net_path": parse_net_path,
        "abs_path": parse_abs_path,
        "opaque_part": parse_opaque_part,
        "uric": parse_uric,
        "uric_no_slash": parse_uric_no_slash,
        "path_segments": parse_path_segments,
        "segment": parse_segment,
        "param": parse_param,
        "pchar": parse_pchar,
        "scheme": parse_scheme,
        "authority": parse_authority,
        "srvr": parse_srvr,
        "reg_name": parse_reg_name,
        "query": parse_query,
        "SIP_Version": parse_SIP_Version,
        "INVITEm": parse_INVITEm,
        "ACKm": parse_ACKm,
        "OPTIONSm": parse_OPTIONSm,
        "BYEm": parse_BYEm,
        "CANCELm": parse_CANCELm,
        "REGISTERm": parse_REGISTERm,
        "SUBSCRIBEm": parse_SUBSCRIBEm,
        "NOTIFYm": parse_NOTIFYm,
        "Method": parse_Method,
        "Status_Line": parse_Status_Line,
        "Status_Code": parse_Status_Code,
        "extension_code": parse_extension_code,
        "Reason_Phrase": parse_Reason_Phrase,
        "Allow_Events": parse_Allow_Events,
        "Call_ID": parse_Call_ID,
        "Contact": parse_Contact,
        "contact_param": parse_contact_param,
        "name_addr": parse_name_addr,
        "addr_spec": parse_addr_spec,
        "addr_spec_simple": parse_addr_spec_simple,
        "display_name": parse_display_name,
        "contact_params": parse_contact_params,
        "c_p_q": parse_c_p_q,
        "c_p_expires": parse_c_p_expires,
        "contact_extension": parse_contact_extension,
        "delta_seconds": parse_delta_seconds,
        "qvalue": parse_qvalue,
        "generic_param": parse_generic_param,
        "gen_value": parse_gen_value,
        "Content_Disposition": parse_Content_Disposition,
        "disp_type": parse_disp_type,
        "disp_param": parse_disp_param,
        "handling_param": parse_handling_param,
        "Content_Encoding": parse_Content_Encoding,
        "Content_Length": parse_Content_Length,
        "Content_Type": parse_Content_Type,
        "media_type": parse_media_type,
        "m_type": parse_m_type,
        "discrete_type": parse_discrete_type,
        "composite_type": parse_composite_type,
        "extension_token": parse_extension_token,
        "x_token": parse_x_token,
        "m_subtype": parse_m_subtype,
        "m_parameter": parse_m_parameter,
        "m_value": parse_m_value,
        "CSeq": parse_CSeq,
        "CSeq_value": parse_CSeq_value,
        "Expires": parse_Expires,
        "Event": parse_Event,
        "event_type": parse_event_type,
        "event_param": parse_event_param,
        "From": parse_From,
        "from_param": parse_from_param,
        "tag_param": parse_tag_param,
        "Max_Forwards": parse_Max_Forwards,
        "Min_Expires": parse_Min_Expires,
        "Proxy_Authenticate": parse_Proxy_Authenticate,
        "challenge": parse_challenge,
        "other_challenge": parse_other_challenge,
        "auth_param": parse_auth_param,
        "digest_cln": parse_digest_cln,
        "realm": parse_realm,
        "realm_value": parse_realm_value,
        "domain": parse_domain,
        "URI": parse_URI,
        "nonce": parse_nonce,
        "nonce_value": parse_nonce_value,
        "opaque": parse_opaque,
        "stale": parse_stale,
        "algorithm": parse_algorithm,
        "qop_options": parse_qop_options,
        "qop_value": parse_qop_value,
        "Proxy_Require": parse_Proxy_Require,
        "Record_Route": parse_Record_Route,
        "rec_route": parse_rec_route,
        "Require": parse_Require,
        "Route": parse_Route,
        "route_param": parse_route_param,
        "Subscription_State": parse_Subscription_State,
        "substate_value": parse_substate_value,
        "subexp_params": parse_subexp_params,
        "event_reason_value": parse_event_reason_value,
        "Subject": parse_Subject,
        "Supported": parse_Supported,
        "To": parse_To,
        "to_param": parse_to_param,
        "Via": parse_Via,
        "via_parm": parse_via_parm,
        "via_params": parse_via_params,
        "via_ttl": parse_via_ttl,
        "via_maddr": parse_via_maddr,
        "via_received": parse_via_received,
        "via_branch": parse_via_branch,
        "response_port": parse_response_port,
        "sent_protocol": parse_sent_protocol,
        "protocol_name": parse_protocol_name,
        "transport": parse_transport,
        "sent_by": parse_sent_by,
        "via_host": parse_via_host,
        "via_port": parse_via_port,
        "ttl": parse_ttl,
        "WWW_Authenticate": parse_WWW_Authenticate,
        "extension_header": parse_extension_header,
        "header_value": parse_header_value,
        "message_body": parse_message_body,
        "lazy_uri": parse_lazy_uri
      };
      
      if (startRule !== undefined) {
        if (parseFunctions[startRule] === undefined) {
          throw new Error("Invalid rule name: " + quote(startRule) + ".");
        }
      } else {
        startRule = "CRLF";
      }
      
      var pos = 0;
      var reportFailures = 0;
      var rightmostFailuresPos = 0;
      var rightmostFailuresExpected = [];
      
      function padLeft(input, padding, length) {
        var result = input;
        
        var padLength = length - input.length;
        for (var i = 0; i < padLength; i++) {
          result = padding + result;
        }
        
        return result;
      }
      
      function escape(ch) {
        var charCode = ch.charCodeAt(0);
        var escapeChar;
        var length;
        
        if (charCode <= 0xFF) {
          escapeChar = 'x';
          length = 2;
        } else {
          escapeChar = 'u';
          length = 4;
        }
        
        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
      }
      
      function matchFailed(failure) {
        if (pos < rightmostFailuresPos) {
          return;
        }
        
        if (pos > rightmostFailuresPos) {
          rightmostFailuresPos = pos;
          rightmostFailuresExpected = [];
        }
        
        rightmostFailuresExpected.push(failure);
      }
      
      function parse_CRLF() {
        var result0;
        
        if (input.substr(pos, 2) === "\r\n") {
          result0 = "\r\n";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\r\\n\"");
          }
        }
        return result0;
      }
      
      function parse_DIGIT() {
        var result0;
        
        if (/^[0-9]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[0-9]");
          }
        }
        return result0;
      }
      
      function parse_ALPHA() {
        var result0;
        
        if (/^[a-zA-Z]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[a-zA-Z]");
          }
        }
        return result0;
      }
      
      function parse_HEXDIG() {
        var result0;
        
        if (/^[0-9a-fA-F]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[0-9a-fA-F]");
          }
        }
        return result0;
      }
      
      function parse_WSP() {
        var result0;
        
        result0 = parse_SP();
        if (result0 === null) {
          result0 = parse_HTAB();
        }
        return result0;
      }
      
      function parse_OCTET() {
        var result0;
        
        if (/^[\0-\xFF]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[\\0-\\xFF]");
          }
        }
        return result0;
      }
      
      function parse_DQUOTE() {
        var result0;
        
        if (/^["]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[\"]");
          }
        }
        return result0;
      }
      
      function parse_SP() {
        var result0;
        
        if (input.charCodeAt(pos) === 32) {
          result0 = " ";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\" \"");
          }
        }
        return result0;
      }
      
      function parse_HTAB() {
        var result0;
        
        if (input.charCodeAt(pos) === 9) {
          result0 = "\t";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\t\"");
          }
        }
        return result0;
      }
      
      function parse_alphanum() {
        var result0;
        
        if (/^[a-zA-Z0-9]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[a-zA-Z0-9]");
          }
        }
        return result0;
      }
      
      function parse_reserved() {
        var result0;
        
        if (input.charCodeAt(pos) === 59) {
          result0 = ";";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\";\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 47) {
            result0 = "/";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"/\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 63) {
              result0 = "?";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"?\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 58) {
                result0 = ":";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\":\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 64) {
                  result0 = "@";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"@\"");
                  }
                }
                if (result0 === null) {
                  if (input.charCodeAt(pos) === 38) {
                    result0 = "&";
                    pos++;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"&\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.charCodeAt(pos) === 61) {
                      result0 = "=";
                      pos++;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"=\"");
                      }
                    }
                    if (result0 === null) {
                      if (input.charCodeAt(pos) === 43) {
                        result0 = "+";
                        pos++;
                      } else {
                        result0 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"+\"");
                        }
                      }
                      if (result0 === null) {
                        if (input.charCodeAt(pos) === 36) {
                          result0 = "$";
                          pos++;
                        } else {
                          result0 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"$\"");
                          }
                        }
                        if (result0 === null) {
                          if (input.charCodeAt(pos) === 44) {
                            result0 = ",";
                            pos++;
                          } else {
                            result0 = null;
                            if (reportFailures === 0) {
                              matchFailed("\",\"");
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_unreserved() {
        var result0;
        
        result0 = parse_alphanum();
        if (result0 === null) {
          result0 = parse_mark();
        }
        return result0;
      }
      
      function parse_mark() {
        var result0;
        
        if (input.charCodeAt(pos) === 45) {
          result0 = "-";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"-\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 95) {
            result0 = "_";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"_\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 46) {
              result0 = ".";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\".\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 33) {
                result0 = "!";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"!\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 126) {
                  result0 = "~";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"~\"");
                  }
                }
                if (result0 === null) {
                  if (input.charCodeAt(pos) === 42) {
                    result0 = "*";
                    pos++;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"*\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.charCodeAt(pos) === 39) {
                      result0 = "'";
                      pos++;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"'\"");
                      }
                    }
                    if (result0 === null) {
                      if (input.charCodeAt(pos) === 40) {
                        result0 = "(";
                        pos++;
                      } else {
                        result0 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"(\"");
                        }
                      }
                      if (result0 === null) {
                        if (input.charCodeAt(pos) === 41) {
                          result0 = ")";
                          pos++;
                        } else {
                          result0 = null;
                          if (reportFailures === 0) {
                            matchFailed("\")\"");
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_escaped() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        if (input.charCodeAt(pos) === 37) {
          result0 = "%";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"%\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_HEXDIG();
          if (result1 !== null) {
            result2 = parse_HEXDIG();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_LWS() {
        var result0, result1, result2;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        pos2 = pos;
        result0 = [];
        result1 = parse_WSP();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_WSP();
        }
        if (result0 !== null) {
          result1 = parse_CRLF();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos2;
          }
        } else {
          result0 = null;
          pos = pos2;
        }
        result0 = result0 !== null ? result0 : "";
        if (result0 !== null) {
          result2 = parse_WSP();
          if (result2 !== null) {
            result1 = [];
            while (result2 !== null) {
              result1.push(result2);
              result2 = parse_WSP();
            }
          } else {
            result1 = null;
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return " "; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_SWS() {
        var result0;
        
        result0 = parse_LWS();
        result0 = result0 !== null ? result0 : "";
        return result0;
      }
      
      function parse_HCOLON() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = [];
        result1 = parse_SP();
        if (result1 === null) {
          result1 = parse_HTAB();
        }
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_SP();
          if (result1 === null) {
            result1 = parse_HTAB();
          }
        }
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 58) {
            result1 = ":";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_SWS();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return ':'; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_TEXT_UTF8_TRIM() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result1 = parse_TEXT_UTF8char();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_TEXT_UTF8char();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result1 = [];
          pos2 = pos;
          result2 = [];
          result3 = parse_LWS();
          while (result3 !== null) {
            result2.push(result3);
            result3 = parse_LWS();
          }
          if (result2 !== null) {
            result3 = parse_TEXT_UTF8char();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos2;
            }
          } else {
            result2 = null;
            pos = pos2;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos2 = pos;
            result2 = [];
            result3 = parse_LWS();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_LWS();
            }
            if (result2 !== null) {
              result3 = parse_TEXT_UTF8char();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                            return input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_TEXT_UTF8char() {
        var result0;
        
        if (/^[!-~]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[!-~]");
          }
        }
        if (result0 === null) {
          result0 = parse_UTF8_NONASCII();
        }
        return result0;
      }
      
      function parse_UTF8_NONASCII() {
        var result0;
        
        if (/^[\x80-\xFF]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[\\x80-\\xFF]");
          }
        }
        return result0;
      }
      
      function parse_UTF8_CONT() {
        var result0;
        
        if (/^[\x80-\xBF]/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[\\x80-\\xBF]");
          }
        }
        return result0;
      }
      
      function parse_LHEX() {
        var result0;
        
        result0 = parse_DIGIT();
        if (result0 === null) {
          if (/^[a-f]/.test(input.charAt(pos))) {
            result0 = input.charAt(pos);
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("[a-f]");
            }
          }
        }
        return result0;
      }
      
      function parse_token() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_alphanum();
        if (result1 === null) {
          if (input.charCodeAt(pos) === 45) {
            result1 = "-";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"-\"");
            }
          }
          if (result1 === null) {
            if (input.charCodeAt(pos) === 46) {
              result1 = ".";
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\".\"");
              }
            }
            if (result1 === null) {
              if (input.charCodeAt(pos) === 33) {
                result1 = "!";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\"!\"");
                }
              }
              if (result1 === null) {
                if (input.charCodeAt(pos) === 37) {
                  result1 = "%";
                  pos++;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"%\"");
                  }
                }
                if (result1 === null) {
                  if (input.charCodeAt(pos) === 42) {
                    result1 = "*";
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"*\"");
                    }
                  }
                  if (result1 === null) {
                    if (input.charCodeAt(pos) === 95) {
                      result1 = "_";
                      pos++;
                    } else {
                      result1 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"_\"");
                      }
                    }
                    if (result1 === null) {
                      if (input.charCodeAt(pos) === 43) {
                        result1 = "+";
                        pos++;
                      } else {
                        result1 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"+\"");
                        }
                      }
                      if (result1 === null) {
                        if (input.charCodeAt(pos) === 96) {
                          result1 = "`";
                          pos++;
                        } else {
                          result1 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"`\"");
                          }
                        }
                        if (result1 === null) {
                          if (input.charCodeAt(pos) === 39) {
                            result1 = "'";
                            pos++;
                          } else {
                            result1 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"'\"");
                            }
                          }
                          if (result1 === null) {
                            if (input.charCodeAt(pos) === 126) {
                              result1 = "~";
                              pos++;
                            } else {
                              result1 = null;
                              if (reportFailures === 0) {
                                matchFailed("\"~\"");
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_alphanum();
            if (result1 === null) {
              if (input.charCodeAt(pos) === 45) {
                result1 = "-";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\"-\"");
                }
              }
              if (result1 === null) {
                if (input.charCodeAt(pos) === 46) {
                  result1 = ".";
                  pos++;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed("\".\"");
                  }
                }
                if (result1 === null) {
                  if (input.charCodeAt(pos) === 33) {
                    result1 = "!";
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"!\"");
                    }
                  }
                  if (result1 === null) {
                    if (input.charCodeAt(pos) === 37) {
                      result1 = "%";
                      pos++;
                    } else {
                      result1 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"%\"");
                      }
                    }
                    if (result1 === null) {
                      if (input.charCodeAt(pos) === 42) {
                        result1 = "*";
                        pos++;
                      } else {
                        result1 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"*\"");
                        }
                      }
                      if (result1 === null) {
                        if (input.charCodeAt(pos) === 95) {
                          result1 = "_";
                          pos++;
                        } else {
                          result1 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"_\"");
                          }
                        }
                        if (result1 === null) {
                          if (input.charCodeAt(pos) === 43) {
                            result1 = "+";
                            pos++;
                          } else {
                            result1 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"+\"");
                            }
                          }
                          if (result1 === null) {
                            if (input.charCodeAt(pos) === 96) {
                              result1 = "`";
                              pos++;
                            } else {
                              result1 = null;
                              if (reportFailures === 0) {
                                matchFailed("\"`\"");
                              }
                            }
                            if (result1 === null) {
                              if (input.charCodeAt(pos) === 39) {
                                result1 = "'";
                                pos++;
                              } else {
                                result1 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\"'\"");
                                }
                              }
                              if (result1 === null) {
                                if (input.charCodeAt(pos) === 126) {
                                  result1 = "~";
                                  pos++;
                                } else {
                                  result1 = null;
                                  if (reportFailures === 0) {
                                    matchFailed("\"~\"");
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                          return input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_token_nodot() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_alphanum();
        if (result1 === null) {
          if (input.charCodeAt(pos) === 45) {
            result1 = "-";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"-\"");
            }
          }
          if (result1 === null) {
            if (input.charCodeAt(pos) === 33) {
              result1 = "!";
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\"!\"");
              }
            }
            if (result1 === null) {
              if (input.charCodeAt(pos) === 37) {
                result1 = "%";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\"%\"");
                }
              }
              if (result1 === null) {
                if (input.charCodeAt(pos) === 42) {
                  result1 = "*";
                  pos++;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"*\"");
                  }
                }
                if (result1 === null) {
                  if (input.charCodeAt(pos) === 95) {
                    result1 = "_";
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"_\"");
                    }
                  }
                  if (result1 === null) {
                    if (input.charCodeAt(pos) === 43) {
                      result1 = "+";
                      pos++;
                    } else {
                      result1 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"+\"");
                      }
                    }
                    if (result1 === null) {
                      if (input.charCodeAt(pos) === 96) {
                        result1 = "`";
                        pos++;
                      } else {
                        result1 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"`\"");
                        }
                      }
                      if (result1 === null) {
                        if (input.charCodeAt(pos) === 39) {
                          result1 = "'";
                          pos++;
                        } else {
                          result1 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"'\"");
                          }
                        }
                        if (result1 === null) {
                          if (input.charCodeAt(pos) === 126) {
                            result1 = "~";
                            pos++;
                          } else {
                            result1 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"~\"");
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_alphanum();
            if (result1 === null) {
              if (input.charCodeAt(pos) === 45) {
                result1 = "-";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\"-\"");
                }
              }
              if (result1 === null) {
                if (input.charCodeAt(pos) === 33) {
                  result1 = "!";
                  pos++;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"!\"");
                  }
                }
                if (result1 === null) {
                  if (input.charCodeAt(pos) === 37) {
                    result1 = "%";
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"%\"");
                    }
                  }
                  if (result1 === null) {
                    if (input.charCodeAt(pos) === 42) {
                      result1 = "*";
                      pos++;
                    } else {
                      result1 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"*\"");
                      }
                    }
                    if (result1 === null) {
                      if (input.charCodeAt(pos) === 95) {
                        result1 = "_";
                        pos++;
                      } else {
                        result1 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"_\"");
                        }
                      }
                      if (result1 === null) {
                        if (input.charCodeAt(pos) === 43) {
                          result1 = "+";
                          pos++;
                        } else {
                          result1 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"+\"");
                          }
                        }
                        if (result1 === null) {
                          if (input.charCodeAt(pos) === 96) {
                            result1 = "`";
                            pos++;
                          } else {
                            result1 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"`\"");
                            }
                          }
                          if (result1 === null) {
                            if (input.charCodeAt(pos) === 39) {
                              result1 = "'";
                              pos++;
                            } else {
                              result1 = null;
                              if (reportFailures === 0) {
                                matchFailed("\"'\"");
                              }
                            }
                            if (result1 === null) {
                              if (input.charCodeAt(pos) === 126) {
                                result1 = "~";
                                pos++;
                              } else {
                                result1 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\"~\"");
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                          return input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_separators() {
        var result0;
        
        if (input.charCodeAt(pos) === 40) {
          result0 = "(";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"(\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 41) {
            result0 = ")";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\")\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 60) {
              result0 = "<";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"<\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 62) {
                result0 = ">";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\">\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 64) {
                  result0 = "@";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"@\"");
                  }
                }
                if (result0 === null) {
                  if (input.charCodeAt(pos) === 44) {
                    result0 = ",";
                    pos++;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\",\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.charCodeAt(pos) === 59) {
                      result0 = ";";
                      pos++;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\";\"");
                      }
                    }
                    if (result0 === null) {
                      if (input.charCodeAt(pos) === 58) {
                        result0 = ":";
                        pos++;
                      } else {
                        result0 = null;
                        if (reportFailures === 0) {
                          matchFailed("\":\"");
                        }
                      }
                      if (result0 === null) {
                        if (input.charCodeAt(pos) === 92) {
                          result0 = "\\";
                          pos++;
                        } else {
                          result0 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"\\\\\"");
                          }
                        }
                        if (result0 === null) {
                          result0 = parse_DQUOTE();
                          if (result0 === null) {
                            if (input.charCodeAt(pos) === 47) {
                              result0 = "/";
                              pos++;
                            } else {
                              result0 = null;
                              if (reportFailures === 0) {
                                matchFailed("\"/\"");
                              }
                            }
                            if (result0 === null) {
                              if (input.charCodeAt(pos) === 91) {
                                result0 = "[";
                                pos++;
                              } else {
                                result0 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\"[\"");
                                }
                              }
                              if (result0 === null) {
                                if (input.charCodeAt(pos) === 93) {
                                  result0 = "]";
                                  pos++;
                                } else {
                                  result0 = null;
                                  if (reportFailures === 0) {
                                    matchFailed("\"]\"");
                                  }
                                }
                                if (result0 === null) {
                                  if (input.charCodeAt(pos) === 63) {
                                    result0 = "?";
                                    pos++;
                                  } else {
                                    result0 = null;
                                    if (reportFailures === 0) {
                                      matchFailed("\"?\"");
                                    }
                                  }
                                  if (result0 === null) {
                                    if (input.charCodeAt(pos) === 61) {
                                      result0 = "=";
                                      pos++;
                                    } else {
                                      result0 = null;
                                      if (reportFailures === 0) {
                                        matchFailed("\"=\"");
                                      }
                                    }
                                    if (result0 === null) {
                                      if (input.charCodeAt(pos) === 123) {
                                        result0 = "{";
                                        pos++;
                                      } else {
                                        result0 = null;
                                        if (reportFailures === 0) {
                                          matchFailed("\"{\"");
                                        }
                                      }
                                      if (result0 === null) {
                                        if (input.charCodeAt(pos) === 125) {
                                          result0 = "}";
                                          pos++;
                                        } else {
                                          result0 = null;
                                          if (reportFailures === 0) {
                                            matchFailed("\"}\"");
                                          }
                                        }
                                        if (result0 === null) {
                                          result0 = parse_SP();
                                          if (result0 === null) {
                                            result0 = parse_HTAB();
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_word() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_alphanum();
        if (result1 === null) {
          if (input.charCodeAt(pos) === 45) {
            result1 = "-";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"-\"");
            }
          }
          if (result1 === null) {
            if (input.charCodeAt(pos) === 46) {
              result1 = ".";
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\".\"");
              }
            }
            if (result1 === null) {
              if (input.charCodeAt(pos) === 33) {
                result1 = "!";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\"!\"");
                }
              }
              if (result1 === null) {
                if (input.charCodeAt(pos) === 37) {
                  result1 = "%";
                  pos++;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"%\"");
                  }
                }
                if (result1 === null) {
                  if (input.charCodeAt(pos) === 42) {
                    result1 = "*";
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"*\"");
                    }
                  }
                  if (result1 === null) {
                    if (input.charCodeAt(pos) === 95) {
                      result1 = "_";
                      pos++;
                    } else {
                      result1 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"_\"");
                      }
                    }
                    if (result1 === null) {
                      if (input.charCodeAt(pos) === 43) {
                        result1 = "+";
                        pos++;
                      } else {
                        result1 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"+\"");
                        }
                      }
                      if (result1 === null) {
                        if (input.charCodeAt(pos) === 96) {
                          result1 = "`";
                          pos++;
                        } else {
                          result1 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"`\"");
                          }
                        }
                        if (result1 === null) {
                          if (input.charCodeAt(pos) === 39) {
                            result1 = "'";
                            pos++;
                          } else {
                            result1 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"'\"");
                            }
                          }
                          if (result1 === null) {
                            if (input.charCodeAt(pos) === 126) {
                              result1 = "~";
                              pos++;
                            } else {
                              result1 = null;
                              if (reportFailures === 0) {
                                matchFailed("\"~\"");
                              }
                            }
                            if (result1 === null) {
                              if (input.charCodeAt(pos) === 40) {
                                result1 = "(";
                                pos++;
                              } else {
                                result1 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\"(\"");
                                }
                              }
                              if (result1 === null) {
                                if (input.charCodeAt(pos) === 41) {
                                  result1 = ")";
                                  pos++;
                                } else {
                                  result1 = null;
                                  if (reportFailures === 0) {
                                    matchFailed("\")\"");
                                  }
                                }
                                if (result1 === null) {
                                  if (input.charCodeAt(pos) === 60) {
                                    result1 = "<";
                                    pos++;
                                  } else {
                                    result1 = null;
                                    if (reportFailures === 0) {
                                      matchFailed("\"<\"");
                                    }
                                  }
                                  if (result1 === null) {
                                    if (input.charCodeAt(pos) === 62) {
                                      result1 = ">";
                                      pos++;
                                    } else {
                                      result1 = null;
                                      if (reportFailures === 0) {
                                        matchFailed("\">\"");
                                      }
                                    }
                                    if (result1 === null) {
                                      if (input.charCodeAt(pos) === 58) {
                                        result1 = ":";
                                        pos++;
                                      } else {
                                        result1 = null;
                                        if (reportFailures === 0) {
                                          matchFailed("\":\"");
                                        }
                                      }
                                      if (result1 === null) {
                                        if (input.charCodeAt(pos) === 92) {
                                          result1 = "\\";
                                          pos++;
                                        } else {
                                          result1 = null;
                                          if (reportFailures === 0) {
                                            matchFailed("\"\\\\\"");
                                          }
                                        }
                                        if (result1 === null) {
                                          result1 = parse_DQUOTE();
                                          if (result1 === null) {
                                            if (input.charCodeAt(pos) === 47) {
                                              result1 = "/";
                                              pos++;
                                            } else {
                                              result1 = null;
                                              if (reportFailures === 0) {
                                                matchFailed("\"/\"");
                                              }
                                            }
                                            if (result1 === null) {
                                              if (input.charCodeAt(pos) === 91) {
                                                result1 = "[";
                                                pos++;
                                              } else {
                                                result1 = null;
                                                if (reportFailures === 0) {
                                                  matchFailed("\"[\"");
                                                }
                                              }
                                              if (result1 === null) {
                                                if (input.charCodeAt(pos) === 93) {
                                                  result1 = "]";
                                                  pos++;
                                                } else {
                                                  result1 = null;
                                                  if (reportFailures === 0) {
                                                    matchFailed("\"]\"");
                                                  }
                                                }
                                                if (result1 === null) {
                                                  if (input.charCodeAt(pos) === 63) {
                                                    result1 = "?";
                                                    pos++;
                                                  } else {
                                                    result1 = null;
                                                    if (reportFailures === 0) {
                                                      matchFailed("\"?\"");
                                                    }
                                                  }
                                                  if (result1 === null) {
                                                    if (input.charCodeAt(pos) === 123) {
                                                      result1 = "{";
                                                      pos++;
                                                    } else {
                                                      result1 = null;
                                                      if (reportFailures === 0) {
                                                        matchFailed("\"{\"");
                                                      }
                                                    }
                                                    if (result1 === null) {
                                                      if (input.charCodeAt(pos) === 125) {
                                                        result1 = "}";
                                                        pos++;
                                                      } else {
                                                        result1 = null;
                                                        if (reportFailures === 0) {
                                                          matchFailed("\"}\"");
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_alphanum();
            if (result1 === null) {
              if (input.charCodeAt(pos) === 45) {
                result1 = "-";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\"-\"");
                }
              }
              if (result1 === null) {
                if (input.charCodeAt(pos) === 46) {
                  result1 = ".";
                  pos++;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed("\".\"");
                  }
                }
                if (result1 === null) {
                  if (input.charCodeAt(pos) === 33) {
                    result1 = "!";
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"!\"");
                    }
                  }
                  if (result1 === null) {
                    if (input.charCodeAt(pos) === 37) {
                      result1 = "%";
                      pos++;
                    } else {
                      result1 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"%\"");
                      }
                    }
                    if (result1 === null) {
                      if (input.charCodeAt(pos) === 42) {
                        result1 = "*";
                        pos++;
                      } else {
                        result1 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"*\"");
                        }
                      }
                      if (result1 === null) {
                        if (input.charCodeAt(pos) === 95) {
                          result1 = "_";
                          pos++;
                        } else {
                          result1 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"_\"");
                          }
                        }
                        if (result1 === null) {
                          if (input.charCodeAt(pos) === 43) {
                            result1 = "+";
                            pos++;
                          } else {
                            result1 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"+\"");
                            }
                          }
                          if (result1 === null) {
                            if (input.charCodeAt(pos) === 96) {
                              result1 = "`";
                              pos++;
                            } else {
                              result1 = null;
                              if (reportFailures === 0) {
                                matchFailed("\"`\"");
                              }
                            }
                            if (result1 === null) {
                              if (input.charCodeAt(pos) === 39) {
                                result1 = "'";
                                pos++;
                              } else {
                                result1 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\"'\"");
                                }
                              }
                              if (result1 === null) {
                                if (input.charCodeAt(pos) === 126) {
                                  result1 = "~";
                                  pos++;
                                } else {
                                  result1 = null;
                                  if (reportFailures === 0) {
                                    matchFailed("\"~\"");
                                  }
                                }
                                if (result1 === null) {
                                  if (input.charCodeAt(pos) === 40) {
                                    result1 = "(";
                                    pos++;
                                  } else {
                                    result1 = null;
                                    if (reportFailures === 0) {
                                      matchFailed("\"(\"");
                                    }
                                  }
                                  if (result1 === null) {
                                    if (input.charCodeAt(pos) === 41) {
                                      result1 = ")";
                                      pos++;
                                    } else {
                                      result1 = null;
                                      if (reportFailures === 0) {
                                        matchFailed("\")\"");
                                      }
                                    }
                                    if (result1 === null) {
                                      if (input.charCodeAt(pos) === 60) {
                                        result1 = "<";
                                        pos++;
                                      } else {
                                        result1 = null;
                                        if (reportFailures === 0) {
                                          matchFailed("\"<\"");
                                        }
                                      }
                                      if (result1 === null) {
                                        if (input.charCodeAt(pos) === 62) {
                                          result1 = ">";
                                          pos++;
                                        } else {
                                          result1 = null;
                                          if (reportFailures === 0) {
                                            matchFailed("\">\"");
                                          }
                                        }
                                        if (result1 === null) {
                                          if (input.charCodeAt(pos) === 58) {
                                            result1 = ":";
                                            pos++;
                                          } else {
                                            result1 = null;
                                            if (reportFailures === 0) {
                                              matchFailed("\":\"");
                                            }
                                          }
                                          if (result1 === null) {
                                            if (input.charCodeAt(pos) === 92) {
                                              result1 = "\\";
                                              pos++;
                                            } else {
                                              result1 = null;
                                              if (reportFailures === 0) {
                                                matchFailed("\"\\\\\"");
                                              }
                                            }
                                            if (result1 === null) {
                                              result1 = parse_DQUOTE();
                                              if (result1 === null) {
                                                if (input.charCodeAt(pos) === 47) {
                                                  result1 = "/";
                                                  pos++;
                                                } else {
                                                  result1 = null;
                                                  if (reportFailures === 0) {
                                                    matchFailed("\"/\"");
                                                  }
                                                }
                                                if (result1 === null) {
                                                  if (input.charCodeAt(pos) === 91) {
                                                    result1 = "[";
                                                    pos++;
                                                  } else {
                                                    result1 = null;
                                                    if (reportFailures === 0) {
                                                      matchFailed("\"[\"");
                                                    }
                                                  }
                                                  if (result1 === null) {
                                                    if (input.charCodeAt(pos) === 93) {
                                                      result1 = "]";
                                                      pos++;
                                                    } else {
                                                      result1 = null;
                                                      if (reportFailures === 0) {
                                                        matchFailed("\"]\"");
                                                      }
                                                    }
                                                    if (result1 === null) {
                                                      if (input.charCodeAt(pos) === 63) {
                                                        result1 = "?";
                                                        pos++;
                                                      } else {
                                                        result1 = null;
                                                        if (reportFailures === 0) {
                                                          matchFailed("\"?\"");
                                                        }
                                                      }
                                                      if (result1 === null) {
                                                        if (input.charCodeAt(pos) === 123) {
                                                          result1 = "{";
                                                          pos++;
                                                        } else {
                                                          result1 = null;
                                                          if (reportFailures === 0) {
                                                            matchFailed("\"{\"");
                                                          }
                                                        }
                                                        if (result1 === null) {
                                                          if (input.charCodeAt(pos) === 125) {
                                                            result1 = "}";
                                                            pos++;
                                                          } else {
                                                            result1 = null;
                                                            if (reportFailures === 0) {
                                                              matchFailed("\"}\"");
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                          return input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_STAR() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SWS();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 42) {
            result1 = "*";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"*\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_SWS();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return "*"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_SLASH() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SWS();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 47) {
            result1 = "/";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"/\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_SWS();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return "/"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_EQUAL() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SWS();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 61) {
            result1 = "=";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"=\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_SWS();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return "="; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_LPAREN() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SWS();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 40) {
            result1 = "(";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"(\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_SWS();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return "("; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_RPAREN() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SWS();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 41) {
            result1 = ")";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\")\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_SWS();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return ")"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_RAQUOT() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 62) {
          result0 = ">";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\">\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_SWS();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return ">"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_LAQUOT() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SWS();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 60) {
            result1 = "<";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"<\"");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return "<"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_COMMA() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SWS();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 44) {
            result1 = ",";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\",\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_SWS();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return ","; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_SEMI() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SWS();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 59) {
            result1 = ";";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\";\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_SWS();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return ";"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_COLON() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SWS();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 58) {
            result1 = ":";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_SWS();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return ":"; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_LDQUOT() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SWS();
        if (result0 !== null) {
          result1 = parse_DQUOTE();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return "\""; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_RDQUOT() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_DQUOTE();
        if (result0 !== null) {
          result1 = parse_SWS();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {return "\""; })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_comment() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        result0 = parse_LPAREN();
        if (result0 !== null) {
          result1 = [];
          result2 = parse_ctext();
          if (result2 === null) {
            result2 = parse_quoted_pair();
            if (result2 === null) {
              result2 = parse_comment();
            }
          }
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_ctext();
            if (result2 === null) {
              result2 = parse_quoted_pair();
              if (result2 === null) {
                result2 = parse_comment();
              }
            }
          }
          if (result1 !== null) {
            result2 = parse_RPAREN();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ctext() {
        var result0;
        
        if (/^[!-']/.test(input.charAt(pos))) {
          result0 = input.charAt(pos);
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("[!-']");
          }
        }
        if (result0 === null) {
          if (/^[*-[]/.test(input.charAt(pos))) {
            result0 = input.charAt(pos);
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("[*-[]");
            }
          }
          if (result0 === null) {
            if (/^[\]-~]/.test(input.charAt(pos))) {
              result0 = input.charAt(pos);
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("[\\]-~]");
              }
            }
            if (result0 === null) {
              result0 = parse_UTF8_NONASCII();
              if (result0 === null) {
                result0 = parse_LWS();
              }
            }
          }
        }
        return result0;
      }
      
      function parse_quoted_string() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_SWS();
        if (result0 !== null) {
          result1 = parse_DQUOTE();
          if (result1 !== null) {
            result2 = [];
            result3 = parse_qdtext();
            if (result3 === null) {
              result3 = parse_quoted_pair();
            }
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_qdtext();
              if (result3 === null) {
                result3 = parse_quoted_pair();
              }
            }
            if (result2 !== null) {
              result3 = parse_DQUOTE();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                          return input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_qdtext() {
        var result0;
        
        result0 = parse_LWS();
        if (result0 === null) {
          if (input.charCodeAt(pos) === 33) {
            result0 = "!";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"!\"");
            }
          }
          if (result0 === null) {
            if (/^[#-[]/.test(input.charAt(pos))) {
              result0 = input.charAt(pos);
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("[#-[]");
              }
            }
            if (result0 === null) {
              if (/^[\]-~]/.test(input.charAt(pos))) {
                result0 = input.charAt(pos);
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("[\\]-~]");
                }
              }
              if (result0 === null) {
                result0 = parse_UTF8_NONASCII();
              }
            }
          }
        }
        return result0;
      }
      
      function parse_quoted_pair() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        if (input.charCodeAt(pos) === 92) {
          result0 = "\\";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"\\\\\"");
          }
        }
        if (result0 !== null) {
          if (/^[\0-\t]/.test(input.charAt(pos))) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("[\\0-\\t]");
            }
          }
          if (result1 === null) {
            if (/^[\x0B-\f]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[\\x0B-\\f]");
              }
            }
            if (result1 === null) {
              if (/^[\x0E-]/.test(input.charAt(pos))) {
                result1 = input.charAt(pos);
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("[\\x0E-]");
                }
              }
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_SIP_URI_simple() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_uri_scheme();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 58) {
            result1 = ":";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_userinfo();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse_hostport();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                            data.uri = input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_SIP_URI() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_uri_scheme();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 58) {
            result1 = ":";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_userinfo();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse_hostport();
              if (result3 !== null) {
                result4 = parse_uri_parameters();
                if (result4 !== null) {
                  result5 = parse_headers();
                  result5 = result5 !== null ? result5 : "";
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                            data.uri = input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_uri_scheme() {
        var result0;
        var pos0;
        
        pos0 = pos;
        if (input.substr(pos, 3) === "sip") {
          result0 = "sip";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"sip\"");
          }
        }
        if (result0 !== null) {
          result0 = (function(offset, uri_scheme) {
                            data.scheme = uri_scheme; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_userinfo() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result0 = parse_user();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 64) {
            result1 = "@";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"@\"");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_user() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_unreserved();
        if (result1 === null) {
          result1 = parse_escaped();
          if (result1 === null) {
            result1 = parse_user_unreserved();
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_unreserved();
            if (result1 === null) {
              result1 = parse_escaped();
              if (result1 === null) {
                result1 = parse_user_unreserved();
              }
            }
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                            data.user = input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_user_unreserved() {
        var result0;
        
        if (input.charCodeAt(pos) === 38) {
          result0 = "&";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"&\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 61) {
            result0 = "=";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"=\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 43) {
              result0 = "+";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"+\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 36) {
                result0 = "$";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"$\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 44) {
                  result0 = ",";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\",\"");
                  }
                }
                if (result0 === null) {
                  if (input.charCodeAt(pos) === 59) {
                    result0 = ";";
                    pos++;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\";\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.charCodeAt(pos) === 63) {
                      result0 = "?";
                      pos++;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"?\"");
                      }
                    }
                    if (result0 === null) {
                      if (input.charCodeAt(pos) === 47) {
                        result0 = "/";
                        pos++;
                      } else {
                        result0 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"/\"");
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_password() {
        var result0, result1;
        
        result0 = [];
        result1 = parse_unreserved();
        if (result1 === null) {
          result1 = parse_escaped();
          if (result1 === null) {
            if (input.charCodeAt(pos) === 38) {
              result1 = "&";
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\"&\"");
              }
            }
            if (result1 === null) {
              if (input.charCodeAt(pos) === 61) {
                result1 = "=";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\"=\"");
                }
              }
              if (result1 === null) {
                if (input.charCodeAt(pos) === 43) {
                  result1 = "+";
                  pos++;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"+\"");
                  }
                }
                if (result1 === null) {
                  if (input.charCodeAt(pos) === 36) {
                    result1 = "$";
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"$\"");
                    }
                  }
                  if (result1 === null) {
                    if (input.charCodeAt(pos) === 44) {
                      result1 = ",";
                      pos++;
                    } else {
                      result1 = null;
                      if (reportFailures === 0) {
                        matchFailed("\",\"");
                      }
                    }
                  }
                }
              }
            }
          }
        }
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_unreserved();
          if (result1 === null) {
            result1 = parse_escaped();
            if (result1 === null) {
              if (input.charCodeAt(pos) === 38) {
                result1 = "&";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\"&\"");
                }
              }
              if (result1 === null) {
                if (input.charCodeAt(pos) === 61) {
                  result1 = "=";
                  pos++;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"=\"");
                  }
                }
                if (result1 === null) {
                  if (input.charCodeAt(pos) === 43) {
                    result1 = "+";
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"+\"");
                    }
                  }
                  if (result1 === null) {
                    if (input.charCodeAt(pos) === 36) {
                      result1 = "$";
                      pos++;
                    } else {
                      result1 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"$\"");
                      }
                    }
                    if (result1 === null) {
                      if (input.charCodeAt(pos) === 44) {
                        result1 = ",";
                        pos++;
                      } else {
                        result1 = null;
                        if (reportFailures === 0) {
                          matchFailed("\",\"");
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_hostport() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_host();
        if (result0 !== null) {
          pos1 = pos;
          if (input.charCodeAt(pos) === 58) {
            result1 = ":";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_port();
            if (result2 !== null) {
              result1 = [result1, result2];
            } else {
              result1 = null;
              pos = pos1;
            }
          } else {
            result1 = null;
            pos = pos1;
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_host() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_hostname();
        if (result0 === null) {
          result0 = parse_IPv4address();
          if (result0 === null) {
            result0 = parse_IPv6reference();
          }
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                            data.host = input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_hostname() {
        var result0, result1, result2;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = [];
        pos2 = pos;
        result1 = parse_domainlabel();
        if (result1 !== null) {
          if (input.charCodeAt(pos) === 46) {
            result2 = ".";
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\".\"");
            }
          }
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos2;
          }
        } else {
          result1 = null;
          pos = pos2;
        }
        while (result1 !== null) {
          result0.push(result1);
          pos2 = pos;
          result1 = parse_domainlabel();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 46) {
              result2 = ".";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\".\"");
              }
            }
            if (result2 !== null) {
              result1 = [result1, result2];
            } else {
              result1 = null;
              pos = pos2;
            }
          } else {
            result1 = null;
            pos = pos2;
          }
        }
        if (result0 !== null) {
          result1 = parse_toplabel();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 46) {
              result2 = ".";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\".\"");
              }
            }
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                          data.host_type = 'domain';
                          return input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_domainlabel() {
        var result0, result1;
        
        if (/^[a-zA-Z0-9_\-]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[a-zA-Z0-9_\\-]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[a-zA-Z0-9_\-]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[a-zA-Z0-9_\\-]");
              }
            }
          }
        } else {
          result0 = null;
        }
        return result0;
      }
      
      function parse_toplabel() {
        var result0, result1;
        
        if (/^[a-zA-Z_\-]/.test(input.charAt(pos))) {
          result1 = input.charAt(pos);
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("[a-zA-Z_\\-]");
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            if (/^[a-zA-Z_\-]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[a-zA-Z_\\-]");
              }
            }
          }
        } else {
          result0 = null;
        }
        return result0;
      }
      
      function parse_IPv6reference() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 91) {
          result0 = "[";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"[\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_IPv6address();
          if (result1 !== null) {
            if (input.charCodeAt(pos) === 93) {
              result2 = "]";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"]\"");
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                            data.host_type = 'IPv6';
                            return input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_IPv6address() {
        var result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11, result12;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_h16();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 58) {
            result1 = ":";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_h16();
            if (result2 !== null) {
              if (input.charCodeAt(pos) === 58) {
                result3 = ":";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\":\"");
                }
              }
              if (result3 !== null) {
                result4 = parse_h16();
                if (result4 !== null) {
                  if (input.charCodeAt(pos) === 58) {
                    result5 = ":";
                    pos++;
                  } else {
                    result5 = null;
                    if (reportFailures === 0) {
                      matchFailed("\":\"");
                    }
                  }
                  if (result5 !== null) {
                    result6 = parse_h16();
                    if (result6 !== null) {
                      if (input.charCodeAt(pos) === 58) {
                        result7 = ":";
                        pos++;
                      } else {
                        result7 = null;
                        if (reportFailures === 0) {
                          matchFailed("\":\"");
                        }
                      }
                      if (result7 !== null) {
                        result8 = parse_h16();
                        if (result8 !== null) {
                          if (input.charCodeAt(pos) === 58) {
                            result9 = ":";
                            pos++;
                          } else {
                            result9 = null;
                            if (reportFailures === 0) {
                              matchFailed("\":\"");
                            }
                          }
                          if (result9 !== null) {
                            result10 = parse_h16();
                            if (result10 !== null) {
                              if (input.charCodeAt(pos) === 58) {
                                result11 = ":";
                                pos++;
                              } else {
                                result11 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\":\"");
                                }
                              }
                              if (result11 !== null) {
                                result12 = parse_ls32();
                                if (result12 !== null) {
                                  result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11, result12];
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 === null) {
          pos1 = pos;
          if (input.substr(pos, 2) === "::") {
            result0 = "::";
            pos += 2;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"::\"");
            }
          }
          if (result0 !== null) {
            result1 = parse_h16();
            if (result1 !== null) {
              if (input.charCodeAt(pos) === 58) {
                result2 = ":";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\":\"");
                }
              }
              if (result2 !== null) {
                result3 = parse_h16();
                if (result3 !== null) {
                  if (input.charCodeAt(pos) === 58) {
                    result4 = ":";
                    pos++;
                  } else {
                    result4 = null;
                    if (reportFailures === 0) {
                      matchFailed("\":\"");
                    }
                  }
                  if (result4 !== null) {
                    result5 = parse_h16();
                    if (result5 !== null) {
                      if (input.charCodeAt(pos) === 58) {
                        result6 = ":";
                        pos++;
                      } else {
                        result6 = null;
                        if (reportFailures === 0) {
                          matchFailed("\":\"");
                        }
                      }
                      if (result6 !== null) {
                        result7 = parse_h16();
                        if (result7 !== null) {
                          if (input.charCodeAt(pos) === 58) {
                            result8 = ":";
                            pos++;
                          } else {
                            result8 = null;
                            if (reportFailures === 0) {
                              matchFailed("\":\"");
                            }
                          }
                          if (result8 !== null) {
                            result9 = parse_h16();
                            if (result9 !== null) {
                              if (input.charCodeAt(pos) === 58) {
                                result10 = ":";
                                pos++;
                              } else {
                                result10 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\":\"");
                                }
                              }
                              if (result10 !== null) {
                                result11 = parse_ls32();
                                if (result11 !== null) {
                                  result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11];
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 === null) {
            pos1 = pos;
            if (input.substr(pos, 2) === "::") {
              result0 = "::";
              pos += 2;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"::\"");
              }
            }
            if (result0 !== null) {
              result1 = parse_h16();
              if (result1 !== null) {
                if (input.charCodeAt(pos) === 58) {
                  result2 = ":";
                  pos++;
                } else {
                  result2 = null;
                  if (reportFailures === 0) {
                    matchFailed("\":\"");
                  }
                }
                if (result2 !== null) {
                  result3 = parse_h16();
                  if (result3 !== null) {
                    if (input.charCodeAt(pos) === 58) {
                      result4 = ":";
                      pos++;
                    } else {
                      result4 = null;
                      if (reportFailures === 0) {
                        matchFailed("\":\"");
                      }
                    }
                    if (result4 !== null) {
                      result5 = parse_h16();
                      if (result5 !== null) {
                        if (input.charCodeAt(pos) === 58) {
                          result6 = ":";
                          pos++;
                        } else {
                          result6 = null;
                          if (reportFailures === 0) {
                            matchFailed("\":\"");
                          }
                        }
                        if (result6 !== null) {
                          result7 = parse_h16();
                          if (result7 !== null) {
                            if (input.charCodeAt(pos) === 58) {
                              result8 = ":";
                              pos++;
                            } else {
                              result8 = null;
                              if (reportFailures === 0) {
                                matchFailed("\":\"");
                              }
                            }
                            if (result8 !== null) {
                              result9 = parse_ls32();
                              if (result9 !== null) {
                                result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9];
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 === null) {
              pos1 = pos;
              if (input.substr(pos, 2) === "::") {
                result0 = "::";
                pos += 2;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"::\"");
                }
              }
              if (result0 !== null) {
                result1 = parse_h16();
                if (result1 !== null) {
                  if (input.charCodeAt(pos) === 58) {
                    result2 = ":";
                    pos++;
                  } else {
                    result2 = null;
                    if (reportFailures === 0) {
                      matchFailed("\":\"");
                    }
                  }
                  if (result2 !== null) {
                    result3 = parse_h16();
                    if (result3 !== null) {
                      if (input.charCodeAt(pos) === 58) {
                        result4 = ":";
                        pos++;
                      } else {
                        result4 = null;
                        if (reportFailures === 0) {
                          matchFailed("\":\"");
                        }
                      }
                      if (result4 !== null) {
                        result5 = parse_h16();
                        if (result5 !== null) {
                          if (input.charCodeAt(pos) === 58) {
                            result6 = ":";
                            pos++;
                          } else {
                            result6 = null;
                            if (reportFailures === 0) {
                              matchFailed("\":\"");
                            }
                          }
                          if (result6 !== null) {
                            result7 = parse_ls32();
                            if (result7 !== null) {
                              result0 = [result0, result1, result2, result3, result4, result5, result6, result7];
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
              if (result0 === null) {
                pos1 = pos;
                if (input.substr(pos, 2) === "::") {
                  result0 = "::";
                  pos += 2;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"::\"");
                  }
                }
                if (result0 !== null) {
                  result1 = parse_h16();
                  if (result1 !== null) {
                    if (input.charCodeAt(pos) === 58) {
                      result2 = ":";
                      pos++;
                    } else {
                      result2 = null;
                      if (reportFailures === 0) {
                        matchFailed("\":\"");
                      }
                    }
                    if (result2 !== null) {
                      result3 = parse_h16();
                      if (result3 !== null) {
                        if (input.charCodeAt(pos) === 58) {
                          result4 = ":";
                          pos++;
                        } else {
                          result4 = null;
                          if (reportFailures === 0) {
                            matchFailed("\":\"");
                          }
                        }
                        if (result4 !== null) {
                          result5 = parse_ls32();
                          if (result5 !== null) {
                            result0 = [result0, result1, result2, result3, result4, result5];
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
                if (result0 === null) {
                  pos1 = pos;
                  if (input.substr(pos, 2) === "::") {
                    result0 = "::";
                    pos += 2;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"::\"");
                    }
                  }
                  if (result0 !== null) {
                    result1 = parse_h16();
                    if (result1 !== null) {
                      if (input.charCodeAt(pos) === 58) {
                        result2 = ":";
                        pos++;
                      } else {
                        result2 = null;
                        if (reportFailures === 0) {
                          matchFailed("\":\"");
                        }
                      }
                      if (result2 !== null) {
                        result3 = parse_ls32();
                        if (result3 !== null) {
                          result0 = [result0, result1, result2, result3];
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                  if (result0 === null) {
                    pos1 = pos;
                    if (input.substr(pos, 2) === "::") {
                      result0 = "::";
                      pos += 2;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"::\"");
                      }
                    }
                    if (result0 !== null) {
                      result1 = parse_ls32();
                      if (result1 !== null) {
                        result0 = [result0, result1];
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                    if (result0 === null) {
                      pos1 = pos;
                      if (input.substr(pos, 2) === "::") {
                        result0 = "::";
                        pos += 2;
                      } else {
                        result0 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"::\"");
                        }
                      }
                      if (result0 !== null) {
                        result1 = parse_h16();
                        if (result1 !== null) {
                          result0 = [result0, result1];
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                      } else {
                        result0 = null;
                        pos = pos1;
                      }
                      if (result0 === null) {
                        pos1 = pos;
                        result0 = parse_h16();
                        if (result0 !== null) {
                          if (input.substr(pos, 2) === "::") {
                            result1 = "::";
                            pos += 2;
                          } else {
                            result1 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"::\"");
                            }
                          }
                          if (result1 !== null) {
                            result2 = parse_h16();
                            if (result2 !== null) {
                              if (input.charCodeAt(pos) === 58) {
                                result3 = ":";
                                pos++;
                              } else {
                                result3 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\":\"");
                                }
                              }
                              if (result3 !== null) {
                                result4 = parse_h16();
                                if (result4 !== null) {
                                  if (input.charCodeAt(pos) === 58) {
                                    result5 = ":";
                                    pos++;
                                  } else {
                                    result5 = null;
                                    if (reportFailures === 0) {
                                      matchFailed("\":\"");
                                    }
                                  }
                                  if (result5 !== null) {
                                    result6 = parse_h16();
                                    if (result6 !== null) {
                                      if (input.charCodeAt(pos) === 58) {
                                        result7 = ":";
                                        pos++;
                                      } else {
                                        result7 = null;
                                        if (reportFailures === 0) {
                                          matchFailed("\":\"");
                                        }
                                      }
                                      if (result7 !== null) {
                                        result8 = parse_h16();
                                        if (result8 !== null) {
                                          if (input.charCodeAt(pos) === 58) {
                                            result9 = ":";
                                            pos++;
                                          } else {
                                            result9 = null;
                                            if (reportFailures === 0) {
                                              matchFailed("\":\"");
                                            }
                                          }
                                          if (result9 !== null) {
                                            result10 = parse_ls32();
                                            if (result10 !== null) {
                                              result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9, result10];
                                            } else {
                                              result0 = null;
                                              pos = pos1;
                                            }
                                          } else {
                                            result0 = null;
                                            pos = pos1;
                                          }
                                        } else {
                                          result0 = null;
                                          pos = pos1;
                                        }
                                      } else {
                                        result0 = null;
                                        pos = pos1;
                                      }
                                    } else {
                                      result0 = null;
                                      pos = pos1;
                                    }
                                  } else {
                                    result0 = null;
                                    pos = pos1;
                                  }
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                        } else {
                          result0 = null;
                          pos = pos1;
                        }
                        if (result0 === null) {
                          pos1 = pos;
                          result0 = parse_h16();
                          if (result0 !== null) {
                            pos2 = pos;
                            if (input.charCodeAt(pos) === 58) {
                              result1 = ":";
                              pos++;
                            } else {
                              result1 = null;
                              if (reportFailures === 0) {
                                matchFailed("\":\"");
                              }
                            }
                            if (result1 !== null) {
                              result2 = parse_h16();
                              if (result2 !== null) {
                                result1 = [result1, result2];
                              } else {
                                result1 = null;
                                pos = pos2;
                              }
                            } else {
                              result1 = null;
                              pos = pos2;
                            }
                            result1 = result1 !== null ? result1 : "";
                            if (result1 !== null) {
                              if (input.substr(pos, 2) === "::") {
                                result2 = "::";
                                pos += 2;
                              } else {
                                result2 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\"::\"");
                                }
                              }
                              if (result2 !== null) {
                                result3 = parse_h16();
                                if (result3 !== null) {
                                  if (input.charCodeAt(pos) === 58) {
                                    result4 = ":";
                                    pos++;
                                  } else {
                                    result4 = null;
                                    if (reportFailures === 0) {
                                      matchFailed("\":\"");
                                    }
                                  }
                                  if (result4 !== null) {
                                    result5 = parse_h16();
                                    if (result5 !== null) {
                                      if (input.charCodeAt(pos) === 58) {
                                        result6 = ":";
                                        pos++;
                                      } else {
                                        result6 = null;
                                        if (reportFailures === 0) {
                                          matchFailed("\":\"");
                                        }
                                      }
                                      if (result6 !== null) {
                                        result7 = parse_h16();
                                        if (result7 !== null) {
                                          if (input.charCodeAt(pos) === 58) {
                                            result8 = ":";
                                            pos++;
                                          } else {
                                            result8 = null;
                                            if (reportFailures === 0) {
                                              matchFailed("\":\"");
                                            }
                                          }
                                          if (result8 !== null) {
                                            result9 = parse_ls32();
                                            if (result9 !== null) {
                                              result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8, result9];
                                            } else {
                                              result0 = null;
                                              pos = pos1;
                                            }
                                          } else {
                                            result0 = null;
                                            pos = pos1;
                                          }
                                        } else {
                                          result0 = null;
                                          pos = pos1;
                                        }
                                      } else {
                                        result0 = null;
                                        pos = pos1;
                                      }
                                    } else {
                                      result0 = null;
                                      pos = pos1;
                                    }
                                  } else {
                                    result0 = null;
                                    pos = pos1;
                                  }
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                          } else {
                            result0 = null;
                            pos = pos1;
                          }
                          if (result0 === null) {
                            pos1 = pos;
                            result0 = parse_h16();
                            if (result0 !== null) {
                              pos2 = pos;
                              if (input.charCodeAt(pos) === 58) {
                                result1 = ":";
                                pos++;
                              } else {
                                result1 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\":\"");
                                }
                              }
                              if (result1 !== null) {
                                result2 = parse_h16();
                                if (result2 !== null) {
                                  result1 = [result1, result2];
                                } else {
                                  result1 = null;
                                  pos = pos2;
                                }
                              } else {
                                result1 = null;
                                pos = pos2;
                              }
                              result1 = result1 !== null ? result1 : "";
                              if (result1 !== null) {
                                pos2 = pos;
                                if (input.charCodeAt(pos) === 58) {
                                  result2 = ":";
                                  pos++;
                                } else {
                                  result2 = null;
                                  if (reportFailures === 0) {
                                    matchFailed("\":\"");
                                  }
                                }
                                if (result2 !== null) {
                                  result3 = parse_h16();
                                  if (result3 !== null) {
                                    result2 = [result2, result3];
                                  } else {
                                    result2 = null;
                                    pos = pos2;
                                  }
                                } else {
                                  result2 = null;
                                  pos = pos2;
                                }
                                result2 = result2 !== null ? result2 : "";
                                if (result2 !== null) {
                                  if (input.substr(pos, 2) === "::") {
                                    result3 = "::";
                                    pos += 2;
                                  } else {
                                    result3 = null;
                                    if (reportFailures === 0) {
                                      matchFailed("\"::\"");
                                    }
                                  }
                                  if (result3 !== null) {
                                    result4 = parse_h16();
                                    if (result4 !== null) {
                                      if (input.charCodeAt(pos) === 58) {
                                        result5 = ":";
                                        pos++;
                                      } else {
                                        result5 = null;
                                        if (reportFailures === 0) {
                                          matchFailed("\":\"");
                                        }
                                      }
                                      if (result5 !== null) {
                                        result6 = parse_h16();
                                        if (result6 !== null) {
                                          if (input.charCodeAt(pos) === 58) {
                                            result7 = ":";
                                            pos++;
                                          } else {
                                            result7 = null;
                                            if (reportFailures === 0) {
                                              matchFailed("\":\"");
                                            }
                                          }
                                          if (result7 !== null) {
                                            result8 = parse_ls32();
                                            if (result8 !== null) {
                                              result0 = [result0, result1, result2, result3, result4, result5, result6, result7, result8];
                                            } else {
                                              result0 = null;
                                              pos = pos1;
                                            }
                                          } else {
                                            result0 = null;
                                            pos = pos1;
                                          }
                                        } else {
                                          result0 = null;
                                          pos = pos1;
                                        }
                                      } else {
                                        result0 = null;
                                        pos = pos1;
                                      }
                                    } else {
                                      result0 = null;
                                      pos = pos1;
                                    }
                                  } else {
                                    result0 = null;
                                    pos = pos1;
                                  }
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                            } else {
                              result0 = null;
                              pos = pos1;
                            }
                            if (result0 === null) {
                              pos1 = pos;
                              result0 = parse_h16();
                              if (result0 !== null) {
                                pos2 = pos;
                                if (input.charCodeAt(pos) === 58) {
                                  result1 = ":";
                                  pos++;
                                } else {
                                  result1 = null;
                                  if (reportFailures === 0) {
                                    matchFailed("\":\"");
                                  }
                                }
                                if (result1 !== null) {
                                  result2 = parse_h16();
                                  if (result2 !== null) {
                                    result1 = [result1, result2];
                                  } else {
                                    result1 = null;
                                    pos = pos2;
                                  }
                                } else {
                                  result1 = null;
                                  pos = pos2;
                                }
                                result1 = result1 !== null ? result1 : "";
                                if (result1 !== null) {
                                  pos2 = pos;
                                  if (input.charCodeAt(pos) === 58) {
                                    result2 = ":";
                                    pos++;
                                  } else {
                                    result2 = null;
                                    if (reportFailures === 0) {
                                      matchFailed("\":\"");
                                    }
                                  }
                                  if (result2 !== null) {
                                    result3 = parse_h16();
                                    if (result3 !== null) {
                                      result2 = [result2, result3];
                                    } else {
                                      result2 = null;
                                      pos = pos2;
                                    }
                                  } else {
                                    result2 = null;
                                    pos = pos2;
                                  }
                                  result2 = result2 !== null ? result2 : "";
                                  if (result2 !== null) {
                                    pos2 = pos;
                                    if (input.charCodeAt(pos) === 58) {
                                      result3 = ":";
                                      pos++;
                                    } else {
                                      result3 = null;
                                      if (reportFailures === 0) {
                                        matchFailed("\":\"");
                                      }
                                    }
                                    if (result3 !== null) {
                                      result4 = parse_h16();
                                      if (result4 !== null) {
                                        result3 = [result3, result4];
                                      } else {
                                        result3 = null;
                                        pos = pos2;
                                      }
                                    } else {
                                      result3 = null;
                                      pos = pos2;
                                    }
                                    result3 = result3 !== null ? result3 : "";
                                    if (result3 !== null) {
                                      if (input.substr(pos, 2) === "::") {
                                        result4 = "::";
                                        pos += 2;
                                      } else {
                                        result4 = null;
                                        if (reportFailures === 0) {
                                          matchFailed("\"::\"");
                                        }
                                      }
                                      if (result4 !== null) {
                                        result5 = parse_h16();
                                        if (result5 !== null) {
                                          if (input.charCodeAt(pos) === 58) {
                                            result6 = ":";
                                            pos++;
                                          } else {
                                            result6 = null;
                                            if (reportFailures === 0) {
                                              matchFailed("\":\"");
                                            }
                                          }
                                          if (result6 !== null) {
                                            result7 = parse_ls32();
                                            if (result7 !== null) {
                                              result0 = [result0, result1, result2, result3, result4, result5, result6, result7];
                                            } else {
                                              result0 = null;
                                              pos = pos1;
                                            }
                                          } else {
                                            result0 = null;
                                            pos = pos1;
                                          }
                                        } else {
                                          result0 = null;
                                          pos = pos1;
                                        }
                                      } else {
                                        result0 = null;
                                        pos = pos1;
                                      }
                                    } else {
                                      result0 = null;
                                      pos = pos1;
                                    }
                                  } else {
                                    result0 = null;
                                    pos = pos1;
                                  }
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                              } else {
                                result0 = null;
                                pos = pos1;
                              }
                              if (result0 === null) {
                                pos1 = pos;
                                result0 = parse_h16();
                                if (result0 !== null) {
                                  pos2 = pos;
                                  if (input.charCodeAt(pos) === 58) {
                                    result1 = ":";
                                    pos++;
                                  } else {
                                    result1 = null;
                                    if (reportFailures === 0) {
                                      matchFailed("\":\"");
                                    }
                                  }
                                  if (result1 !== null) {
                                    result2 = parse_h16();
                                    if (result2 !== null) {
                                      result1 = [result1, result2];
                                    } else {
                                      result1 = null;
                                      pos = pos2;
                                    }
                                  } else {
                                    result1 = null;
                                    pos = pos2;
                                  }
                                  result1 = result1 !== null ? result1 : "";
                                  if (result1 !== null) {
                                    pos2 = pos;
                                    if (input.charCodeAt(pos) === 58) {
                                      result2 = ":";
                                      pos++;
                                    } else {
                                      result2 = null;
                                      if (reportFailures === 0) {
                                        matchFailed("\":\"");
                                      }
                                    }
                                    if (result2 !== null) {
                                      result3 = parse_h16();
                                      if (result3 !== null) {
                                        result2 = [result2, result3];
                                      } else {
                                        result2 = null;
                                        pos = pos2;
                                      }
                                    } else {
                                      result2 = null;
                                      pos = pos2;
                                    }
                                    result2 = result2 !== null ? result2 : "";
                                    if (result2 !== null) {
                                      pos2 = pos;
                                      if (input.charCodeAt(pos) === 58) {
                                        result3 = ":";
                                        pos++;
                                      } else {
                                        result3 = null;
                                        if (reportFailures === 0) {
                                          matchFailed("\":\"");
                                        }
                                      }
                                      if (result3 !== null) {
                                        result4 = parse_h16();
                                        if (result4 !== null) {
                                          result3 = [result3, result4];
                                        } else {
                                          result3 = null;
                                          pos = pos2;
                                        }
                                      } else {
                                        result3 = null;
                                        pos = pos2;
                                      }
                                      result3 = result3 !== null ? result3 : "";
                                      if (result3 !== null) {
                                        pos2 = pos;
                                        if (input.charCodeAt(pos) === 58) {
                                          result4 = ":";
                                          pos++;
                                        } else {
                                          result4 = null;
                                          if (reportFailures === 0) {
                                            matchFailed("\":\"");
                                          }
                                        }
                                        if (result4 !== null) {
                                          result5 = parse_h16();
                                          if (result5 !== null) {
                                            result4 = [result4, result5];
                                          } else {
                                            result4 = null;
                                            pos = pos2;
                                          }
                                        } else {
                                          result4 = null;
                                          pos = pos2;
                                        }
                                        result4 = result4 !== null ? result4 : "";
                                        if (result4 !== null) {
                                          if (input.substr(pos, 2) === "::") {
                                            result5 = "::";
                                            pos += 2;
                                          } else {
                                            result5 = null;
                                            if (reportFailures === 0) {
                                              matchFailed("\"::\"");
                                            }
                                          }
                                          if (result5 !== null) {
                                            result6 = parse_ls32();
                                            if (result6 !== null) {
                                              result0 = [result0, result1, result2, result3, result4, result5, result6];
                                            } else {
                                              result0 = null;
                                              pos = pos1;
                                            }
                                          } else {
                                            result0 = null;
                                            pos = pos1;
                                          }
                                        } else {
                                          result0 = null;
                                          pos = pos1;
                                        }
                                      } else {
                                        result0 = null;
                                        pos = pos1;
                                      }
                                    } else {
                                      result0 = null;
                                      pos = pos1;
                                    }
                                  } else {
                                    result0 = null;
                                    pos = pos1;
                                  }
                                } else {
                                  result0 = null;
                                  pos = pos1;
                                }
                                if (result0 === null) {
                                  pos1 = pos;
                                  result0 = parse_h16();
                                  if (result0 !== null) {
                                    pos2 = pos;
                                    if (input.charCodeAt(pos) === 58) {
                                      result1 = ":";
                                      pos++;
                                    } else {
                                      result1 = null;
                                      if (reportFailures === 0) {
                                        matchFailed("\":\"");
                                      }
                                    }
                                    if (result1 !== null) {
                                      result2 = parse_h16();
                                      if (result2 !== null) {
                                        result1 = [result1, result2];
                                      } else {
                                        result1 = null;
                                        pos = pos2;
                                      }
                                    } else {
                                      result1 = null;
                                      pos = pos2;
                                    }
                                    result1 = result1 !== null ? result1 : "";
                                    if (result1 !== null) {
                                      pos2 = pos;
                                      if (input.charCodeAt(pos) === 58) {
                                        result2 = ":";
                                        pos++;
                                      } else {
                                        result2 = null;
                                        if (reportFailures === 0) {
                                          matchFailed("\":\"");
                                        }
                                      }
                                      if (result2 !== null) {
                                        result3 = parse_h16();
                                        if (result3 !== null) {
                                          result2 = [result2, result3];
                                        } else {
                                          result2 = null;
                                          pos = pos2;
                                        }
                                      } else {
                                        result2 = null;
                                        pos = pos2;
                                      }
                                      result2 = result2 !== null ? result2 : "";
                                      if (result2 !== null) {
                                        pos2 = pos;
                                        if (input.charCodeAt(pos) === 58) {
                                          result3 = ":";
                                          pos++;
                                        } else {
                                          result3 = null;
                                          if (reportFailures === 0) {
                                            matchFailed("\":\"");
                                          }
                                        }
                                        if (result3 !== null) {
                                          result4 = parse_h16();
                                          if (result4 !== null) {
                                            result3 = [result3, result4];
                                          } else {
                                            result3 = null;
                                            pos = pos2;
                                          }
                                        } else {
                                          result3 = null;
                                          pos = pos2;
                                        }
                                        result3 = result3 !== null ? result3 : "";
                                        if (result3 !== null) {
                                          pos2 = pos;
                                          if (input.charCodeAt(pos) === 58) {
                                            result4 = ":";
                                            pos++;
                                          } else {
                                            result4 = null;
                                            if (reportFailures === 0) {
                                              matchFailed("\":\"");
                                            }
                                          }
                                          if (result4 !== null) {
                                            result5 = parse_h16();
                                            if (result5 !== null) {
                                              result4 = [result4, result5];
                                            } else {
                                              result4 = null;
                                              pos = pos2;
                                            }
                                          } else {
                                            result4 = null;
                                            pos = pos2;
                                          }
                                          result4 = result4 !== null ? result4 : "";
                                          if (result4 !== null) {
                                            pos2 = pos;
                                            if (input.charCodeAt(pos) === 58) {
                                              result5 = ":";
                                              pos++;
                                            } else {
                                              result5 = null;
                                              if (reportFailures === 0) {
                                                matchFailed("\":\"");
                                              }
                                            }
                                            if (result5 !== null) {
                                              result6 = parse_h16();
                                              if (result6 !== null) {
                                                result5 = [result5, result6];
                                              } else {
                                                result5 = null;
                                                pos = pos2;
                                              }
                                            } else {
                                              result5 = null;
                                              pos = pos2;
                                            }
                                            result5 = result5 !== null ? result5 : "";
                                            if (result5 !== null) {
                                              if (input.substr(pos, 2) === "::") {
                                                result6 = "::";
                                                pos += 2;
                                              } else {
                                                result6 = null;
                                                if (reportFailures === 0) {
                                                  matchFailed("\"::\"");
                                                }
                                              }
                                              if (result6 !== null) {
                                                result7 = parse_h16();
                                                if (result7 !== null) {
                                                  result0 = [result0, result1, result2, result3, result4, result5, result6, result7];
                                                } else {
                                                  result0 = null;
                                                  pos = pos1;
                                                }
                                              } else {
                                                result0 = null;
                                                pos = pos1;
                                              }
                                            } else {
                                              result0 = null;
                                              pos = pos1;
                                            }
                                          } else {
                                            result0 = null;
                                            pos = pos1;
                                          }
                                        } else {
                                          result0 = null;
                                          pos = pos1;
                                        }
                                      } else {
                                        result0 = null;
                                        pos = pos1;
                                      }
                                    } else {
                                      result0 = null;
                                      pos = pos1;
                                    }
                                  } else {
                                    result0 = null;
                                    pos = pos1;
                                  }
                                  if (result0 === null) {
                                    pos1 = pos;
                                    result0 = parse_h16();
                                    if (result0 !== null) {
                                      pos2 = pos;
                                      if (input.charCodeAt(pos) === 58) {
                                        result1 = ":";
                                        pos++;
                                      } else {
                                        result1 = null;
                                        if (reportFailures === 0) {
                                          matchFailed("\":\"");
                                        }
                                      }
                                      if (result1 !== null) {
                                        result2 = parse_h16();
                                        if (result2 !== null) {
                                          result1 = [result1, result2];
                                        } else {
                                          result1 = null;
                                          pos = pos2;
                                        }
                                      } else {
                                        result1 = null;
                                        pos = pos2;
                                      }
                                      result1 = result1 !== null ? result1 : "";
                                      if (result1 !== null) {
                                        pos2 = pos;
                                        if (input.charCodeAt(pos) === 58) {
                                          result2 = ":";
                                          pos++;
                                        } else {
                                          result2 = null;
                                          if (reportFailures === 0) {
                                            matchFailed("\":\"");
                                          }
                                        }
                                        if (result2 !== null) {
                                          result3 = parse_h16();
                                          if (result3 !== null) {
                                            result2 = [result2, result3];
                                          } else {
                                            result2 = null;
                                            pos = pos2;
                                          }
                                        } else {
                                          result2 = null;
                                          pos = pos2;
                                        }
                                        result2 = result2 !== null ? result2 : "";
                                        if (result2 !== null) {
                                          pos2 = pos;
                                          if (input.charCodeAt(pos) === 58) {
                                            result3 = ":";
                                            pos++;
                                          } else {
                                            result3 = null;
                                            if (reportFailures === 0) {
                                              matchFailed("\":\"");
                                            }
                                          }
                                          if (result3 !== null) {
                                            result4 = parse_h16();
                                            if (result4 !== null) {
                                              result3 = [result3, result4];
                                            } else {
                                              result3 = null;
                                              pos = pos2;
                                            }
                                          } else {
                                            result3 = null;
                                            pos = pos2;
                                          }
                                          result3 = result3 !== null ? result3 : "";
                                          if (result3 !== null) {
                                            pos2 = pos;
                                            if (input.charCodeAt(pos) === 58) {
                                              result4 = ":";
                                              pos++;
                                            } else {
                                              result4 = null;
                                              if (reportFailures === 0) {
                                                matchFailed("\":\"");
                                              }
                                            }
                                            if (result4 !== null) {
                                              result5 = parse_h16();
                                              if (result5 !== null) {
                                                result4 = [result4, result5];
                                              } else {
                                                result4 = null;
                                                pos = pos2;
                                              }
                                            } else {
                                              result4 = null;
                                              pos = pos2;
                                            }
                                            result4 = result4 !== null ? result4 : "";
                                            if (result4 !== null) {
                                              pos2 = pos;
                                              if (input.charCodeAt(pos) === 58) {
                                                result5 = ":";
                                                pos++;
                                              } else {
                                                result5 = null;
                                                if (reportFailures === 0) {
                                                  matchFailed("\":\"");
                                                }
                                              }
                                              if (result5 !== null) {
                                                result6 = parse_h16();
                                                if (result6 !== null) {
                                                  result5 = [result5, result6];
                                                } else {
                                                  result5 = null;
                                                  pos = pos2;
                                                }
                                              } else {
                                                result5 = null;
                                                pos = pos2;
                                              }
                                              result5 = result5 !== null ? result5 : "";
                                              if (result5 !== null) {
                                                pos2 = pos;
                                                if (input.charCodeAt(pos) === 58) {
                                                  result6 = ":";
                                                  pos++;
                                                } else {
                                                  result6 = null;
                                                  if (reportFailures === 0) {
                                                    matchFailed("\":\"");
                                                  }
                                                }
                                                if (result6 !== null) {
                                                  result7 = parse_h16();
                                                  if (result7 !== null) {
                                                    result6 = [result6, result7];
                                                  } else {
                                                    result6 = null;
                                                    pos = pos2;
                                                  }
                                                } else {
                                                  result6 = null;
                                                  pos = pos2;
                                                }
                                                result6 = result6 !== null ? result6 : "";
                                                if (result6 !== null) {
                                                  if (input.substr(pos, 2) === "::") {
                                                    result7 = "::";
                                                    pos += 2;
                                                  } else {
                                                    result7 = null;
                                                    if (reportFailures === 0) {
                                                      matchFailed("\"::\"");
                                                    }
                                                  }
                                                  if (result7 !== null) {
                                                    result0 = [result0, result1, result2, result3, result4, result5, result6, result7];
                                                  } else {
                                                    result0 = null;
                                                    pos = pos1;
                                                  }
                                                } else {
                                                  result0 = null;
                                                  pos = pos1;
                                                }
                                              } else {
                                                result0 = null;
                                                pos = pos1;
                                              }
                                            } else {
                                              result0 = null;
                                              pos = pos1;
                                            }
                                          } else {
                                            result0 = null;
                                            pos = pos1;
                                          }
                                        } else {
                                          result0 = null;
                                          pos = pos1;
                                        }
                                      } else {
                                        result0 = null;
                                        pos = pos1;
                                      }
                                    } else {
                                      result0 = null;
                                      pos = pos1;
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                          data.host_type = 'IPv6';
                          return input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_h16() {
        var result0, result1, result2, result3;
        var pos0;
        
        pos0 = pos;
        result0 = parse_HEXDIG();
        if (result0 !== null) {
          result1 = parse_HEXDIG();
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result2 = parse_HEXDIG();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse_HEXDIG();
              result3 = result3 !== null ? result3 : "";
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ls32() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        result0 = parse_h16();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 58) {
            result1 = ":";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_h16();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        if (result0 === null) {
          result0 = parse_IPv4address();
        }
        return result0;
      }
      
      function parse_IPv4address() {
        var result0, result1, result2, result3, result4, result5, result6;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_dec_octet();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 46) {
            result1 = ".";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\".\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_dec_octet();
            if (result2 !== null) {
              if (input.charCodeAt(pos) === 46) {
                result3 = ".";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\".\"");
                }
              }
              if (result3 !== null) {
                result4 = parse_dec_octet();
                if (result4 !== null) {
                  if (input.charCodeAt(pos) === 46) {
                    result5 = ".";
                    pos++;
                  } else {
                    result5 = null;
                    if (reportFailures === 0) {
                      matchFailed("\".\"");
                    }
                  }
                  if (result5 !== null) {
                    result6 = parse_dec_octet();
                    if (result6 !== null) {
                      result0 = [result0, result1, result2, result3, result4, result5, result6];
                    } else {
                      result0 = null;
                      pos = pos1;
                    }
                  } else {
                    result0 = null;
                    pos = pos1;
                  }
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                            data.host_type = 'IPv4';
                            return input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_dec_octet() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        if (input.substr(pos, 2) === "25") {
          result0 = "25";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"25\"");
          }
        }
        if (result0 !== null) {
          if (/^[0-5]/.test(input.charAt(pos))) {
            result1 = input.charAt(pos);
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("[0-5]");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          if (input.charCodeAt(pos) === 50) {
            result0 = "2";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"2\"");
            }
          }
          if (result0 !== null) {
            if (/^[0-4]/.test(input.charAt(pos))) {
              result1 = input.charAt(pos);
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("[0-4]");
              }
            }
            if (result1 !== null) {
              result2 = parse_DIGIT();
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            if (input.charCodeAt(pos) === 49) {
              result0 = "1";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"1\"");
              }
            }
            if (result0 !== null) {
              result1 = parse_DIGIT();
              if (result1 !== null) {
                result2 = parse_DIGIT();
                if (result2 !== null) {
                  result0 = [result0, result1, result2];
                } else {
                  result0 = null;
                  pos = pos0;
                }
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              if (/^[1-9]/.test(input.charAt(pos))) {
                result0 = input.charAt(pos);
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("[1-9]");
                }
              }
              if (result0 !== null) {
                result1 = parse_DIGIT();
                if (result1 !== null) {
                  result0 = [result0, result1];
                } else {
                  result0 = null;
                  pos = pos0;
                }
              } else {
                result0 = null;
                pos = pos0;
              }
              if (result0 === null) {
                result0 = parse_DIGIT();
              }
            }
          }
        }
        return result0;
      }
      
      function parse_port() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_DIGIT();
        result0 = result0 !== null ? result0 : "";
        if (result0 !== null) {
          result1 = parse_DIGIT();
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result2 = parse_DIGIT();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse_DIGIT();
              result3 = result3 !== null ? result3 : "";
              if (result3 !== null) {
                result4 = parse_DIGIT();
                result4 = result4 !== null ? result4 : "";
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, port) {
                            port = parseInt(port.join(""));
                            data.port = port;
                            return port; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_uri_parameters() {
        var result0, result1, result2;
        var pos0;
        
        result0 = [];
        pos0 = pos;
        if (input.charCodeAt(pos) === 59) {
          result1 = ";";
          pos++;
        } else {
          result1 = null;
          if (reportFailures === 0) {
            matchFailed("\";\"");
          }
        }
        if (result1 !== null) {
          result2 = parse_uri_parameter();
          if (result2 !== null) {
            result1 = [result1, result2];
          } else {
            result1 = null;
            pos = pos0;
          }
        } else {
          result1 = null;
          pos = pos0;
        }
        while (result1 !== null) {
          result0.push(result1);
          pos0 = pos;
          if (input.charCodeAt(pos) === 59) {
            result1 = ";";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\";\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_uri_parameter();
            if (result2 !== null) {
              result1 = [result1, result2];
            } else {
              result1 = null;
              pos = pos0;
            }
          } else {
            result1 = null;
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_uri_parameter() {
        var result0;
        
        result0 = parse_transport_param();
        if (result0 === null) {
          result0 = parse_user_param();
          if (result0 === null) {
            result0 = parse_method_param();
            if (result0 === null) {
              result0 = parse_ttl_param();
              if (result0 === null) {
                result0 = parse_maddr_param();
                if (result0 === null) {
                  result0 = parse_lr_param();
                  if (result0 === null) {
                    result0 = parse_other_param();
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_transport_param() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 10) === "transport=") {
          result0 = "transport=";
          pos += 10;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"transport=\"");
          }
        }
        if (result0 !== null) {
          if (input.substr(pos, 3) === "udp") {
            result1 = "udp";
            pos += 3;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"udp\"");
            }
          }
          if (result1 === null) {
            if (input.substr(pos, 3) === "tcp") {
              result1 = "tcp";
              pos += 3;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\"tcp\"");
              }
            }
            if (result1 === null) {
              if (input.substr(pos, 4) === "sctp") {
                result1 = "sctp";
                pos += 4;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\"sctp\"");
                }
              }
              if (result1 === null) {
                if (input.substr(pos, 3) === "tls") {
                  result1 = "tls";
                  pos += 3;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"tls\"");
                  }
                }
                if (result1 === null) {
                  result1 = parse_token();
                }
              }
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, transport) {
                              if(!data.params) data.params={};
                              data.params['transport'] = transport; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_user_param() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "user=") {
          result0 = "user=";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"user=\"");
          }
        }
        if (result0 !== null) {
          if (input.substr(pos, 5) === "phone") {
            result1 = "phone";
            pos += 5;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"phone\"");
            }
          }
          if (result1 === null) {
            if (input.substr(pos, 2) === "ip") {
              result1 = "ip";
              pos += 2;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\"ip\"");
              }
            }
            if (result1 === null) {
              result1 = parse_token();
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, user) {
                              if(!data.params) data.params={};
                              data.params['user'] = user; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_method_param() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 7) === "method=") {
          result0 = "method=";
          pos += 7;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"method=\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_Method();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, method) {
                              if(!data.params) data.params={};
                              data.params['method'] = method; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ttl_param() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 4) === "ttl=") {
          result0 = "ttl=";
          pos += 4;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"ttl=\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_ttl();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, ttl) {
                              if(!data.params) data.params={};
                              data.params['ttl'] = ttl; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_maddr_param() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 6) === "maddr=") {
          result0 = "maddr=";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"maddr=\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_host();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, maddr) {
                              if(!data.params) data.params={};
                              data.params['maddr'] = maddr; })(pos0, result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_lr_param() {
        var result0;
        var pos0;
        
        pos0 = pos;
        if (input.substr(pos, 2) === "lr") {
          result0 = "lr";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"lr\"");
          }
        }
        if (result0 !== null) {
          result0 = (function(offset, lr) {
                              if(!data.params) data.params={};
                              data.params['lr'] = true; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_other_param() {
        var result0, result1, result2;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_pname();
        if (result0 !== null) {
          pos2 = pos;
          if (input.charCodeAt(pos) === 61) {
            result1 = "=";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"=\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_pvalue();
            if (result2 !== null) {
              result1 = [result1, result2];
            } else {
              result1 = null;
              pos = pos2;
            }
          } else {
            result1 = null;
            pos = pos2;
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, param_name) {
                              if(!data.params) data.params={};
                              if(param_name.length === (pos - offset)) {
                                data.params[param_name] = true;
                              }
                              else {
                                data.params[param_name] = input.substring(pos, offset+param_name.length+1);
                              }; })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_pname() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_paramchar();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_paramchar();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, pname) {return pname.join(""); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_pvalue() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_paramchar();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_paramchar();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, pvalue) {return pvalue.join(""); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_paramchar() {
        var result0;
        
        result0 = parse_param_unreserved();
        if (result0 === null) {
          result0 = parse_unreserved();
          if (result0 === null) {
            result0 = parse_escaped();
          }
        }
        return result0;
      }
      
      function parse_param_unreserved() {
        var result0;
        
        if (input.charCodeAt(pos) === 91) {
          result0 = "[";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"[\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 93) {
            result0 = "]";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"]\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 47) {
              result0 = "/";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"/\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 58) {
                result0 = ":";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\":\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 38) {
                  result0 = "&";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"&\"");
                  }
                }
                if (result0 === null) {
                  if (input.charCodeAt(pos) === 43) {
                    result0 = "+";
                    pos++;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"+\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.charCodeAt(pos) === 36) {
                      result0 = "$";
                      pos++;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"$\"");
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_headers() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        if (input.charCodeAt(pos) === 63) {
          result0 = "?";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"?\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_header();
          if (result1 !== null) {
            result2 = [];
            pos1 = pos;
            if (input.charCodeAt(pos) === 38) {
              result3 = "&";
              pos++;
            } else {
              result3 = null;
              if (reportFailures === 0) {
                matchFailed("\"&\"");
              }
            }
            if (result3 !== null) {
              result4 = parse_header();
              if (result4 !== null) {
                result3 = [result3, result4];
              } else {
                result3 = null;
                pos = pos1;
              }
            } else {
              result3 = null;
              pos = pos1;
            }
            while (result3 !== null) {
              result2.push(result3);
              pos1 = pos;
              if (input.charCodeAt(pos) === 38) {
                result3 = "&";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\"&\"");
                }
              }
              if (result3 !== null) {
                result4 = parse_header();
                if (result4 !== null) {
                  result3 = [result3, result4];
                } else {
                  result3 = null;
                  pos = pos1;
                }
              } else {
                result3 = null;
                pos = pos1;
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_header() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        result0 = parse_hname();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 61) {
            result1 = "=";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"=\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_hvalue();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_hname() {
        var result0, result1;
        
        result1 = parse_hnv_unreserved();
        if (result1 === null) {
          result1 = parse_unreserved();
          if (result1 === null) {
            result1 = parse_escaped();
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_hnv_unreserved();
            if (result1 === null) {
              result1 = parse_unreserved();
              if (result1 === null) {
                result1 = parse_escaped();
              }
            }
          }
        } else {
          result0 = null;
        }
        return result0;
      }
      
      function parse_hvalue() {
        var result0, result1;
        
        result0 = [];
        result1 = parse_hnv_unreserved();
        if (result1 === null) {
          result1 = parse_unreserved();
          if (result1 === null) {
            result1 = parse_escaped();
          }
        }
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_hnv_unreserved();
          if (result1 === null) {
            result1 = parse_unreserved();
            if (result1 === null) {
              result1 = parse_escaped();
            }
          }
        }
        return result0;
      }
      
      function parse_hnv_unreserved() {
        var result0;
        
        if (input.charCodeAt(pos) === 91) {
          result0 = "[";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"[\"");
          }
        }
        if (result0 === null) {
          if (input.charCodeAt(pos) === 93) {
            result0 = "]";
            pos++;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"]\"");
            }
          }
          if (result0 === null) {
            if (input.charCodeAt(pos) === 47) {
              result0 = "/";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"/\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 63) {
                result0 = "?";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"?\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 58) {
                  result0 = ":";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\":\"");
                  }
                }
                if (result0 === null) {
                  if (input.charCodeAt(pos) === 43) {
                    result0 = "+";
                    pos++;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"+\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.charCodeAt(pos) === 36) {
                      result0 = "$";
                      pos++;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"$\"");
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_Request_Response() {
        var result0;
        
        result0 = parse_Status_Line();
        if (result0 === null) {
          result0 = parse_Request_Line();
        }
        return result0;
      }
      
      function parse_Request_Line() {
        var result0, result1, result2, result3, result4;
        var pos0;
        
        pos0 = pos;
        result0 = parse_Method();
        if (result0 !== null) {
          result1 = parse_SP();
          if (result1 !== null) {
            result2 = parse_Request_URI();
            if (result2 !== null) {
              result3 = parse_SP();
              if (result3 !== null) {
                result4 = parse_SIP_Version();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos0;
                }
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Request_URI() {
        var result0;
        
        result0 = parse_SIP_URI();
        if (result0 === null) {
          result0 = parse_absoluteURI();
        }
        return result0;
      }
      
      function parse_absoluteURI() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        result0 = parse_scheme();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 58) {
            result1 = ":";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_hier_part();
            if (result2 === null) {
              result2 = parse_opaque_part();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_hier_part() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_net_path();
        if (result0 === null) {
          result0 = parse_abs_path();
        }
        if (result0 !== null) {
          pos1 = pos;
          if (input.charCodeAt(pos) === 63) {
            result1 = "?";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"?\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_query();
            if (result2 !== null) {
              result1 = [result1, result2];
            } else {
              result1 = null;
              pos = pos1;
            }
          } else {
            result1 = null;
            pos = pos1;
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_net_path() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        if (input.substr(pos, 2) === "//") {
          result0 = "//";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"//\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_authority();
          if (result1 !== null) {
            result2 = parse_abs_path();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_abs_path() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        if (input.charCodeAt(pos) === 47) {
          result0 = "/";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"/\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_path_segments();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_opaque_part() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        result0 = parse_uric_no_slash();
        if (result0 !== null) {
          result1 = [];
          result2 = parse_uric();
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_uric();
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_uric() {
        var result0;
        
        result0 = parse_reserved();
        if (result0 === null) {
          result0 = parse_unreserved();
          if (result0 === null) {
            result0 = parse_escaped();
          }
        }
        return result0;
      }
      
      function parse_uric_no_slash() {
        var result0;
        
        result0 = parse_unreserved();
        if (result0 === null) {
          result0 = parse_escaped();
          if (result0 === null) {
            if (input.charCodeAt(pos) === 59) {
              result0 = ";";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\";\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 63) {
                result0 = "?";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"?\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 58) {
                  result0 = ":";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\":\"");
                  }
                }
                if (result0 === null) {
                  if (input.charCodeAt(pos) === 64) {
                    result0 = "@";
                    pos++;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"@\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.charCodeAt(pos) === 38) {
                      result0 = "&";
                      pos++;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"&\"");
                      }
                    }
                    if (result0 === null) {
                      if (input.charCodeAt(pos) === 61) {
                        result0 = "=";
                        pos++;
                      } else {
                        result0 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"=\"");
                        }
                      }
                      if (result0 === null) {
                        if (input.charCodeAt(pos) === 43) {
                          result0 = "+";
                          pos++;
                        } else {
                          result0 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"+\"");
                          }
                        }
                        if (result0 === null) {
                          if (input.charCodeAt(pos) === 36) {
                            result0 = "$";
                            pos++;
                          } else {
                            result0 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"$\"");
                            }
                          }
                          if (result0 === null) {
                            if (input.charCodeAt(pos) === 44) {
                              result0 = ",";
                              pos++;
                            } else {
                              result0 = null;
                              if (reportFailures === 0) {
                                matchFailed("\",\"");
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_path_segments() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_segment();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          if (input.charCodeAt(pos) === 47) {
            result2 = "/";
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\"/\"");
            }
          }
          if (result2 !== null) {
            result3 = parse_segment();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            if (input.charCodeAt(pos) === 47) {
              result2 = "/";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"/\"");
              }
            }
            if (result2 !== null) {
              result3 = parse_segment();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_segment() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = [];
        result1 = parse_pchar();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_pchar();
        }
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          if (input.charCodeAt(pos) === 59) {
            result2 = ";";
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\";\"");
            }
          }
          if (result2 !== null) {
            result3 = parse_param();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            if (input.charCodeAt(pos) === 59) {
              result2 = ";";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\";\"");
              }
            }
            if (result2 !== null) {
              result3 = parse_param();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_param() {
        var result0, result1;
        
        result0 = [];
        result1 = parse_pchar();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_pchar();
        }
        return result0;
      }
      
      function parse_pchar() {
        var result0;
        
        result0 = parse_unreserved();
        if (result0 === null) {
          result0 = parse_escaped();
          if (result0 === null) {
            if (input.charCodeAt(pos) === 58) {
              result0 = ":";
              pos++;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\":\"");
              }
            }
            if (result0 === null) {
              if (input.charCodeAt(pos) === 64) {
                result0 = "@";
                pos++;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"@\"");
                }
              }
              if (result0 === null) {
                if (input.charCodeAt(pos) === 38) {
                  result0 = "&";
                  pos++;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"&\"");
                  }
                }
                if (result0 === null) {
                  if (input.charCodeAt(pos) === 61) {
                    result0 = "=";
                    pos++;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"=\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.charCodeAt(pos) === 43) {
                      result0 = "+";
                      pos++;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"+\"");
                      }
                    }
                    if (result0 === null) {
                      if (input.charCodeAt(pos) === 36) {
                        result0 = "$";
                        pos++;
                      } else {
                        result0 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"$\"");
                        }
                      }
                      if (result0 === null) {
                        if (input.charCodeAt(pos) === 44) {
                          result0 = ",";
                          pos++;
                        } else {
                          result0 = null;
                          if (reportFailures === 0) {
                            matchFailed("\",\"");
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_scheme() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_ALPHA();
        if (result0 !== null) {
          result1 = [];
          result2 = parse_ALPHA();
          if (result2 === null) {
            result2 = parse_DIGIT();
            if (result2 === null) {
              if (input.charCodeAt(pos) === 43) {
                result2 = "+";
                pos++;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\"+\"");
                }
              }
              if (result2 === null) {
                if (input.charCodeAt(pos) === 45) {
                  result2 = "-";
                  pos++;
                } else {
                  result2 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"-\"");
                  }
                }
                if (result2 === null) {
                  if (input.charCodeAt(pos) === 46) {
                    result2 = ".";
                    pos++;
                  } else {
                    result2 = null;
                    if (reportFailures === 0) {
                      matchFailed("\".\"");
                    }
                  }
                }
              }
            }
          }
          while (result2 !== null) {
            result1.push(result2);
            result2 = parse_ALPHA();
            if (result2 === null) {
              result2 = parse_DIGIT();
              if (result2 === null) {
                if (input.charCodeAt(pos) === 43) {
                  result2 = "+";
                  pos++;
                } else {
                  result2 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"+\"");
                  }
                }
                if (result2 === null) {
                  if (input.charCodeAt(pos) === 45) {
                    result2 = "-";
                    pos++;
                  } else {
                    result2 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"-\"");
                    }
                  }
                  if (result2 === null) {
                    if (input.charCodeAt(pos) === 46) {
                      result2 = ".";
                      pos++;
                    } else {
                      result2 = null;
                      if (reportFailures === 0) {
                        matchFailed("\".\"");
                      }
                    }
                  }
                }
              }
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                            data.scheme= input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_authority() {
        var result0;
        
        result0 = parse_srvr();
        if (result0 === null) {
          result0 = parse_reg_name();
        }
        return result0;
      }
      
      function parse_srvr() {
        var result0, result1;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_userinfo();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 64) {
            result1 = "@";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"@\"");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        result0 = result0 !== null ? result0 : "";
        if (result0 !== null) {
          result1 = parse_hostport();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        result0 = result0 !== null ? result0 : "";
        return result0;
      }
      
      function parse_reg_name() {
        var result0, result1;
        
        result1 = parse_unreserved();
        if (result1 === null) {
          result1 = parse_escaped();
          if (result1 === null) {
            if (input.charCodeAt(pos) === 36) {
              result1 = "$";
              pos++;
            } else {
              result1 = null;
              if (reportFailures === 0) {
                matchFailed("\"$\"");
              }
            }
            if (result1 === null) {
              if (input.charCodeAt(pos) === 44) {
                result1 = ",";
                pos++;
              } else {
                result1 = null;
                if (reportFailures === 0) {
                  matchFailed("\",\"");
                }
              }
              if (result1 === null) {
                if (input.charCodeAt(pos) === 59) {
                  result1 = ";";
                  pos++;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed("\";\"");
                  }
                }
                if (result1 === null) {
                  if (input.charCodeAt(pos) === 58) {
                    result1 = ":";
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed("\":\"");
                    }
                  }
                  if (result1 === null) {
                    if (input.charCodeAt(pos) === 64) {
                      result1 = "@";
                      pos++;
                    } else {
                      result1 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"@\"");
                      }
                    }
                    if (result1 === null) {
                      if (input.charCodeAt(pos) === 38) {
                        result1 = "&";
                        pos++;
                      } else {
                        result1 = null;
                        if (reportFailures === 0) {
                          matchFailed("\"&\"");
                        }
                      }
                      if (result1 === null) {
                        if (input.charCodeAt(pos) === 61) {
                          result1 = "=";
                          pos++;
                        } else {
                          result1 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"=\"");
                          }
                        }
                        if (result1 === null) {
                          if (input.charCodeAt(pos) === 43) {
                            result1 = "+";
                            pos++;
                          } else {
                            result1 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"+\"");
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_unreserved();
            if (result1 === null) {
              result1 = parse_escaped();
              if (result1 === null) {
                if (input.charCodeAt(pos) === 36) {
                  result1 = "$";
                  pos++;
                } else {
                  result1 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"$\"");
                  }
                }
                if (result1 === null) {
                  if (input.charCodeAt(pos) === 44) {
                    result1 = ",";
                    pos++;
                  } else {
                    result1 = null;
                    if (reportFailures === 0) {
                      matchFailed("\",\"");
                    }
                  }
                  if (result1 === null) {
                    if (input.charCodeAt(pos) === 59) {
                      result1 = ";";
                      pos++;
                    } else {
                      result1 = null;
                      if (reportFailures === 0) {
                        matchFailed("\";\"");
                      }
                    }
                    if (result1 === null) {
                      if (input.charCodeAt(pos) === 58) {
                        result1 = ":";
                        pos++;
                      } else {
                        result1 = null;
                        if (reportFailures === 0) {
                          matchFailed("\":\"");
                        }
                      }
                      if (result1 === null) {
                        if (input.charCodeAt(pos) === 64) {
                          result1 = "@";
                          pos++;
                        } else {
                          result1 = null;
                          if (reportFailures === 0) {
                            matchFailed("\"@\"");
                          }
                        }
                        if (result1 === null) {
                          if (input.charCodeAt(pos) === 38) {
                            result1 = "&";
                            pos++;
                          } else {
                            result1 = null;
                            if (reportFailures === 0) {
                              matchFailed("\"&\"");
                            }
                          }
                          if (result1 === null) {
                            if (input.charCodeAt(pos) === 61) {
                              result1 = "=";
                              pos++;
                            } else {
                              result1 = null;
                              if (reportFailures === 0) {
                                matchFailed("\"=\"");
                              }
                            }
                            if (result1 === null) {
                              if (input.charCodeAt(pos) === 43) {
                                result1 = "+";
                                pos++;
                              } else {
                                result1 = null;
                                if (reportFailures === 0) {
                                  matchFailed("\"+\"");
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          result0 = null;
        }
        return result0;
      }
      
      function parse_query() {
        var result0, result1;
        
        result0 = [];
        result1 = parse_uric();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_uric();
        }
        return result0;
      }
      
      function parse_SIP_Version() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 3) === "SIP") {
          result0 = "SIP";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"SIP\"");
          }
        }
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 47) {
            result1 = "/";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"/\"");
            }
          }
          if (result1 !== null) {
            result3 = parse_DIGIT();
            if (result3 !== null) {
              result2 = [];
              while (result3 !== null) {
                result2.push(result3);
                result3 = parse_DIGIT();
              }
            } else {
              result2 = null;
            }
            if (result2 !== null) {
              if (input.charCodeAt(pos) === 46) {
                result3 = ".";
                pos++;
              } else {
                result3 = null;
                if (reportFailures === 0) {
                  matchFailed("\".\"");
                }
              }
              if (result3 !== null) {
                result5 = parse_DIGIT();
                if (result5 !== null) {
                  result4 = [];
                  while (result5 !== null) {
                    result4.push(result5);
                    result5 = parse_DIGIT();
                  }
                } else {
                  result4 = null;
                }
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                            data.sip_version = input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_INVITEm() {
        var result0;
        
        if (input.substr(pos, 6) === "INVITE") {
          result0 = "INVITE";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"INVITE\"");
          }
        }
        return result0;
      }
      
      function parse_ACKm() {
        var result0;
        
        if (input.substr(pos, 3) === "ACK") {
          result0 = "ACK";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"ACK\"");
          }
        }
        return result0;
      }
      
      function parse_OPTIONSm() {
        var result0;
        
        if (input.substr(pos, 7) === "OPTIONS") {
          result0 = "OPTIONS";
          pos += 7;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"OPTIONS\"");
          }
        }
        return result0;
      }
      
      function parse_BYEm() {
        var result0;
        
        if (input.substr(pos, 3) === "BYE") {
          result0 = "BYE";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"BYE\"");
          }
        }
        return result0;
      }
      
      function parse_CANCELm() {
        var result0;
        
        if (input.substr(pos, 6) === "CANCEL") {
          result0 = "CANCEL";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"CANCEL\"");
          }
        }
        return result0;
      }
      
      function parse_REGISTERm() {
        var result0;
        
        if (input.substr(pos, 8) === "REGISTER") {
          result0 = "REGISTER";
          pos += 8;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"REGISTER\"");
          }
        }
        return result0;
      }
      
      function parse_SUBSCRIBEm() {
        var result0;
        
        if (input.substr(pos, 9) === "SUBSCRIBE") {
          result0 = "SUBSCRIBE";
          pos += 9;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"SUBSCRIBE\"");
          }
        }
        return result0;
      }
      
      function parse_NOTIFYm() {
        var result0;
        
        if (input.substr(pos, 6) === "NOTIFY") {
          result0 = "NOTIFY";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"NOTIFY\"");
          }
        }
        return result0;
      }
      
      function parse_Method() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_INVITEm();
        if (result0 === null) {
          result0 = parse_ACKm();
          if (result0 === null) {
            result0 = parse_OPTIONSm();
            if (result0 === null) {
              result0 = parse_BYEm();
              if (result0 === null) {
                result0 = parse_CANCELm();
                if (result0 === null) {
                  result0 = parse_REGISTERm();
                  if (result0 === null) {
                    result0 = parse_SUBSCRIBEm();
                    if (result0 === null) {
                      result0 = parse_NOTIFYm();
                      if (result0 === null) {
                        result0 = parse_token();
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                            data.method = input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Status_Line() {
        var result0, result1, result2, result3, result4;
        var pos0;
        
        pos0 = pos;
        result0 = parse_SIP_Version();
        if (result0 !== null) {
          result1 = parse_SP();
          if (result1 !== null) {
            result2 = parse_Status_Code();
            if (result2 !== null) {
              result3 = parse_SP();
              if (result3 !== null) {
                result4 = parse_Reason_Phrase();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos0;
                }
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Status_Code() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_extension_code();
        if (result0 !== null) {
          result0 = (function(offset, status_code) {
                          data.status_code = parseInt(status_code.join("")); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_extension_code() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        result0 = parse_DIGIT();
        if (result0 !== null) {
          result1 = parse_DIGIT();
          if (result1 !== null) {
            result2 = parse_DIGIT();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Reason_Phrase() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result0 = [];
        result1 = parse_reserved();
        if (result1 === null) {
          result1 = parse_unreserved();
          if (result1 === null) {
            result1 = parse_escaped();
            if (result1 === null) {
              result1 = parse_UTF8_NONASCII();
              if (result1 === null) {
                result1 = parse_UTF8_CONT();
                if (result1 === null) {
                  result1 = parse_SP();
                  if (result1 === null) {
                    result1 = parse_HTAB();
                  }
                }
              }
            }
          }
        }
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_reserved();
          if (result1 === null) {
            result1 = parse_unreserved();
            if (result1 === null) {
              result1 = parse_escaped();
              if (result1 === null) {
                result1 = parse_UTF8_NONASCII();
                if (result1 === null) {
                  result1 = parse_UTF8_CONT();
                  if (result1 === null) {
                    result1 = parse_SP();
                    if (result1 === null) {
                      result1 = parse_HTAB();
                    }
                  }
                }
              }
            }
          }
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                          data.reason_phrase = input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Allow_Events() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_event_type();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_COMMA();
          if (result2 !== null) {
            result3 = parse_event_type();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_COMMA();
            if (result2 !== null) {
              result3 = parse_event_type();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Call_ID() {
        var result0, result1, result2;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_word();
        if (result0 !== null) {
          pos2 = pos;
          if (input.charCodeAt(pos) === 64) {
            result1 = "@";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\"@\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_word();
            if (result2 !== null) {
              result1 = [result1, result2];
            } else {
              result1 = null;
              pos = pos2;
            }
          } else {
            result1 = null;
            pos = pos2;
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                      data = input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Contact() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        result0 = parse_STAR();
        if (result0 === null) {
          pos0 = pos;
          result0 = parse_contact_param();
          if (result0 !== null) {
            result1 = [];
            pos1 = pos;
            result2 = parse_COMMA();
            if (result2 !== null) {
              result3 = parse_contact_param();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
            while (result2 !== null) {
              result1.push(result2);
              pos1 = pos;
              result2 = parse_COMMA();
              if (result2 !== null) {
                result3 = parse_contact_param();
                if (result3 !== null) {
                  result2 = [result2, result3];
                } else {
                  result2 = null;
                  pos = pos1;
                }
              } else {
                result2 = null;
                pos = pos1;
              }
            }
            if (result1 !== null) {
              result0 = [result0, result1];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        }
        return result0;
      }
      
      function parse_contact_param() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_addr_spec();
        if (result0 === null) {
          result0 = parse_name_addr();
        }
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_SEMI();
          if (result2 !== null) {
            result3 = parse_contact_params();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_SEMI();
            if (result2 !== null) {
              result3 = parse_contact_params();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_name_addr() {
        var result0, result1, result2, result3;
        var pos0;
        
        pos0 = pos;
        result0 = parse_display_name();
        result0 = result0 !== null ? result0 : "";
        if (result0 !== null) {
          result1 = parse_LAQUOT();
          if (result1 !== null) {
            result2 = parse_addr_spec();
            if (result2 !== null) {
              result3 = parse_RAQUOT();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_addr_spec() {
        var result0;
        
        result0 = parse_SIP_URI();
        if (result0 === null) {
          result0 = parse_absoluteURI();
        }
        return result0;
      }
      
      function parse_addr_spec_simple() {
        var result0;
        
        result0 = parse_SIP_URI_simple();
        if (result0 === null) {
          result0 = parse_absoluteURI();
        }
        return result0;
      }
      
      function parse_display_name() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_token();
        if (result0 !== null) {
          result1 = [];
          pos2 = pos;
          result2 = parse_LWS();
          if (result2 !== null) {
            result3 = parse_token();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos2;
            }
          } else {
            result2 = null;
            pos = pos2;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos2 = pos;
            result2 = parse_LWS();
            if (result2 !== null) {
              result3 = parse_token();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 === null) {
          result0 = parse_quoted_string();
        }
        if (result0 !== null) {
          result0 = (function(offset, display_name) {
                                data.display_name = display_name; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_contact_params() {
        var result0;
        
        result0 = parse_c_p_q();
        if (result0 === null) {
          result0 = parse_c_p_expires();
          if (result0 === null) {
            result0 = parse_contact_extension();
          }
        }
        return result0;
      }
      
      function parse_c_p_q() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 113) {
          result0 = "q";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"q\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_qvalue();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, q) {
                                if(!data.params) data.params = {};
                                data.params['q'] = q; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_c_p_expires() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 7) === "expires") {
          result0 = "expires";
          pos += 7;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"expires\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_delta_seconds();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, expires) {
                                if(!data.params) data.params = {};
                                data.params['expires'] = expires; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_contact_extension() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_generic_param();
        if (result0 !== null) {
          result0 = (function(offset, c_e) {
                                if(!data.params) data.params = {};
                                if(c_e[1]) {
                                  data.params[c_e[0]] = c_e[1];
                                }
                                else {
                                  data.params[c_e[0]] = true;
                                }; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_delta_seconds() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_DIGIT();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_DIGIT();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, delta_seconds) {
                                return parseInt(delta_seconds.join("")); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_qvalue() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        if (input.charCodeAt(pos) === 48) {
          result0 = "0";
          pos++;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"0\"");
          }
        }
        if (result0 !== null) {
          pos2 = pos;
          if (input.charCodeAt(pos) === 46) {
            result1 = ".";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\".\"");
            }
          }
          if (result1 !== null) {
            result2 = parse_DIGIT();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse_DIGIT();
              result3 = result3 !== null ? result3 : "";
              if (result3 !== null) {
                result4 = parse_DIGIT();
                result4 = result4 !== null ? result4 : "";
                if (result4 !== null) {
                  result1 = [result1, result2, result3, result4];
                } else {
                  result1 = null;
                  pos = pos2;
                }
              } else {
                result1 = null;
                pos = pos2;
              }
            } else {
              result1 = null;
              pos = pos2;
            }
          } else {
            result1 = null;
            pos = pos2;
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                                return parseFloat(input.substring(pos, offset)); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_generic_param() {
        var result0, result1, result2;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_token();
        if (result0 !== null) {
          pos2 = pos;
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_gen_value();
            if (result2 !== null) {
              result1 = [result1, result2];
            } else {
              result1 = null;
              pos = pos2;
            }
          } else {
            result1 = null;
            pos = pos2;
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, param, value) {
                                if(typeof value === 'undefined')
                                  var value = null;
                                else
                                  value = value[1];
                                return [ param, value ]; })(pos0, result0[0], result0[1]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_gen_value() {
        var result0;
        
        result0 = parse_token();
        if (result0 === null) {
          result0 = parse_host();
          if (result0 === null) {
            result0 = parse_quoted_string();
          }
        }
        return result0;
      }
      
      function parse_Content_Disposition() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_disp_type();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_SEMI();
          if (result2 !== null) {
            result3 = parse_disp_param();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_SEMI();
            if (result2 !== null) {
              result3 = parse_disp_param();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_disp_type() {
        var result0;
        
        if (input.substr(pos, 6) === "render") {
          result0 = "render";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"render\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 7) === "session") {
            result0 = "session";
            pos += 7;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"session\"");
            }
          }
          if (result0 === null) {
            if (input.substr(pos, 4) === "icon") {
              result0 = "icon";
              pos += 4;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"icon\"");
              }
            }
            if (result0 === null) {
              if (input.substr(pos, 5) === "alert") {
                result0 = "alert";
                pos += 5;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"alert\"");
                }
              }
              if (result0 === null) {
                result0 = parse_token();
              }
            }
          }
        }
        return result0;
      }
      
      function parse_disp_param() {
        var result0;
        
        result0 = parse_handling_param();
        if (result0 === null) {
          result0 = parse_generic_param();
        }
        return result0;
      }
      
      function parse_handling_param() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        if (input.substr(pos, 8) === "handling") {
          result0 = "handling";
          pos += 8;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"handling\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            if (input.substr(pos, 8) === "optional") {
              result2 = "optional";
              pos += 8;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"optional\"");
              }
            }
            if (result2 === null) {
              if (input.substr(pos, 8) === "required") {
                result2 = "required";
                pos += 8;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\"required\"");
                }
              }
              if (result2 === null) {
                result2 = parse_token();
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Content_Encoding() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_token();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_COMMA();
          if (result2 !== null) {
            result3 = parse_token();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_COMMA();
            if (result2 !== null) {
              result3 = parse_token();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Content_Length() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_DIGIT();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_DIGIT();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, length) {
                                data = parseInt(length.join('')); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Content_Type() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_media_type();
        if (result0 !== null) {
          result0 = (function(offset) {
                                data = input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_media_type() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_m_type();
        if (result0 !== null) {
          result1 = parse_SLASH();
          if (result1 !== null) {
            result2 = parse_m_subtype();
            if (result2 !== null) {
              result3 = [];
              pos1 = pos;
              result4 = parse_SEMI();
              if (result4 !== null) {
                result5 = parse_m_parameter();
                if (result5 !== null) {
                  result4 = [result4, result5];
                } else {
                  result4 = null;
                  pos = pos1;
                }
              } else {
                result4 = null;
                pos = pos1;
              }
              while (result4 !== null) {
                result3.push(result4);
                pos1 = pos;
                result4 = parse_SEMI();
                if (result4 !== null) {
                  result5 = parse_m_parameter();
                  if (result5 !== null) {
                    result4 = [result4, result5];
                  } else {
                    result4 = null;
                    pos = pos1;
                  }
                } else {
                  result4 = null;
                  pos = pos1;
                }
              }
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_m_type() {
        var result0;
        
        result0 = parse_discrete_type();
        if (result0 === null) {
          result0 = parse_composite_type();
        }
        return result0;
      }
      
      function parse_discrete_type() {
        var result0;
        
        if (input.substr(pos, 4) === "text") {
          result0 = "text";
          pos += 4;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"text\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 5) === "image") {
            result0 = "image";
            pos += 5;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"image\"");
            }
          }
          if (result0 === null) {
            if (input.substr(pos, 5) === "audio") {
              result0 = "audio";
              pos += 5;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"audio\"");
              }
            }
            if (result0 === null) {
              if (input.substr(pos, 5) === "video") {
                result0 = "video";
                pos += 5;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"video\"");
                }
              }
              if (result0 === null) {
                if (input.substr(pos, 11) === "application") {
                  result0 = "application";
                  pos += 11;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"application\"");
                  }
                }
                if (result0 === null) {
                  result0 = parse_extension_token();
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_composite_type() {
        var result0;
        
        if (input.substr(pos, 7) === "message") {
          result0 = "message";
          pos += 7;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"message\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 9) === "multipart") {
            result0 = "multipart";
            pos += 9;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"multipart\"");
            }
          }
          if (result0 === null) {
            result0 = parse_extension_token();
          }
        }
        return result0;
      }
      
      function parse_extension_token() {
        var result0;
        
        result0 = parse_token();
        if (result0 === null) {
          result0 = parse_x_token();
        }
        return result0;
      }
      
      function parse_x_token() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        if (input.substr(pos, 2) === "x-") {
          result0 = "x-";
          pos += 2;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"x-\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_token();
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_m_subtype() {
        var result0;
        
        result0 = parse_extension_token();
        if (result0 === null) {
          result0 = parse_token();
        }
        return result0;
      }
      
      function parse_m_parameter() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        result0 = parse_token();
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_m_value();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_m_value() {
        var result0;
        
        result0 = parse_token();
        if (result0 === null) {
          result0 = parse_quoted_string();
        }
        return result0;
      }
      
      function parse_CSeq() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        result0 = parse_CSeq_value();
        if (result0 !== null) {
          result1 = parse_LWS();
          if (result1 !== null) {
            result2 = parse_Method();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_CSeq_value() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_DIGIT();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_DIGIT();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, cseq_value) {
                          data.value=parseInt(cseq_value.join("")); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Expires() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_delta_seconds();
        if (result0 !== null) {
          result0 = (function(offset, expires) {data = expires; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Event() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_event_type();
        if (result0 !== null) {
          result1 = [];
          pos2 = pos;
          result2 = parse_SEMI();
          if (result2 !== null) {
            result3 = parse_event_param();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos2;
            }
          } else {
            result2 = null;
            pos = pos2;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos2 = pos;
            result2 = parse_SEMI();
            if (result2 !== null) {
              result3 = parse_event_param();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos2;
              }
            } else {
              result2 = null;
              pos = pos2;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, event_type) {
                               data.event = event_type.join(''); })(pos0, result0[0]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_event_type() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_token_nodot();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          if (input.charCodeAt(pos) === 46) {
            result2 = ".";
            pos++;
          } else {
            result2 = null;
            if (reportFailures === 0) {
              matchFailed("\".\"");
            }
          }
          if (result2 !== null) {
            result3 = parse_token_nodot();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            if (input.charCodeAt(pos) === 46) {
              result2 = ".";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\".\"");
              }
            }
            if (result2 !== null) {
              result3 = parse_token_nodot();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_event_param() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_generic_param();
        if (result0 !== null) {
          result0 = (function(offset, e_v) {
                              if(!data.params) data.params = {};
                              if(e_v[1]) {
                                data.params[e_v[0]] = e_v[1];
                              }
                              else {
                                data.params[e_v[0]] = true;
                              }; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_From() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_addr_spec_simple();
        if (result0 === null) {
          result0 = parse_name_addr();
        }
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_SEMI();
          if (result2 !== null) {
            result3 = parse_from_param();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_SEMI();
            if (result2 !== null) {
              result3 = parse_from_param();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_from_param() {
        var result0;
        
        result0 = parse_tag_param();
        if (result0 === null) {
          result0 = parse_generic_param();
        }
        return result0;
      }
      
      function parse_tag_param() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 3) === "tag") {
          result0 = "tag";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"tag\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_token();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, tag) {data.tag = tag; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Max_Forwards() {
        var result0, result1;
        var pos0;
        
        pos0 = pos;
        result1 = parse_DIGIT();
        if (result1 !== null) {
          result0 = [];
          while (result1 !== null) {
            result0.push(result1);
            result1 = parse_DIGIT();
          }
        } else {
          result0 = null;
        }
        if (result0 !== null) {
          result0 = (function(offset, forwards) {
                          data = parseInt(forwards.join("")); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Min_Expires() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_delta_seconds();
        if (result0 !== null) {
          result0 = (function(offset, min_expires) {data = min_expires; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Proxy_Authenticate() {
        var result0;
        
        result0 = parse_challenge();
        return result0;
      }
      
      function parse_challenge() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        if (input.substr(pos, 6) === "Digest") {
          result0 = "Digest";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"Digest\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_LWS();
          if (result1 !== null) {
            result2 = parse_digest_cln();
            if (result2 !== null) {
              result3 = [];
              pos1 = pos;
              result4 = parse_COMMA();
              if (result4 !== null) {
                result5 = parse_digest_cln();
                if (result5 !== null) {
                  result4 = [result4, result5];
                } else {
                  result4 = null;
                  pos = pos1;
                }
              } else {
                result4 = null;
                pos = pos1;
              }
              while (result4 !== null) {
                result3.push(result4);
                pos1 = pos;
                result4 = parse_COMMA();
                if (result4 !== null) {
                  result5 = parse_digest_cln();
                  if (result5 !== null) {
                    result4 = [result4, result5];
                  } else {
                    result4 = null;
                    pos = pos1;
                  }
                } else {
                  result4 = null;
                  pos = pos1;
                }
              }
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        if (result0 === null) {
          result0 = parse_other_challenge();
        }
        return result0;
      }
      
      function parse_other_challenge() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_token();
        if (result0 !== null) {
          result1 = parse_LWS();
          if (result1 !== null) {
            result2 = parse_auth_param();
            if (result2 !== null) {
              result3 = [];
              pos1 = pos;
              result4 = parse_COMMA();
              if (result4 !== null) {
                result5 = parse_auth_param();
                if (result5 !== null) {
                  result4 = [result4, result5];
                } else {
                  result4 = null;
                  pos = pos1;
                }
              } else {
                result4 = null;
                pos = pos1;
              }
              while (result4 !== null) {
                result3.push(result4);
                pos1 = pos;
                result4 = parse_COMMA();
                if (result4 !== null) {
                  result5 = parse_auth_param();
                  if (result5 !== null) {
                    result4 = [result4, result5];
                  } else {
                    result4 = null;
                    pos = pos1;
                  }
                } else {
                  result4 = null;
                  pos = pos1;
                }
              }
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_auth_param() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        result0 = parse_token();
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_token();
            if (result2 === null) {
              result2 = parse_quoted_string();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_digest_cln() {
        var result0;
        
        result0 = parse_realm();
        if (result0 === null) {
          result0 = parse_domain();
          if (result0 === null) {
            result0 = parse_nonce();
            if (result0 === null) {
              result0 = parse_opaque();
              if (result0 === null) {
                result0 = parse_stale();
                if (result0 === null) {
                  result0 = parse_algorithm();
                  if (result0 === null) {
                    result0 = parse_qop_options();
                    if (result0 === null) {
                      result0 = parse_auth_param();
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_realm() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        if (input.substr(pos, 5) === "realm") {
          result0 = "realm";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"realm\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_realm_value();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_realm_value() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_quoted_string();
        if (result0 !== null) {
          result0 = (function(offset, realm) {data.realm = realm; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_domain() {
        var result0, result1, result2, result3, result4, result5, result6;
        var pos0, pos1;
        
        pos0 = pos;
        if (input.substr(pos, 6) === "domain") {
          result0 = "domain";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"domain\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_LDQUOT();
            if (result2 !== null) {
              result3 = parse_URI();
              if (result3 !== null) {
                result4 = [];
                pos1 = pos;
                result6 = parse_SP();
                if (result6 !== null) {
                  result5 = [];
                  while (result6 !== null) {
                    result5.push(result6);
                    result6 = parse_SP();
                  }
                } else {
                  result5 = null;
                }
                if (result5 !== null) {
                  result6 = parse_URI();
                  if (result6 !== null) {
                    result5 = [result5, result6];
                  } else {
                    result5 = null;
                    pos = pos1;
                  }
                } else {
                  result5 = null;
                  pos = pos1;
                }
                while (result5 !== null) {
                  result4.push(result5);
                  pos1 = pos;
                  result6 = parse_SP();
                  if (result6 !== null) {
                    result5 = [];
                    while (result6 !== null) {
                      result5.push(result6);
                      result6 = parse_SP();
                    }
                  } else {
                    result5 = null;
                  }
                  if (result5 !== null) {
                    result6 = parse_URI();
                    if (result6 !== null) {
                      result5 = [result5, result6];
                    } else {
                      result5 = null;
                      pos = pos1;
                    }
                  } else {
                    result5 = null;
                    pos = pos1;
                  }
                }
                if (result4 !== null) {
                  result5 = parse_RDQUOT();
                  if (result5 !== null) {
                    result0 = [result0, result1, result2, result3, result4, result5];
                  } else {
                    result0 = null;
                    pos = pos0;
                  }
                } else {
                  result0 = null;
                  pos = pos0;
                }
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_URI() {
        var result0;
        
        result0 = parse_absoluteURI();
        if (result0 === null) {
          result0 = parse_abs_path();
        }
        return result0;
      }
      
      function parse_nonce() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        if (input.substr(pos, 5) === "nonce") {
          result0 = "nonce";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"nonce\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_nonce_value();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_nonce_value() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_quoted_string();
        if (result0 !== null) {
          result0 = (function(offset, nonce) {data.nonce=nonce; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_opaque() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 6) === "opaque") {
          result0 = "opaque";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"opaque\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_quoted_string();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, opaque) {
                                data.opaque=opaque; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_stale() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "stale") {
          result0 = "stale";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"stale\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            if (input.substr(pos, 4) === "true") {
              result2 = "true";
              pos += 4;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"true\"");
              }
            }
            if (result2 === null) {
              if (input.substr(pos, 5) === "false") {
                result2 = "false";
                pos += 5;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\"false\"");
                }
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, stale) {
                                data.stale=stale; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_algorithm() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 9) === "algorithm") {
          result0 = "algorithm";
          pos += 9;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"algorithm\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            if (input.substr(pos, 3) === "MD5") {
              result2 = "MD5";
              pos += 3;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"MD5\"");
              }
            }
            if (result2 === null) {
              if (input.substr(pos, 8) === "MD5-sess") {
                result2 = "MD5-sess";
                pos += 8;
              } else {
                result2 = null;
                if (reportFailures === 0) {
                  matchFailed("\"MD5-sess\"");
                }
              }
              if (result2 === null) {
                result2 = parse_token();
              }
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, algorithm) {
                              data.algorithm=algorithm; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_qop_options() {
        var result0, result1, result2, result3, result4, result5, result6;
        var pos0, pos1, pos2, pos3;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 3) === "qop") {
          result0 = "qop";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"qop\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_LDQUOT();
            if (result2 !== null) {
              pos2 = pos;
              result3 = parse_qop_value();
              if (result3 !== null) {
                result4 = [];
                pos3 = pos;
                if (input.charCodeAt(pos) === 44) {
                  result5 = ",";
                  pos++;
                } else {
                  result5 = null;
                  if (reportFailures === 0) {
                    matchFailed("\",\"");
                  }
                }
                if (result5 !== null) {
                  result6 = parse_qop_value();
                  if (result6 !== null) {
                    result5 = [result5, result6];
                  } else {
                    result5 = null;
                    pos = pos3;
                  }
                } else {
                  result5 = null;
                  pos = pos3;
                }
                while (result5 !== null) {
                  result4.push(result5);
                  pos3 = pos;
                  if (input.charCodeAt(pos) === 44) {
                    result5 = ",";
                    pos++;
                  } else {
                    result5 = null;
                    if (reportFailures === 0) {
                      matchFailed("\",\"");
                    }
                  }
                  if (result5 !== null) {
                    result6 = parse_qop_value();
                    if (result6 !== null) {
                      result5 = [result5, result6];
                    } else {
                      result5 = null;
                      pos = pos3;
                    }
                  } else {
                    result5 = null;
                    pos = pos3;
                  }
                }
                if (result4 !== null) {
                  result3 = [result3, result4];
                } else {
                  result3 = null;
                  pos = pos2;
                }
              } else {
                result3 = null;
                pos = pos2;
              }
              if (result3 !== null) {
                result4 = parse_RDQUOT();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, qop) {
                              data.qop= input.substring(pos-1, offset+5); })(pos0, result0[3]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_qop_value() {
        var result0;
        
        if (input.substr(pos, 8) === "auth-int") {
          result0 = "auth-int";
          pos += 8;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"auth-int\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 4) === "auth") {
            result0 = "auth";
            pos += 4;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"auth\"");
            }
          }
          if (result0 === null) {
            result0 = parse_token();
          }
        }
        return result0;
      }
      
      function parse_Proxy_Require() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_token();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_COMMA();
          if (result2 !== null) {
            result3 = parse_token();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_COMMA();
            if (result2 !== null) {
              result3 = parse_token();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Record_Route() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_rec_route();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_COMMA();
          if (result2 !== null) {
            result3 = parse_rec_route();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_COMMA();
            if (result2 !== null) {
              result3 = parse_rec_route();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_rec_route() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_name_addr();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_SEMI();
          if (result2 !== null) {
            result3 = parse_generic_param();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_SEMI();
            if (result2 !== null) {
              result3 = parse_generic_param();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Require() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_token();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_COMMA();
          if (result2 !== null) {
            result3 = parse_token();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_COMMA();
            if (result2 !== null) {
              result3 = parse_token();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Route() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_route_param();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_COMMA();
          if (result2 !== null) {
            result3 = parse_route_param();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_COMMA();
            if (result2 !== null) {
              result3 = parse_route_param();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_route_param() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_name_addr();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_SEMI();
          if (result2 !== null) {
            result3 = parse_generic_param();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_SEMI();
            if (result2 !== null) {
              result3 = parse_generic_param();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_Subscription_State() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_substate_value();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_SEMI();
          if (result2 !== null) {
            result3 = parse_subexp_params();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_SEMI();
            if (result2 !== null) {
              result3 = parse_subexp_params();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_substate_value() {
        var result0;
        var pos0;
        
        pos0 = pos;
        if (input.substr(pos, 6) === "active") {
          result0 = "active";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"active\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 7) === "pending") {
            result0 = "pending";
            pos += 7;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"pending\"");
            }
          }
          if (result0 === null) {
            if (input.substr(pos, 10) === "terminated") {
              result0 = "terminated";
              pos += 10;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"terminated\"");
              }
            }
            if (result0 === null) {
              result0 = parse_token();
            }
          }
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                                data.state = input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_subexp_params() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 6) === "reason") {
          result0 = "reason";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"reason\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_event_reason_value();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, reason) {
                                if (typeof reason !== 'undefined') data.reason = reason; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        if (result0 === null) {
          pos0 = pos;
          pos1 = pos;
          if (input.substr(pos, 7) === "expires") {
            result0 = "expires";
            pos += 7;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"expires\"");
            }
          }
          if (result0 !== null) {
            result1 = parse_EQUAL();
            if (result1 !== null) {
              result2 = parse_delta_seconds();
              if (result2 !== null) {
                result0 = [result0, result1, result2];
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
          if (result0 !== null) {
            result0 = (function(offset, expires) {
                                  if (typeof expires !== 'undefined') data.expires = expires; })(pos0, result0[2]);
          }
          if (result0 === null) {
            pos = pos0;
          }
          if (result0 === null) {
            pos0 = pos;
            pos1 = pos;
            if (input.substr(pos, 11) === "retry_after") {
              result0 = "retry_after";
              pos += 11;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"retry_after\"");
              }
            }
            if (result0 !== null) {
              result1 = parse_EQUAL();
              if (result1 !== null) {
                result2 = parse_delta_seconds();
                if (result2 !== null) {
                  result0 = [result0, result1, result2];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
            if (result0 !== null) {
              result0 = (function(offset, retry_after) {
                                    if (typeof retry_after !== 'undefined') data.retry_after = retry_after; })(pos0, result0[2]);
            }
            if (result0 === null) {
              pos = pos0;
            }
            if (result0 === null) {
              pos0 = pos;
              result0 = parse_generic_param();
              if (result0 !== null) {
                result0 = (function(offset, g_p) {
                                      if (typeof g_p !== 'undefined') {
                                        if(!data.params) data.params = {};
                                        if(g_p[1]) data.params[g_p[0]] = g_p[1];
                                        else data.params[g_p[0]] = true;
                                     }; })(pos0, result0);
              }
              if (result0 === null) {
                pos = pos0;
              }
            }
          }
        }
        return result0;
      }
      
      function parse_event_reason_value() {
        var result0;
        
        if (input.substr(pos, 11) === "deactivated") {
          result0 = "deactivated";
          pos += 11;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"deactivated\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 9) === "probation") {
            result0 = "probation";
            pos += 9;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"probation\"");
            }
          }
          if (result0 === null) {
            if (input.substr(pos, 8) === "rejected") {
              result0 = "rejected";
              pos += 8;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"rejected\"");
              }
            }
            if (result0 === null) {
              if (input.substr(pos, 7) === "timeout") {
                result0 = "timeout";
                pos += 7;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"timeout\"");
                }
              }
              if (result0 === null) {
                if (input.substr(pos, 6) === "giveup") {
                  result0 = "giveup";
                  pos += 6;
                } else {
                  result0 = null;
                  if (reportFailures === 0) {
                    matchFailed("\"giveup\"");
                  }
                }
                if (result0 === null) {
                  if (input.substr(pos, 10) === "noresource") {
                    result0 = "noresource";
                    pos += 10;
                  } else {
                    result0 = null;
                    if (reportFailures === 0) {
                      matchFailed("\"noresource\"");
                    }
                  }
                  if (result0 === null) {
                    if (input.substr(pos, 9) === "invariant") {
                      result0 = "invariant";
                      pos += 9;
                    } else {
                      result0 = null;
                      if (reportFailures === 0) {
                        matchFailed("\"invariant\"");
                      }
                    }
                    if (result0 === null) {
                      result0 = parse_token();
                    }
                  }
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_Subject() {
        var result0;
        
        result0 = parse_TEXT_UTF8_TRIM();
        result0 = result0 !== null ? result0 : "";
        return result0;
      }
      
      function parse_Supported() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_token();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_COMMA();
          if (result2 !== null) {
            result3 = parse_token();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_COMMA();
            if (result2 !== null) {
              result3 = parse_token();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        result0 = result0 !== null ? result0 : "";
        return result0;
      }
      
      function parse_To() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_addr_spec_simple();
        if (result0 === null) {
          result0 = parse_name_addr();
        }
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_SEMI();
          if (result2 !== null) {
            result3 = parse_to_param();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_SEMI();
            if (result2 !== null) {
              result3 = parse_to_param();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_to_param() {
        var result0;
        
        result0 = parse_tag_param();
        if (result0 === null) {
          result0 = parse_generic_param();
        }
        return result0;
      }
      
      function parse_Via() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_via_parm();
        if (result0 !== null) {
          result1 = [];
          pos1 = pos;
          result2 = parse_COMMA();
          if (result2 !== null) {
            result3 = parse_via_parm();
            if (result3 !== null) {
              result2 = [result2, result3];
            } else {
              result2 = null;
              pos = pos1;
            }
          } else {
            result2 = null;
            pos = pos1;
          }
          while (result2 !== null) {
            result1.push(result2);
            pos1 = pos;
            result2 = parse_COMMA();
            if (result2 !== null) {
              result3 = parse_via_parm();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_via_parm() {
        var result0, result1, result2, result3, result4, result5;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_sent_protocol();
        if (result0 !== null) {
          result1 = parse_LWS();
          if (result1 !== null) {
            result2 = parse_sent_by();
            if (result2 !== null) {
              result3 = [];
              pos1 = pos;
              result4 = parse_SEMI();
              if (result4 !== null) {
                result5 = parse_via_params();
                if (result5 !== null) {
                  result4 = [result4, result5];
                } else {
                  result4 = null;
                  pos = pos1;
                }
              } else {
                result4 = null;
                pos = pos1;
              }
              while (result4 !== null) {
                result3.push(result4);
                pos1 = pos;
                result4 = parse_SEMI();
                if (result4 !== null) {
                  result5 = parse_via_params();
                  if (result5 !== null) {
                    result4 = [result4, result5];
                  } else {
                    result4 = null;
                    pos = pos1;
                  }
                } else {
                  result4 = null;
                  pos = pos1;
                }
              }
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_via_params() {
        var result0;
        
        result0 = parse_via_ttl();
        if (result0 === null) {
          result0 = parse_via_maddr();
          if (result0 === null) {
            result0 = parse_via_received();
            if (result0 === null) {
              result0 = parse_via_branch();
              if (result0 === null) {
                result0 = parse_response_port();
                if (result0 === null) {
                  result0 = parse_generic_param();
                }
              }
            }
          }
        }
        return result0;
      }
      
      function parse_via_ttl() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 3) === "ttl") {
          result0 = "ttl";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"ttl\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_ttl();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, via_ttl_value) {
                              data.ttl = via_ttl_value; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_via_maddr() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "maddr") {
          result0 = "maddr";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"maddr\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_host();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, via_maddr) {
                              data.maddr = via_maddr; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_via_received() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 8) === "received") {
          result0 = "received";
          pos += 8;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"received\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_IPv4address();
            if (result2 === null) {
              result2 = parse_IPv6address();
            }
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, via_received) {
                              data.received = via_received; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_via_branch() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 6) === "branch") {
          result0 = "branch";
          pos += 6;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"branch\"");
          }
        }
        if (result0 !== null) {
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = parse_token();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, via_branch) {
                              data.branch = via_branch; })(pos0, result0[2]);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_response_port() {
        var result0, result1, result2, result3;
        var pos0, pos1, pos2;
        
        pos0 = pos;
        pos1 = pos;
        if (input.substr(pos, 5) === "rport") {
          result0 = "rport";
          pos += 5;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"rport\"");
          }
        }
        if (result0 !== null) {
          pos2 = pos;
          result1 = parse_EQUAL();
          if (result1 !== null) {
            result2 = [];
            result3 = parse_DIGIT();
            while (result3 !== null) {
              result2.push(result3);
              result3 = parse_DIGIT();
            }
            if (result2 !== null) {
              result1 = [result1, result2];
            } else {
              result1 = null;
              pos = pos2;
            }
          } else {
            result1 = null;
            pos = pos2;
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                              if(typeof response_port !== 'undefined')
                                data.rport = response_port.join(""); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_sent_protocol() {
        var result0, result1, result2, result3, result4;
        var pos0;
        
        pos0 = pos;
        result0 = parse_protocol_name();
        if (result0 !== null) {
          result1 = parse_SLASH();
          if (result1 !== null) {
            result2 = parse_token();
            if (result2 !== null) {
              result3 = parse_SLASH();
              if (result3 !== null) {
                result4 = parse_transport();
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos0;
                }
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_protocol_name() {
        var result0;
        var pos0;
        
        pos0 = pos;
        if (input.substr(pos, 3) === "SIP") {
          result0 = "SIP";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"SIP\"");
          }
        }
        if (result0 === null) {
          result0 = parse_token();
        }
        if (result0 !== null) {
          result0 = (function(offset, via_protocol) {
                              data.protocol = via_protocol; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_transport() {
        var result0;
        var pos0;
        
        pos0 = pos;
        if (input.substr(pos, 3) === "UDP") {
          result0 = "UDP";
          pos += 3;
        } else {
          result0 = null;
          if (reportFailures === 0) {
            matchFailed("\"UDP\"");
          }
        }
        if (result0 === null) {
          if (input.substr(pos, 3) === "TCP") {
            result0 = "TCP";
            pos += 3;
          } else {
            result0 = null;
            if (reportFailures === 0) {
              matchFailed("\"TCP\"");
            }
          }
          if (result0 === null) {
            if (input.substr(pos, 3) === "TLS") {
              result0 = "TLS";
              pos += 3;
            } else {
              result0 = null;
              if (reportFailures === 0) {
                matchFailed("\"TLS\"");
              }
            }
            if (result0 === null) {
              if (input.substr(pos, 4) === "SCTP") {
                result0 = "SCTP";
                pos += 4;
              } else {
                result0 = null;
                if (reportFailures === 0) {
                  matchFailed("\"SCTP\"");
                }
              }
              if (result0 === null) {
                result0 = parse_token();
              }
            }
          }
        }
        if (result0 !== null) {
          result0 = (function(offset, via_transport) {
                              data.transport = via_transport; })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_sent_by() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        result0 = parse_via_host();
        if (result0 !== null) {
          pos1 = pos;
          result1 = parse_COLON();
          if (result1 !== null) {
            result2 = parse_via_port();
            if (result2 !== null) {
              result1 = [result1, result2];
            } else {
              result1 = null;
              pos = pos1;
            }
          } else {
            result1 = null;
            pos = pos1;
          }
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_via_host() {
        var result0;
        var pos0;
        
        pos0 = pos;
        result0 = parse_hostname();
        if (result0 === null) {
          result0 = parse_IPv4address();
          if (result0 === null) {
            result0 = parse_IPv6reference();
          }
        }
        if (result0 !== null) {
          result0 = (function(offset) {
                              data.host = input.substring(pos, offset); })(pos0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_via_port() {
        var result0, result1, result2, result3, result4;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_DIGIT();
        result0 = result0 !== null ? result0 : "";
        if (result0 !== null) {
          result1 = parse_DIGIT();
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result2 = parse_DIGIT();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse_DIGIT();
              result3 = result3 !== null ? result3 : "";
              if (result3 !== null) {
                result4 = parse_DIGIT();
                result4 = result4 !== null ? result4 : "";
                if (result4 !== null) {
                  result0 = [result0, result1, result2, result3, result4];
                } else {
                  result0 = null;
                  pos = pos1;
                }
              } else {
                result0 = null;
                pos = pos1;
              }
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, via_sent_by_port) {
                              data.port = parseInt(via_sent_by_port.join("")); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_ttl() {
        var result0, result1, result2;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_DIGIT();
        if (result0 !== null) {
          result1 = parse_DIGIT();
          result1 = result1 !== null ? result1 : "";
          if (result1 !== null) {
            result2 = parse_DIGIT();
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos1;
            }
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        if (result0 !== null) {
          result0 = (function(offset, ttl) {
                              return parseInt(ttl.join("")); })(pos0, result0);
        }
        if (result0 === null) {
          pos = pos0;
        }
        return result0;
      }
      
      function parse_WWW_Authenticate() {
        var result0;
        
        result0 = parse_challenge();
        return result0;
      }
      
      function parse_extension_header() {
        var result0, result1, result2;
        var pos0;
        
        pos0 = pos;
        result0 = parse_token();
        if (result0 !== null) {
          result1 = parse_HCOLON();
          if (result1 !== null) {
            result2 = parse_header_value();
            if (result2 !== null) {
              result0 = [result0, result1, result2];
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      function parse_header_value() {
        var result0, result1;
        
        result0 = [];
        result1 = parse_TEXT_UTF8char();
        if (result1 === null) {
          result1 = parse_UTF8_CONT();
          if (result1 === null) {
            result1 = parse_LWS();
          }
        }
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_TEXT_UTF8char();
          if (result1 === null) {
            result1 = parse_UTF8_CONT();
            if (result1 === null) {
              result1 = parse_LWS();
            }
          }
        }
        return result0;
      }
      
      function parse_message_body() {
        var result0, result1;
        
        result0 = [];
        result1 = parse_OCTET();
        while (result1 !== null) {
          result0.push(result1);
          result1 = parse_OCTET();
        }
        return result0;
      }
      
      function parse_lazy_uri() {
        var result0, result1, result2, result3;
        var pos0, pos1;
        
        pos0 = pos;
        pos1 = pos;
        result0 = parse_uri_scheme();
        if (result0 !== null) {
          if (input.charCodeAt(pos) === 58) {
            result1 = ":";
            pos++;
          } else {
            result1 = null;
            if (reportFailures === 0) {
              matchFailed("\":\"");
            }
          }
          if (result1 !== null) {
            result0 = [result0, result1];
          } else {
            result0 = null;
            pos = pos1;
          }
        } else {
          result0 = null;
          pos = pos1;
        }
        result0 = result0 !== null ? result0 : "";
        if (result0 !== null) {
          result1 = parse_user();
          if (result1 !== null) {
            pos1 = pos;
            if (input.charCodeAt(pos) === 64) {
              result2 = "@";
              pos++;
            } else {
              result2 = null;
              if (reportFailures === 0) {
                matchFailed("\"@\"");
              }
            }
            if (result2 !== null) {
              result3 = parse_hostport();
              if (result3 !== null) {
                result2 = [result2, result3];
              } else {
                result2 = null;
                pos = pos1;
              }
            } else {
              result2 = null;
              pos = pos1;
            }
            result2 = result2 !== null ? result2 : "";
            if (result2 !== null) {
              result3 = parse_uri_parameters();
              if (result3 !== null) {
                result0 = [result0, result1, result2, result3];
              } else {
                result0 = null;
                pos = pos0;
              }
            } else {
              result0 = null;
              pos = pos0;
            }
          } else {
            result0 = null;
            pos = pos0;
          }
        } else {
          result0 = null;
          pos = pos0;
        }
        return result0;
      }
      
      
      function cleanupExpected(expected) {
        expected.sort();
        
        var lastExpected = null;
        var cleanExpected = [];
        for (var i = 0; i < expected.length; i++) {
          if (expected[i] !== lastExpected) {
            cleanExpected.push(expected[i]);
            lastExpected = expected[i];
          }
        }
        return cleanExpected;
      }
      
      function computeErrorPosition() {
        /*
         * The first idea was to use |String.split| to break the input up to the
         * error position along newlines and derive the line and column from
         * there. However IE's |split| implementation is so broken that it was
         * enough to prevent it.
         */
        
        var line = 1;
        var column = 1;
        var seenCR = false;
        
        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
          var ch = input.charAt(i);
          if (ch === "\n") {
            if (!seenCR) { line++; }
            column = 1;
            seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            line++;
            column = 1;
            seenCR = true;
          } else {
            column++;
            seenCR = false;
          }
        }
        
        return { line: line, column: column };
      }
      
       var data = {}; 
      
      var result = parseFunctions[startRule]();
      
      /*
       * The parser is now in one of the following three states:
       *
       * 1. The parser successfully parsed the whole input.
       *
       *    - |result !== null|
       *    - |pos === input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 2. The parser successfully parsed only a part of the input.
       *
       *    - |result !== null|
       *    - |pos < input.length|
       *    - |rightmostFailuresExpected| may or may not contain something
       *
       * 3. The parser did not successfully parse any part of the input.
       *
       *   - |result === null|
       *   - |pos === 0|
       *   - |rightmostFailuresExpected| contains at least one failure
       *
       * All code following this comment (including called functions) must
       * handle these states.
       */
      if (result === null || pos !== input.length) {
        var offset = Math.max(pos, rightmostFailuresPos);
        var found = offset < input.length ? input.charAt(offset) : null;
        var errorPosition = computeErrorPosition();
        
        new this.SyntaxError(
          cleanupExpected(rightmostFailuresExpected),
          found,
          offset,
          errorPosition.line,
          errorPosition.column
        );

        return -1;
      }
      
      return data;
    },
    
    /* Returns the parser source code. */
    toSource: function() { return this._source; }
  };
  
  /* Thrown when a parser encounters a syntax error. */
  
  result.SyntaxError = function(expected, found, offset, line, column) {
    function buildMessage(expected, found) {
      var expectedHumanized, foundHumanized;
      
      switch (expected.length) {
        case 0:
          expectedHumanized = "end of input";
          break;
        case 1:
          expectedHumanized = expected[0];
          break;
        default:
          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
            + " or "
            + expected[expected.length - 1];
      }
      
      foundHumanized = found ? quote(found) : "end of input";
      
      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
    }
    
    this.name = "SyntaxError";
    this.expected = expected;
    this.found = found;
    this.message = buildMessage(expected, found);
    this.offset = offset;
    this.line = line;
    this.column = column;
  };
  
  result.SyntaxError.prototype = Error.prototype;
  
  return result;
})();
