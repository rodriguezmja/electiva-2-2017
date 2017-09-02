/*******************************************************************************
 *
 *  avast! Online Security plugin
 *  (c) 2013 Avast Corp.
 *
 *  @author: Lucian Corlaciu
 *
 *  Background specifics - Mozilla Firefox
 *
 ******************************************************************************/

Cu.import('resource://gre/modules/Services.jsm');

var self = require("sdk/self");
var tabs = require("sdk/tabs");
var l10n = require("sdk/l10n");
var { attach } = require('sdk/content/mod');
var { Style } = require('sdk/stylesheet/style');

(function(_) {

  // List of storage identifiers to persist through FF preferences
  var PREF_STORED = ['settings', 'whiteList'];

  if (typeof AvastSP === 'undefined') { AvastSP = {}; }
  if (typeof AvastSP.ff === 'undefined') { AvastSP.ff = {}; }

  AvastSP.ff.Utils = require('./utils');

  // TODO - is this local storage hack the only option for persistent storage?
  var url = "http://aosbrowserpluginlocalstoragescope.com";
  var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
  var ssm = Cc["@mozilla.org/scriptsecuritymanager;1"].getService(Ci.nsIScriptSecurityManager);
  var dsm = Cc["@mozilla.org/dom/storagemanager;1"].getService(Ci.nsIDOMStorageManager);

  var uri = ios.newURI(url, "", null);
  var principal = ssm.getCodebasePrincipal(uri);

  var ffLocalStorage = dsm.getLocalStorageForPrincipal(principal, "");

  // Get FF preferences to persist some settings over clear history
  var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
  prefs = prefs.getBranch("extensions.AvastSP.".toLowerCase());

  var tabWorkers = new WeakMap();

  /*
   * FF specific local storage wrapper to keep certain data persisted
   *  in FF preferences.
   */
  var localStorage = {
    getItem : function (id) {
      var data = ffLocalStorage.getItem(id);
      return (data) ? data : (prefs.prefHasUserValue(id) ? prefs.getCharPref(id) : undefined);
    },
    setItem : function (id, data) {
      ffLocalStorage.setItem(id, data);
      for (var i=0; i < PREF_STORED.length; i++) {
        if (id === PREF_STORED[i]) {
          prefs.setCharPref(id, data);
          return;
        }
      }
    },
    hasOwnProperty : function (id) {
      return ffLocalStorage.hasOwnProperty(id) || prefs.prefHasUserValue(id);
    }
  };

  var bal; //AvastSP.bal instance - browser agnostic

  if (typeof AvastSP.bs === 'undefined') { AvastSP.bs = {}; }
  _.extend (AvastSP.bs, {
    init: function(balInst) {
      bal = balInst;

      if (bal.DNT) {
        require('./ReqBlocker').init(bal);
      }

      tabs.on('ready', function(tab) {
        if (bal.aos) {
          bal.aos.SC.checkIsRetryRequested(tab.id, tab);
        }
        AvastSP.bal.emitEvent('page.complete', tab.id, tab, tab.url);
      });
    },
    afterInit: function () {
      setTimeout(function(){
        AvastSP.bal.checkPreviousVersion(AvastSP.CONFIG.CALLERID);
      }, 1000);
    },
    /* Register SafePrice Event handlers */
    registerModuleListeners: function(ee) {
      ee.on('badgeInfoUpdated',
        AvastSP.Utils.throttle(
          function(tab, host, getData) {
            var data = getData(tab.id, host); // {text: ..., color: ...}
            if(data) {
              AvastSP.ff.Utils.button.setBadgeTextColor(tab, data.text, data.color);
            }
          },
        100)
      );
    },
    getRawLocalizedString: function(name) {
      var localized = l10n.get(name);
      // return empty string if l10n key doesn't exist
      return localized === name ? '' : localized;
    },
    actionClicked: function() {
      var tab = tabs.activeTab;
      if (tab) {
        var host = bal.getHostFromUrl(tab.url);
        if (host !== undefined) {
          AvastSP.bs.openSidebar(tab);
        }
      }
    },
    attachScripts: function(tab, scripts) {
      var tabId = tab.id;
      var worker = tab.attach({
        contentScriptFile: scripts
      });

      worker.port.on("message", function(message) {
        AvastSP.bs.tabMessageHub(message, tab);
      });

      worker.on("error", function(err) {
        console.error('worker error:', tabId, err);
      });

      worker.on("detach", function() {
        tabWorkers.delete(tab);
      });

      tabWorkers.set(tab, worker);

      attach(Style({ uri: './extension.css' }), tab);
    },
    getLocalImageURL: function(file) {
      return 'chrome://sp/content/common/skin/img/'+ file;
    },
    getLocalResourceURL: function(file) {
      return 'chrome://sp/content/' + file;
    },
    getLocalizedString: function(key, args) {
      return AvastSP.Utils.aosFormat(AvastSP.bs.getRawLocalizedString(key), args);
    },
    tabRedirect: function(tab, new_url) {
      tab.url = new_url;
    },
    /**
     * Get Tab identifier. Implemented in browser specific way.
     * @param {Object} tab object to get the id for
     */
    getTabId: function(tab) {
      return tab.id;
    },
    getTabUrl : function(tab){
      return tab.url;
    },
    messageTab: function(tab, data) {
      if (tabWorkers.has(tab))
        tabWorkers.get(tab).port.emit('message', data);
    },
    attachToTab: function(tab, isSettings) {
      if (tabWorkers.has(tab)) {
        return;
      }
      
      var scripts = isSettings ? [
        "./jquery-1.5.2.js",
        "./mustache.js",
        "./templates.js",
        "./options.js",
        "./extension.js"
      ] : [
        "./jquery-1.5.2.js",
        "./mustache.js",
        "./eventemitter2.js",
        "./templates.js",
        "./ial.js",
        "./csl.parser.js",
        "./extension.js"
      ];

      AvastSP.bs.attachScripts(tab, scripts);
    },

    accessContent: function(tab, data) {
      AvastSP.bs.attachToTab(tab);
      AvastSP.bs.messageTab(tab, data);
    },

    openSidebar: function(tab) {
      var host = bal.getHostFromUrl(tab.url);
      var data = {
        message: 'populate',
        data: {
          webrep: bal.WebRep.compute(host),
          dnt: bal.DNT.compute(tab.id, host),
        }
      };
      AvastSP.bs.accessContent(tab, data);
    },

    tabMessageHub: function(request, tab) {
      switch (request.message) {
        case 'unload':
          break;
        case 'triggerSettingsPage':
          tabs.open(request.page);
          break;
        default:
          bal.commonMessageHub(request.message, request, tab);
        }
    },

    openSettingsPage: function(tab) {
      AvastSP.bs.attachToTab(tab, true);
      //TODO handle unload and/or push it at browser level
    },

    /**
     * Open page in a new tab (to force open in tab instead of window - Firefox specific).
     * @param {String} target url
     */
    openInNewTab: function(url, callback) {
      var setTab = tabs.open(url);
      if (typeof callback === "function") callback(setTab);
    },

    getLocalStorage: function() {
      return localStorage;
    },

    /**
     * Copy text provided into clipboard.
     * @param {String} text to copy to clipboard
     */
    copyToClipboard: function (text) {
      require("sdk/clipboard").set(text);
    }
  }); // AvastSP.bs

  AvastSP.bal.registerModule(AvastSP.bs);

}).call(this, _); // - aos.js Closure
