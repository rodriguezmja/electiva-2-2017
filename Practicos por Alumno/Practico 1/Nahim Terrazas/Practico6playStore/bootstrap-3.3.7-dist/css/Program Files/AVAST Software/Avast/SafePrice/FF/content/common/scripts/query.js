var XMLHttpRequest = require("sdk/net/xhr").XMLHttpRequest;

(function(_, AvastSP, PROTO) {

  if (typeof(AvastSP)=="undefined") { AvastSP = {};}

  var HTTP_SERVER  = "http://ui.ff.avast.com",
      HTTP_PORT    = "80",
      HTTPS_SERVER = "https://uib.ff.avast.com",
      HTTPS_PORT   = "443",
      USE_HTTPS    = true;

  /*******************************************************************************
   *
   *  Query CONSTANTS
   *
   ******************************************************************************/
  AvastSP.Query = {
    CONST : {
      HEADERS : {
        //"Accept": "binary",
        //dataType: 'binary',
        "Content-Type": "application/octet-stream",
        //"Connection": "keep-alive" // refused in Chrome
      },
      //SERVER : "http://lon09.ff.avast.com",
      SERVER : USE_HTTPS ? HTTPS_SERVER : HTTP_SERVER,
      PORT   : USE_HTTPS ? HTTPS_PORT   : HTTP_PORT,
      HTTPS_SERVER: "https://uib.ff.avast.com:443",
      UPDATE_SERVER: "http://ui.ff.avast.com/v5/ruleUpdate",
      VOTE_SERVER: 'http://uiv.ff.avast.com/v3/urlVote',
      TA_SERVER: 'http://ta.ff.avast.com/F/', // 'http://ta.ff.avast.com/F/AAoH2YP6qRuPTnJl7LgVp8ur',
      OFFERS_SERVER: "http://cvp.ff.avast.com:80/offers",  //"http://ciuvoproxy-test2.ff.avast.com/offers",
      PICKED_OFFER_SERVER: "http://cvp.ff.avast.com/pickedOffer",
      URLINFO : "urlinfo",
      URLINFO_V4 : "v4/urlinfo",
      LOCAL_PORTS : [27275, 18821, 7754],
      LOCAL_PORT : null,
      LOCAL_TOKEN : null,
      GAMIFICATION_SERVER : "https://gamification.ff.avast.com:8743/receiver"
    }
  };

  /*******************************************************************************
   *
   *  Query Master Class
   *
   ******************************************************************************/
  AvastSP.Query.__MASTER__ = {
    completed : false,
    /**
     * Initialize UrlInfo request.
     * @return {[type]} [description]
     */
    init : function(){
      this.headers = _.extend({}, AvastSP.Query.CONST.HEADERS, this.headers);
      // Populate proto message
      this.message();
      // Send it to server
      if(this.options.go) this.post();
    },
    headers : {},
    /**
     * Set an option value
     * @param {String} option Property name
     * @param {}     value  Property value
     */
    set : function (option, value) {
      this.options[option] = value;
      return this;
    },
    /**
     * Get an option value
     * @param  {String} option Property name
     * @return {}           Property value
     */
    get : function (option) {
      return this.options[option];
    },
    /**
     * return json string of the message
     * @return {Object} Json representation of the GPB message
     */
    toJSON : function(){

      // return AvastSP.Utils.gpbToJSON(this.response);
      var protoJSON = function (p) {
        var res = {};
        for(var prop in p.values_) {
          if(p.values_[prop].length) {
            // repeated message
            res[prop] = [];
            for(var i=0, j=p.values_[prop].length; i<j; i++) {
              res[prop].push(protoJSON(p.values_[prop][i]));
            }
          } else if(p.values_[prop].properties_){
            // composite message

              res[prop] = {};
            for(var krop in p.values_[prop].values_) {
              if(p.values_[prop].values_[krop] instanceof PROTO.I64) {
                // convert PROTO.I64 to number
                res[prop][krop] = p.values_[prop].values_[krop].toNumber();
              }else {
                res[prop][krop] = p.values_[prop].values_[krop];
              }
            }
          } else {
            // value :: deprecated - remove it
            res[prop] = p.values_[prop];
          }
        }
        return res;
      };
      return protoJSON(this.response);
    },
    /**
     * Send request to server
     * @return {Object} Self reference
     */
    post : function(){
      var buffer = this.getBuffer(this.request);

      var self = this;
      var xhr = new XMLHttpRequest();
      xhr.open(this.options.method.toUpperCase(), this.options.server, true);
      xhr.responseType = "arraybuffer";
      xhr.withCredentials = true;
      xhr.timeout = this.options.timeout || 0; // default to no timeout

      for(var prop in this.headers) {
        xhr.setRequestHeader(prop, this.headers[prop]);
      }

      xhr.onload = function(e) {
              self.callback(xhr.response);
      };
      xhr.onerror = function() {
        self.error(xhr);
      };
      xhr.ontimeout = function() {
        self.error(xhr);
      };
      xhr.send(buffer);

      return this;
    },
    /**
     * Convert message to ArrayBuffer
     * @param  {Object} message Message instance
     * @return {Array}         Array Buffer
     */
    getBuffer : function(message){

      var stream = new PROTO.ByteArrayStream;
      message.SerializeToStream(stream);
      return this.baToab(stream.getArray());
    },
    /**
     * Handle server response
     * @param  {Array}   arrayBuffer Incoming message
     * @return {void}
     */
    callback : function (arrayBuffer) {
      var format = this.options.format;
      var res = null;
      if ('string' === format) {
        res = String.fromCharCode.apply(String, this.abToba(arrayBuffer));
      } else {
        this.parser(arrayBuffer);

        if(this.updateCache) { this.updateCache(); }

        if('json' === format) {
          res = this.toJSON();
        }
        else if('object' === format) {
          res = this.format();
        }
        else {
          res = this.response;
        }
      }
      this.options.callback(res);
      this.completed = true;
    },
    /**
     * Handle error responses
     * @param  {Object} xhr xmlhttp request object
     * @return {void}
     */
    error : function(xhr){
      if(this.options.error) this.options.error(xhr);
    },
    /**
     * Placeholder - each Instance can override this to format the message
     * @return {[type]} [description]
     */

    format : function(){
      return { error : "This call has now formatting message.", message: this.response };
    },
    /**
     * parse arrayBuffer into a ProtoJS response
     * @param  {Array} arrayBuffer
     * @return {void}
     */
    parser : function (arrayBuffer){
      this.response.ParseFromStream(new PROTO.ByteArrayStream(this.abToba(arrayBuffer)));
    },
    /**
     * ByteArray to ArrayBuffer
     * @param  {Object} data [description]
     * @return {Array}
     */
    baToab: function(data){
      var buf = new ArrayBuffer(data.length);

      var bytes = new Uint8Array(buf);
      for(var i = 0; i < bytes.length; i++) {
        bytes[i] = data[i] % 256;
      }

      return AvastSP.Utils.getBrowserInfo().isChrome() ? bytes : buf;
    },
    /**
     * ArrayBuffer to ByteArray
     * @param  {Array} arrayBuffer [description]
     * @return {Array}             [description]
     */
    abToba: function(arrayBuffer){
      if(arrayBuffer === null) return [];
      var bytes = new Uint8Array(arrayBuffer);
          var arr = [];
      for(var i = 0; i < bytes.length; i++) {
        arr[i] = bytes[i] % 256;
      }
          return arr;
    },
    setBaseIdentityIds : function(identity) {
      if (AvastSP.CONFIG.GUID != null) {
        identity.guid = PROTO.encodeUTF8(AvastSP.CONFIG.GUID);
      }
      if (AvastSP.CONFIG.AUID != null) {
        identity.auid = PROTO.encodeUTF8(AvastSP.CONFIG.AUID);
      }
      if (AvastSP.CONFIG.USERID != null) {
        identity.userid = PROTO.encodeUTF8(AvastSP.CONFIG.USERID);
      }
      return identity;
    },
    setExtIdentityIds : function(identity) {
      if (AvastSP.CONFIG.UUID != null) {
        identity.uuid = PROTO.encodeUTF8(AvastSP.CONFIG.UUID);
      }
      if (AvastSP.CONFIG.HWID != null) {
        identity.hwid = PROTO.encodeUTF8(AvastSP.CONFIG.HWID);
      }
      return identity;
    },
    /**
     * Format Identity message (base identity)
     * @param dnl - do not log = exclude user identification
     * @return {Object} GPB Identity message
     */
    identity : function(dnl) {
      var msg = new AvastSP.gpb.All.Identity;
      var browserInfo = AvastSP.Utils.getBrowserInfo();

      if (!dnl) {  msg = this.setBaseIdentityIds(msg); }

      msg.browserType = AvastSP.gpb.All.BrowserType[browserInfo.getBrowser()];

      msg.browserVersion = browserInfo.getBrowserVersion();

      return msg;
    },
    /**
     * Generate extended identity (w/ hwid + uuid) when required
     * @param dnl - do not log = exclude user identification
     */
    extIdentity : function(dnl) {
      var msg = this.identity(dnl);
      return dnl ? msg : this.setExtIdentityIds(msg);
    },
    /**
     * Generate clientIdentity for new UrlInfo format.
     * @param dnl - do not log = exclude user identification
     */
    clientIdentity : function(dnl) {
      var avIdentity = new AvastSP.gpb.All.AvastIdentity;
      var browserInfo = AvastSP.Utils.getBrowserInfo();

      if (!dnl) {
        avIdentity = this.setBaseIdentityIds(avIdentity);
        avIdentity = this.setExtIdentityIds(avIdentity);
      }

      var extInfo = new AvastSP.gpb.All.BrowserExtInfo;
      extInfo.extensionType = AvastSP.CONFIG.EXT_TYPE;
      extInfo.extensionVersion = AvastSP.CONFIG.EXT_VER;
      extInfo.dataVersion = AvastSP.CONFIG.DATA_VER;
      extInfo.browserType = AvastSP.gpb.All.BrowserType[browserInfo.getBrowser()];
      extInfo.browserVersion = browserInfo.getBrowserVersion();

      var client = new AvastSP.gpb.All.Client;
      client.id = avIdentity;
      client.type = AvastSP.gpb.All.Client.CType.BROWSER_EXT;
      client.browserExtInfo = extInfo;
      return client;
    }
  };

  /*******************************************************************************
   *
   *  avast! Program Communication
   *
   ******************************************************************************/

  AvastSP.Query.Avast = function(options){

      if(!options.type) {
        return;
      }

      this.options = _.extend({
        url : null,
        type : "GET_PROPERTIES",
        property : "",
        value : "",
        server : "http://localhost:"+AvastSP.Query.CONST.LOCAL_PORT+"/command",
        method : "post",
        callback : _.noop,
        //format : "json",      // return response in JSON
        go : true        // true = trigger the request immediately

      },options);

      if (AvastSP.Query.CONST.LOCAL_TOKEN) {
        this.headers = _.extend({ "X-AVAST-APP-ID": AvastSP.Query.CONST.LOCAL_TOKEN }, this.headers);
      }

      this.request = new AvastSP.gpb.All.LocalServerRequest;
      this.response = new AvastSP.gpb.All.LocalServerResponse;
      this.init();
  };

  AvastSP.Query.Avast.prototype = _.extend({},AvastSP.Query.__MASTER__,{
    message : function(type){
      var i,j;
      this.request.type = AvastSP.gpb.All.LocalServerRequest.CommandType[this.options.type];
      this.request.browser = 3;// AvastSP.gpb.All.BrowserType[AvastSP.Utils.Browser.get("browser")];

      switch(this.options.type){
        case "ACKNOWLEDGEMENT":
          this.request.params.push(PROTO.encodeUTF8(AvastSP.CONFIG.VERSION));
          break;
        case "GET_PROPERTY":
          this.request.params.push(PROTO.encodeUTF8("avastcfg://avast5/Common/"+this.options.property));
          break;
        case "SET_PROPERTY":
          this.request.params.push(PROTO.encodeUTF8("avastcfg://avast5/Common/"+this.options.property));
          this.request.params.push(PROTO.encodeUTF8(this.options.value));
          break;
        case "GET_PROPERTIES":
          for(i=0, j=this.options.params.length; i<j; i++){
            this.request.params.push(PROTO.encodeUTF8("avastcfg://avast5/Common/"+this.options.params[i]));
          }
          break;
        case "SET_PROPERTIES":
          for(i=0, j=this.options.params.length; i<j; i++){
            this.request.params.push(PROTO.encodeUTF8(
              "avastcfg://avast5/Common/" + this.options.params[i] + '=' + this.options.values[i]
            ));
          }
          break;
        case "IS_BANKING_SITE":
        case "IS_SAFEZONE_CUSTOM_SITE":
        case "SITECORRECT":
        case "SWITCH_TO_SAFEZONE":
          this.request.params.push(PROTO.encodeUTF8(this.options.value));
        break;
      }

      return this;
    }
  });

  /*******************************************************************************
   *
   *  UrlInfo
   *
   ******************************************************************************/

  AvastSP.Query.UrlInfo = function(options) {
      // no url, just stop right here
      if(!options.url) return false;
      if(typeof options == "string") options = {url: options};

      this.options = _.extend({
        url : null,
        visited : true,
        server : AvastSP.Query.CONST.SERVER + ":" + AvastSP.Query.CONST.PORT + "/" +
          (AvastSP.CONFIG.FEATURES.newUrlInfoVersion ? AvastSP.Query.CONST.URLINFO_V4 : AvastSP.Query.CONST.URLINFO),
        method : "post",
        webrep : true,
        phishing : true,
        blocker : false,
        typo : false,
        safeShop: 0,        // opt-in, not in cache by default
        callback : _.noop,
        format : "object",  // return response in JSON
        go : true           // true = trigger the request immediately
      },options);

      this.request = new AvastSP.gpb.All.UrlInfoRequest.Request;
      this.response = new AvastSP.gpb.All.UrlInfoRequest.Response;

      this.init();
  };

  AvastSP.Query.UrlInfo.prototype = _.extend({},AvastSP.Query.__MASTER__,{

    // build PROTO message
    message : function() {
      var dnl = (AvastSP.CONFIG.COMMUNITY_IQ === false);
      
      if(typeof this.options.url == "string") {
        this.request.uri.push(PROTO.encodeUTF8(this.options.url));
      } else {
        this.request.uri = this.options.url;
      }

      this.request.callerid = PROTO.I64.fromNumber(this.getCallerid());

      this.request.locale = ABEK.locale.getBrowserLocale();

      if (AvastSP.CONFIG.FEATURES.newUrlInfoVersion) {
        this.request.client = this.clientIdentity(dnl);
      } else {
        this.request.identity = this.extIdentity(dnl);
      }

      this.request.visited = this.options.visited; // bool

      this.request.referer = this.options.referer;
      this.request.tabNum = this.options.tabNum;
      this.request.windowNum = this.options.windowNum;
      this.request.windowEvent = this.options.windowEvent;

      // this.request.fullUris = this.options.fullUrls;

      this.request.safeShop = PROTO.I64.fromNumber(this.options.safeShop);

      // Requested service bitmask  (webrep 1, phishing 2) - webrep always, phishing not in multiple requested
      //var requestedServices = new AvastSP.Utils.BitWriter(0);
      //requestedServices.addBitmask(AvastSP.DEFAULTS.URLINFO_MASK.webrep);
      //if(this.options.visited) requestedServices.addBitmask(AvastSP.DEFAULTS.URLINFO_MASK.phishing);
      //this.request.requestedServices = requestedServices.getValue();
      //TODO - use settings here
      var requestedServices = this.options.reqServices || 0x00FF; // get all if not specified
      // if(this.options.visited){
      //   requestedServices |= AvastSP.DEFAULTS.URLINFO_MASK.siteCorrect;
      // }
      this.request.requestedServices = requestedServices;

      if ( dnl ) { this.request.dnl = true; }

      return this;
    },
    /**
     * Create an instance(s) of AvastSP.UrlInfo object
     * @return {Object}
     */
    format : function(){
      var json = this.toJSON();
      var res = [];
      for(var i=0, j=json.urlInfo.length; i<j; i++) {
         res[i] = new AvastSP.UrlInfo(this.options.url[i], json.urlInfo[i], !this.options.visited);
      }
      return res;
    },
    updateCache : function(){
      // TODO: update Cache >> currently handled elswhere - should be moved here.
    },
    updateRequest : function(){
      var msg = new AvastSP.gpb.All.UrlInfoRequest.UpdateRequest;

      return msg;
    },
    /**
     * url info message type
     * @return {Strinng} call
     */
    getCallerid : function() {
      return AvastSP.CONFIG.CALLERID;
    }
  });

  /************************************************************************************************************ 
  *   Gamification Application Event 
  ************************************************************************************************************/
  AvastSP.Query.ApplicationEvent = function(options) {
    var d = new Date();  
    // no url, just stop right here
    if((!AvastSP.CONFIG.GUID && !AvastSP.CONFIG.AUID) || !options.eventType) return false;
  
    this.options = _.extend({
      eventType : [0],
      eventTime : Math.floor(d.getTime()/1000),
      guid : AvastSP.CONFIG.GUID,
      auid : AvastSP.CONFIG.AUID,
      hwid : AvastSP.CONFIG.HWID,
      uuid : AvastSP.CONFIG.UUID,
      callerId : AvastSP.CONFIG.CALLERID,
      source : AvastSP.gpb.All.ApplicationEvent.Source.BROWSER_PLUGIN,
      server : AvastSP.Query.CONST.GAMIFICATION_SERVER,
      method : "post",
      callback : _.noop,
      format : "object",  // return response in JSON
      go : true           // true = trigger the request immediately
    }, options);

    this.request = new AvastSP.gpb.All.ApplicationEvent;
    this.response = new AvastSP.gpb.All.GamificationResponse;

    this.init();
  };

  AvastSP.Query.ApplicationEvent.prototype = _.extend({},AvastSP.Query.__MASTER__,{

    // build PROTO message
    message : function() {

      this.request.identity = new AvastSP.gpb.All.ApplicationIdentity;
      this.request.identity.type = AvastSP.gpb.All.ApplicationIdentity.ApplicationIdentityType.HW_IDENTITY;
      this.request.identity.guid = this.options.guid;
      this.request.identity.auid = this.options.auid;
      this.request.identity.hwid = this.options.hwid;
      this.request.identity.uuid = this.options.uuid;
      
      this.request.event = new AvastSP.gpb.All.GeneratedEvent;
      this.request.event.eventType = this.options.eventType;
      this.request.event.eventTime = PROTO.I64.fromNumber(this.options.eventTime);

      var browserPar = new AvastSP.gpb.All.GeneratedEvent.GeneratedEventParam;
      browserPar.paramName = 'browserType';
      browserPar.value = (Math.floor(AvastSP.CONFIG.CALLERID / 1000)).toString();
      this.request.event.params = [browserPar];

      this.request.source = this.options.source;

      this.request.productInformation = new AvastSP.gpb.All.ProductInformation;
      this.request.productInformation.code = 'AV_AOS';
      this.request.productInformation.version = PROTO.encodeUTF8(this.options.callerId.toString());  

      return this;
    },
    /**
     * Create an instance(s) of AvastSP.UrlInfo object
     * @return {Object}
     */
    format : function(){
      var json = this.toJSON();
      return json;
    }
  });

  var USERID_UPDATE = 'http://ui.ff.avast.com/v3/userid/';

  /*******************************************************************************
   *
   *  SafeShopOffer
   *
   ******************************************************************************/

  AvastSP.Query.SafeShopOffer = function(options) {
      if(!options.url && !options.query) return false; // no page data

      this.options = _.extend({
        server : AvastSP.Query.CONST.OFFERS_SERVER,
        method : "post",
        timeout : 10000, // 10s
        tag : null,
        campaign : null,
        uuid : null,
        url : null,
        query: null,
        status: 1,
        country: null,
        callback : _.noop,
        format : "object", // return response in JSON
        go : true          // true = trigger the request immediately
      }, options);

      this.request = new AvastSP.gpb.All.SafeShopOffer.Request;
      this.response = new AvastSP.gpb.All.SafeShopOffer.Response;

      this.init();
  };

  AvastSP.Query.SafeShopOffer.prototype = _.extend({},AvastSP.Query.__MASTER__,{
    /**
     * build PROTO message
     */
    message : function() {
      //-- TODO - will be served by proxy server
      this.request.tag = 'avast';
      this.request.uuid = '06E7EDF6-75D8-4BA8-AA8F-64A2E237EE19';
      //------
      this.request.url = this.options.url;
      this.request.query = JSON.stringify(this.options.query);
      this.request.status = AvastSP.gpb.All.SafeShopOffer.Request.UserStatus[this.options.status];
      this.request.country = this.options.country;
      this.request.identity = this.identity();
      this.request.lang = ABEK.locale.getBrowserLang();
      this.request.referer = this.options.referrer;

      // Pass true/false if the query has activated VoucherSearch plugin
      this.request.voucherSearch = this.options.VoucherSearch;
      return this;
    },
    /**
     * Create an instance(s) of AvastSP.SafeShopOffer object
     * @return {Object}
     */
    format : function(){
      var resp = this.response.values_;
      var res = {
        id : resp.id,
        status : resp.status,
        query : resp.query,
        offers : []
      };
      if (resp.items && resp.items.length > 0) {
        for(var m=0, n=resp.items.length; m<n; m++){
          var roffers = resp.items[m].values_.offers;
          if (roffers) {
            for (var i=0; i < roffers.length; i++) {
              res.offers.push(roffers[i].values_);
            }
          }
        }
      }

      return res;
    },
    /**
     * url info message type
     * @return {Strinng} call
     */
    getCallerid : function(){
      return AvastSP.CONFIG.CALLERID;
    }
  });

  /*******************************************************************************
   *
   *  SafeShopPickedOffer
   *
   ******************************************************************************/

  AvastSP.Query.SafeShopPickedOffer = function(options) {
      if(!options.originalRequest || !options.offer) return false; // no page data

      this.options = _.extend({
        server : AvastSP.Query.CONST.PICKED_OFFER_SERVER,
        method : "post",
        originalRequest : options.originalRequest,
        offer : options.offer,
        callback : _.noop,
        format : "object", // return response in JSON
        go : true          // true = trigger the request immediately
      },options);

      this.request  = new AvastSP.gpb.All.SafeShopOffer.PickedOffer.Request;
      this.response = new AvastSP.gpb.All.SafeShopOffer.PickedOffer.Response;

      this.init();
  };

  AvastSP.Query.SafeShopPickedOffer.prototype = _.extend({},AvastSP.Query.__MASTER__,{
    /**
     * build PROTO message
     */
    message : function() {
      var offer_fields = [
        "affiliate", "affiliate_image", "availability", "availability_code", "category",
        "currency", "fprice", "fprice_sup", "image_url", "label", "label_quality", "description",
        "origin", "price", "priority", "product_id", "saving", "shipping", "slug", /*"sortorder",*/
        "templateref", "url", "coupon_exception", "coupon_existing_customers", "coupon_expire_date",
        "coupon_expires", "coupon_expires_df", "coupon_freeshipping", "coupon_minimum_order_value",
        "coupon_new_customers", "domain_label", "value", "created", "external_id", /*"time",*/ "views"
      ];

      this.request.originalRequest = new AvastSP.gpb.All.SafeShopOffer.Request;
      //-- TODO - will be served by proxy server
      this.request.originalRequest.tag = 'avast';
      this.request.originalRequest.uuid = '06E7EDF6-75D8-4BA8-AA8F-64A2E237EE19';
      //------
      this.request.originalRequest.url = this.options.originalRequest.url;
      this.request.originalRequest.query = JSON.stringify(this.options.originalRequest.query);
      this.request.originalRequest.status = AvastSP.gpb.All.SafeShopOffer.Request.UserStatus[this.options.originalRequest.status];

      this.request.originalRequest.identity = this.identity();

      this.request.offer = new AvastSP.gpb.All.SafeShopOffer.Response.Offer;
      for(var i=0; i < offer_fields.length; i++) {
        var field = offer_fields[i];
        if (this.options.offer[field]) {
          this.request.offer[field] = this.options.offer[field];
        }
      }

      if (this.options.offer.sortorder) {
        this.request.offer.sortorder = PROTO.I64.fromNumber(this.options.offer.sortorder);
      }

      if (this.options.offer.time) {
        this.request.offer.time = PROTO.I64.fromNumber(this.options.offer.time);
      }

      return this;
    },
    /**
     * Create an instance(s) of AvastSP.SafeShopOffer object
     * @return {Object}
     */
    format : function(){
      var resp = this.response.values_;
      var res = { };
      return res;
    },
    /**
     * url info message type
     * @return {Strinng} call
     */
    getCallerid : function(){
      return AvastSP.CONFIG.CALLERID;
    }
  });

  AvastSP.Query.getServerUserId = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', USERID_UPDATE, true);
    xhr.onreadystatechange = function() {
      var status, data;
      if (xhr.readyState === 4) {
        status = xhr.status;
        if (status === 200) {
          data = JSON.parse(xhr.responseText);
          onSuccess && onSuccess(data['userid']);
        } else {
          onError && onError(status);
        }
      }
    };
    xhr.send();
  };

}).call(this, _, AvastSP, AvastSP.PROTO);