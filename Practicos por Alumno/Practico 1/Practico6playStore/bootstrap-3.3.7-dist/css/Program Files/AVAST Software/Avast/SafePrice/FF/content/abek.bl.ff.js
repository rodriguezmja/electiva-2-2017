/** Firefox locale impl. */
var self = require('sdk/self');
var l10n = require('sdk/l10n');
var l10n_locale = require("sdk/l10n/locale");

exports.locale = require('./locale')({ // pass browser specific impl.
  /**
   * Get raw localization string for key in Chrome
   */
  getRawLocalizedString: function(key) {
    var localized = l10n.get(key);
    // return empty string if l10n key doesn't exist
    return localized === key ? '' : localized;
  },
  /**
   * Get local resource URL in Chrome
   */
  getLocalResourceURL: function(file) {
    return self.data.url(file);
  },
  /**
   * Retrieve browser language - from navigatro obj.
   */
  getRawBrowserLocale: function() {
    var loc = l10n_locale.getPreferedLocales();
    return loc[0];
  }
});
