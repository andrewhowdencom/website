(global => {
  var cacheName = '{{ APP_VERSION }}';

  var preCache = [
    '/network-error/'
  ];

  var networkFailurePage = '/network-error/';
  var networkFailureResponseOpts = {
    status: 503,
    statusText: "NetworkFailure"
  };

  // Determine if the location object has a port
  var hostPort = '';
  if (location.port) {
    hostPort += ':' + location.port;
  }

  // Build the entire host String
  var host = location.protocol + '//' + location.hostname + hostPort;

  /**
   * Determine whether a request is for a document, such as .html, or in this site, /
   *
   * @param {String} url The url to test
   * @return {Boolean} Whether a URL is a document.
   */
  var isUrlDocument = function(url) {
    return /\/$|\/[A-z]{1,}$/m.test(url);
  };

  var cacheFirst = function(request) {
    // If the item is not from our URL, don't worry about it.
    if (request.url.indexOf(host) === -1) {
      return fetch(request);
    }

    return caches.open(cacheName).then(function(cache) {
      return cache.match(request)
        .then(function(response) {
          var fetchPromise = fetch(request).then(function(networkResponse) {
            // Do not cache bad responses.
            if (networkResponse.ok !== false) {
              cache.put(request, networkResponse.clone());
            }

            return networkResponse;
          });

          return response || fetchPromise;
        });
    });
  };

  var networkFailure = function(request) {
    if (!isUrlDocument(request.url)) {
      // This is not a document. Return a blank reponse indicating network failure.
      return new Response(new Blob(), networkFailureResponseOpts);
    }

    return caches.open(cacheName).then(function(cache) {
      return cache.match(networkFailurePage).then(function(response) {
        // This is a document. We should return a valid response.
        return response.blob().then(function(failureBlob) {
          return new Response(failureBlob, networkFailureResponseOpts);
        });
      });
    });
  };

  global.addEventListener('install', event => event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(preCache);
    })
  ));

  global.addEventListener('activate', event => event.waitUntil(
    caches.keys().then(function(oldCaches) {
      return Promise.all(
        oldCaches.filter(function(oldCacheName) {
          return oldCacheName !== cacheName;
        }).map(function(oldCacheName) {
          return caches.delete(oldCacheName);
        })
      );
    })
  ));

  // Network request all the things.
  global.addEventListener('fetch', function(e) {
    e.respondWith(
      cacheFirst(e.request).catch(function() {
        return networkFailure(e.request);
      })
    );
  });
})(self);
