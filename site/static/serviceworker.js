(global => {
  var swOptions = {};
  swOptions.cacheVersion = 'v2';

  /* global toolbox */
  global.importScripts('js/serviceworker/sw-toolbox.js');

  // toolbox.options.debug = true;

  if (swOptions && swOptions.cacheVersion) {
    toolbox.options.cache.name = swOptions.cacheVersion;
  }

  global.addEventListener(
    'install',
    event => event.waitUntil(global.skipWaiting())
  );

  global.addEventListener(
    'activate',
    event => event.waitUntil(global.clients.claim())
  );

  toolbox.router.get(/^\/$/, toolbox.fastest);
  toolbox.router.get(/^\/resume\/$/, toolbox.fastest);

  // Static assets
  toolbox.router.get(
    /^\/(css|js|images).*/,
    toolbox.networkFirst,
    {
      networkTimeoutSeconds: 2
    }
);
})(self);
