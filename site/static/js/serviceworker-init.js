/**
 * Initialize the service worker. Put in a closure so variables defined dont
 * spill out onto the global scope.
 */
(function() {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(
      '/serviceworker.js',
      {
        scope: '/'
      }
    ).catch(function(e) {
      console.log('Service worker registration failed: ' + e);
    });
  }
})();
