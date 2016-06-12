/**
 * This file initializes plugins, fetching them from upstream if they're required.
 */

/**
 * Initialize the service worker. Put in a closure so variables defined dont
 * spill out onto the global scope.
 */
(function() {
  'use strict';
  var version = '56';

  if ('serviceWorker' in navigator) {
    require(['modules/serviceworker'], function(sw) {
      sw(version);
    });
  } else {
    var event = new CustomEvent('alerts.lc.add', {
      detail: {
        message: 'Cannot install the application: Your browser does not support serviceWorker'
      }
    });
    document.dispatchEvent(event);
  }
})();

/**
 * Initialize the alerts
 */
(function() {
  'use strict';
  require(['vendor/domReady'], function(domReady) {
    // At the minute, it relies on a template defined in the DOM. I don't think this is a good idea; We'll need to
    // supply it in the JavaScript, or ideally, with a HTMLImport (maybe?)
    domReady(function() {
      var template = document.querySelector('[data-alerts] > [data-template]');
      var elementContainer = document.querySelector('[data-alerts]');

      // Don't worry about it if there's no template.
      if (template === null) {
        return;
      }

      // Initialize
      require(['modules/alert'], function(Alert) {
        elementContainer.dataset.alert = new Alert({
          template: template,
          container: elementContainer,
          transitionClass: 'alert__item--transition'
        });
      });
    });
  });
})();
