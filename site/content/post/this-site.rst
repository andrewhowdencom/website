---
title: "This Site"
description: "A summary of the experiments in progress on my personal site"
date: "26 Jul 16 20:50 +1100"
---

=========
This Site
=========

This site is where I undertake a lot of my web experiments.
`You can see it on GitHub`_, however if you're curious, a brief summary of the
various technologies used is below. It's not an exhaustive list, however,
it's some of the things I think are most interesting at the minute.

TL, DR
-------

Page speeds fetch from Google Analytics on 1/6/16 for "/"

========================== ========
Metric                     Average
-------------------------- --------
Document Interactive       1.14s
Content Loaded             1.13
Page Load                  2.06
========================== ========

I'm quite unhappy with the above. Looks like the service worker has been broken
for a while - haven't set up JS error log pushback just yet. I've since fixed
the service worker, and anticipate those to drop to around 300 - 400ms on
average.

========================================== ========= =================================================================================================================
Testing                                    Score     URL
------------------------------------------ --------- -----------------------------------------------------------------------------------------------------------------
PageSpeed Insights (desktop)               89/100    https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fwww.andrewhowden.com%2F&tab=desktop
PageSpeed Insights (mobile)                73/100    https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fwww.andrewhowden.com%2F&tab=mobile
Qualys SSL Report                          A+        https://www.ssllabs.com/ssltest/analyze.html?d=www.andrewhowden.com
Lighthouse PWA                             84/100    None. See https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk
========================================== ========= =================================================================================================================

ServiceWorker
-------------

This site has a `service worker`_ sitting between the browser and the network,
and is configured to serve most content from the cache if it's available. This
has a number of interesting benefits:

- The site is extremely fast, after the first page load `DOMContentLoaded` in
  74ms, and `Load` in 142ms.
- The site is available offline.

However, this comes at the cost of not having the most up to date content on
the first refresh. This is solved by deploying a new version of the service
worker when content is update. While this doesn't in and of itself show the
new content instantly, it'll display a toast notification to the user indicating
new content is available.

This is also only available in Firefox and Chrome. IE is getting support soon,
and Safari might do it eventually. You can learn more here:

https://jakearchibald.github.io/isserviceworkerready/

Try visiting this site on mobile, and then switching it to aeroplane mode. If
then visit `this random link`_, it'll show a "network error" page as opposed to
a 404.

Web App Manifest
----------------

The web app manifest is a requirement to be prompted for the Chrome on Android
"`add to home screen`_". It shows a nice splash screen while the site is loading,
a nice icon on the homescreen and a title on the homescreen of my choosing.

As an aside, I'm quite excited about the future of `progressive web apps`_, and
feel confident that investing in the related technologies now will pay dividends
in future.

Kubernetes / Docker
-------------------

`Kubernetes`_ is a cluster management system, loosely based on the Borg
container system used to run infrastructure at Google. Kubernetes provides
APIs to manage the lifecycle and deployment of applications, as well as
introspection about your application.

Kubernetes runs `Docker`_ containers as its simplest managed unit. In particular,
This site `runs on NGINX and Picfit`_.

Picfit
------

A golang image server. The favicons required for the manifest.json are
generated; they never exist client side.

CSS Variables + PostCSS
-----------------------

Trying to move away from meta tools around web technologies such as jQuery,
SCSS and other niceties and work directly with the browser APIs. They're pretty
damned good these days!

HTTP/2
------

The site both runs and is optimised for H/2. If you don't have a H/2 connection
you're going to have a bad time; generally, most people will have one, though.

If you're curious whether you're on a H/2 connection and you're using the Chrome
browser, you can visit the following URL:

`chrome://net-internals`_

TLS, Backed by Lets Encrypt
---------------------------

All connections to this site should be either encrypted over TLS, or a redirect
to the encrypted version of content. Further, andrewhowden.com uses
`HSTS`_ including subdomains. This makes the requirements for TLS stricter, and
does not allow the site to be served any longer over an insecure connection for
browsers that support HSTS.

The site is part of the `HSTS preload`_ list for most modern browsers, meaning
browsers with more modern lists will never connect to it over an insecure
connection. This saves a few valuable round trips!

The certificates are generated by Lets Encrypt, and automatically renewed by
other software running on the cluster.

Continuous deployments
----------------------

This site is continuously deployed. There are no tests -- I'm just too lazy
to run the deployments manually. I've never had a problem. Deployments are
handled by Travis.

Bower
-----

Bower is a nice framework for handling frontend dependencies.

Google Cloud
------------

The site runs on `Google Cloud`_ infrastructure. More particularly, the site
runs on a `Google Container Engine`_ (Kubernetes) cluster, and is sitting behind
`Google Cloud CDN`.

Others
------

- NGINX
- Hugo
- ReST

.. _`You can see it on GitHub`: https://github.com/andrewhowdencom/www.andrewhowden.com
.. _`service worker`: https://github.com/jakearchibald/simple-serviceworker-tutorial
.. _`this random link`: /this/is/a/random/link
.. _`add to home screen`: https://developer.chrome.com/multidevice/android/installtohomescreen#supporting
.. _`progressive web apps`: https://developers.google.com/web/progressive-web-apps/
.. _`Kubernetes`: http://kubernetes.io/
.. _`runs on NGINX and Picfit`: https://github.com/andrewhowdencom/www.andrewhowden.com/blob/master/build/kubernetes/nginx.deployment.yml
.. _`Docker`: http://docker.io/
.. _`HSTS`: https://developer.mozilla.org/en-US/docs/Web/Security/HTTP_strict_transport_security
.. _`HSTS Preload`: https://hstspreload.appspot.com/
.. _`Google Cloud`: https://cloud.google.com/
.. _`Google Container Engine`: https://cloud.google.com/container-engine/
.. _`Google Cloud CDN`: https://cloud.google.com/cdn/
.. _`chrome://net-internals`: chrome://net-internals
