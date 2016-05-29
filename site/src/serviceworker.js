(global => {
  /* global toolbox */
  global.importScripts('js/serviceworker/sw-toolbox.js');

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
})(self);
