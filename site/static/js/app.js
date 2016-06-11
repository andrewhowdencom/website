/**
 * This file initializes plugins, fetching them from upstream if they're required.
 */

/**
 * Initialize the service worker. Put in a closure so variables defined dont
 * spill out onto the global scope.
 */
(function() {
  'use strict';

  /**
   * Shows a toast message
   */
  function showToast(message) {
    var event = new CustomEvent('alerts.lc.add', {
      detail: {
        message: message
      }
    });

    document.dispatchEvent(event);
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
      '/serviceworker.js?version=54', {
        scope: '/'
      }
    ).then(function(registration) {
      var serviceWorker;
      var message;
      var isInstalling = 'New application is being installed';
      var isWaiting = 'New application is ready. Try closing and reopening the window';
      var isActive = 'Application version 54 installed, and available offline';

      if (registration.installing) {
        message = isInstalling;
        serviceWorker = registration.installing;
      } else if (registration.waiting) {
        message = isWaiting;
        serviceWorker = registration.waiting;
      } else if (registration.active) {
        message = isActive;
        serviceWorker = registration.active;
      }

      // Determine which state the service worker is in immediately after installation.
      showToast(message);

      serviceWorker.addEventListener('statechange', function(e) {
        switch (e.target.state) {
          case 'installed':
            showToast(isInstalling);
            break;
          case 'activating':
            showToast(isWaiting);
            break;
          case 'activated':
            showToast(isActive);
            break;
          default:
            return;
        }
      });
    }).catch(function(e) {
      showToast('Application installation failed. Try a more modern browser (Chrome, Firefox): ' + e);
    });
  }
})();

/**
 * Initialize the alerts
 */
(function() {
  'use strict';
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
