---
title: "This Site"
description: "A summary of the experiments in progress on my personal site"
date: "26 Jul 16 20:50 +1100"
---

=========
This Site
=========

This site is where I undertake a lot of my web experiments.
`You can see it on GitHub`_,
however if you're curious, I'm going to try and keep track of what I'm doing
here.

It's not an exhaustive list. Just some things you can look for when checking out
the place.

ServiceWorker
-------------

This site should be available offline. If you try to reach another page, and the
network is out, you'll be presented with the page at the URL /network-error/

This is only supported by:

- Firefox
- Chrome

It should work just fine. Alternatively, open the inspector and you'll see the
DOM document coming out of the cache (and all other assets, but they *should*
be cached anyway)

Offline-first Web App
---------------------

Using a combination of ServiceWorker and the manifest.json file, this site should
be available offline, and look almost like a native app when saved to the home
screen.

Kubernetes
----------

Pretty much everything I do is deployed via Kubernetes these days. It takes
so much complexity out of infrastructure; if you work with the primitives, you're
pretty good to deploy anything.

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

chrome://net-internals

Continuous deployments
----------------------

This site is continuously deployed. There are no tests -- I'm just too lazy
to run the deployments manually. I've never had a problem. Deployments are
handled by Travis

Bower
-----

Bower is a nice framework for handling frontend dependencies.

.. _`You can see it on GitHub`: https://github.com/andrewhowdencom/www.andrewhowden.com
