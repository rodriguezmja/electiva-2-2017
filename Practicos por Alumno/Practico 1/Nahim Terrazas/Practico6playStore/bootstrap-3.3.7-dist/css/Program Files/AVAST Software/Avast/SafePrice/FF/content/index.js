var { Cc, Ci, Cu } = require('chrome');
var tabs = require("sdk/tabs");
var windows = require("sdk/windows");
var tabs_utils = require('sdk/tabs/utils');
var { getOuterId } = require('sdk/window/utils');
var { viewFor } = require("sdk/view/core");
var { modelFor } = require("sdk/model/core");

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

var loader = Cc["@mozilla.org/moz/jssubscript-loader;1"].getService(Ci.mozIJSSubScriptLoader);

Q = require('./common/libs/q-ff');
_ = require('./common/libs/lodash-ff');
EventEmitter2 = require('../data/eventemitter2.js').EventEmitter2;

ABEK = require('./abek.bl.ff');

loader.loadSubScript("chrome://sp/content/common/libs/protobuf.js");
loader.loadSubScript("chrome://sp/content/common/scripts/gpb.js");
loader.loadSubScript("chrome://sp/content/common/scripts/query.js");
loader.loadSubScript("chrome://sp/content/common/scripts/avastwrc.js");
loader.loadSubScript("chrome://sp/content/common/scripts/bal.js");
loader.loadSubScript("chrome://sp/content/aos.js");

var webrepMain = {
  initialize: function () {
    var self = this;

    self.locationChangeProgressListener.init(self);

    function attachProgressListener(browserWindow) {
      var w = viewFor(browserWindow);
      var tabbrowser = tabs_utils.getTabBrowser(w);
      tabbrowser.addProgressListener(self.locationChangeProgressListener);
    }

    var browserWindows = windows.browserWindows;
    browserWindows.on("open", attachProgressListener);
    _.each(browserWindows, attachProgressListener);

    //window.addEventListener('TabClose', function (event) { self.eventTabClose(event); }, true);
  },

  unload: function() {
    var self = this;

    _.each(windows.browserWindows, function(browserWindow) {
      var w = viewFor(browserWindow);
      var tabbrowser = tabs_utils.getTabBrowser(w);
      tabbrowser.removeProgressListener(self.locationChangeProgressListener);
    });
  },

  locationChangeProgressListener: {
    //see https://developer.mozilla.org/en-US/docs/Code_snippets/Progress_Listeners
    QueryInterface: XPCOMUtils.generateQI(['nsIWebProgressListener', 'nsISupportsWeakReference']),

    _wrcMain: null,

    init: function(wrcMain) {
      this._wrcMain = wrcMain;
      return this;
    },

    onLocationChange: function(aProgress, aRequest, aLocation, aFlags) {
      var document = aProgress.DOMWindow.document;
      var url = aLocation.spec;

      var winView = viewFor(aProgress.DOMWindow);
      var tab = modelFor(tabs_utils.getTabForContentWindow(winView));

      if (document instanceof Ci.nsIDOMHTMLDocument && document.defaultView.frameElement === null) {
        var domain = AvastSP.Utils.getDomain(url);
        if (domain !== null) {
          this._wrcMain.document = document;
          this._wrcMain.run(tab, aRequest !== null);
        }
      }
    },

    onStateChange: function() {},
    onProgressChange: function() {},
    onStatusChange: function() {},
    onSecurityChange: function() {}
  },

  // eventTabClose: function (event) {
  //   AvastSP.onTabRemoved(AvastSP.ff.Utils.getTabId(window));
  // },

  run: function (tab, tabChanged) {
    var self = this;
    var tabHref = tab.url;

    if (tabHref) {
      var domain = AvastSP.Utils.getDomain(tabHref);
      if (domain !== null) {
        // parse the tabid (-12-34) into [ 12, 34]
        var winTabIds = tab.id.split('-').slice(1).map(i => parseInt(i, 10));
        var urlDetails = {
          url: tabHref,
          referer: this.document.referrer,
          tabNum: winTabIds[1],
          windowNum: winTabIds[0],
          tabUpdated: tabChanged
        };

        AvastSP.getUrlInfo(urlDetails, function(result) {
          if (result && result[0]) {
            var theResult = result[0];
            AvastSP.bal.emitEvent('urlInfo.response', tabHref, theResult, tab, tabChanged);
          }
        }, false);
      }
    }
  }
};

exports.main = function() {
  var EDITION_CONFIG = require('./edition')(AvastSP);

  AvastSP.init(EDITION_CONFIG.callerId);
  AvastSP.bal.init('FF', AvastSP.bs, AvastSP.bs.getLocalStorage(), EDITION_CONFIG);

  // Obtain userId
  var settings = AvastSP.bal.settings.get();
  var userid = settings.current.userId;
  if (!userid || userid.length <= 0 ) {
    AvastSP.Query.getServerUserId(function(userid) {
      AvastSP.bal.storeUserId(userid);
    });
  }

  webrepMain.initialize();
};

exports.onUnload = function() {
  webrepMain.unload();
};
