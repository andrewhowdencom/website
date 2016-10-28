/* globals define */

/**
 * Initializes the service worker
 *
 * It's assumed capability detection is taken care of outside this method
 *
 * @todo Capability detection for cache, serviceworker, localstorage
 */
define(function() {
  return function(version) {
    var sw = navigator.serviceWorker;

    // Probabaly need a better way to handle this, but we'll use namespace to control the DB stuff
    // app.version = version

    var isVersionCurrent = function(version) {
      if (version !== localStorage.getItem('app.version')) {
        return false;
      }

      return true;
    };

    var setVersion = function(version) {
      // Todo: Rename cache name app version
      localStorage.setItem('app.version', version);
    };

    var install = function() {
      navigator.serviceWorker.register(
        '/serviceworker.js?version=' + version, {
          scope: '/'
        }
      ).then(function(registration) {
        var serviceWorker;
        var message;
        var isInstalling = 'New application is being installed';
        var isWaiting = 'New application is ready. Try closing and reopening the window';
        var isActive = 'Application version ' + version + ' installed, and available offline';

        if (registration.installing) {
          message = isInstalling;
          serviceWorker = registration.installing;
        } else if (registration.waiting) {
          message = isWaiting;
          serviceWorker = registration.waiting;
        } else if (registration.active) {
          message = isActive;
          serviceWorker = registration.active;
          setVersion(version);
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
              setVersion(version);
              break;
            default:
              return;
          }
        });
      }).catch(function(e) {
        showToast('Application installation failed. Try a more modern browser (Chrome, Firefox): ' + e);
      });
    };

    /**
     * Shows a toast message
     *
     * @param {String} message The message to show to the user
     */
    function showToast(message) {
      var event = new CustomEvent('alerts.lc.add', {
        detail: {
          message: message
        }
      });

      document.dispatchEvent(event);
    }

    // Install the service worker if it doesn't eixst.
    sw.getRegistration().then(function(registration) {
      if (typeof registration === "undefined") {
        install();
      } else if (!isVersionCurrent(version)) {
        install();
      }
    });
  };
});
