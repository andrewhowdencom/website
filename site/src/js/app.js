/**
 * This file initializes plugins, fetching them from upstream if they're required.
 */

 /**
  * Initialize the alerts
  */
(function() {
  require(['vendor/domReady'], function(domReady) {
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

/**
 * Initialize the service worker. Put in a closure so variables defined dont
 * spill out onto the global scope.
 */
(function() {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
      '/serviceworker.js?version={{ APP_VERSION }}',
      {
        scope: '/'
      }
    ).catch(function(e) {
      console.log('Service worker registration failed: ' + e);
    });
  }
})();
