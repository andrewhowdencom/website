# This Site
This site is where I undertake a lot of my web experiments.
[You can see it on GitHub](https://github.com/andrewhowdencom/www.andrewhowden.com),
however if you're curious, I'm going to try and keep track of what I'm doing
here.

It's not an extensive list. Just some things you can look for when checking out
the place.

## ServiceWorker
This site should be available offline. Pre-caching is disabled, so you'll have
to play around a bit to get a full demonstraton. To try it, undertake the
following:

#. Visit a few pages
#. Disable your network connection
#. Revisit the same pages

It should work just fine. Alternatively, open the inspector and you'll see the
DOM document coming out of the cache (and all other assets, but they *should*
be cached anyway)

## Offline-first Web App
The combination of ServiceWorker and the manifest.json file; this site should
be able to be saved to the phone, and work offline.

## Kubernetes
Pretty much everything I do is deployed via Kubernetes these days. It takes
so much complexity out of infrastructure; if you work with the primitives, you're
pretty good to deploy anything.

## Picfit
A golang image server. The favicons required for the manifest.json are
generated; they never exist client side.

## (Todo) Polyfilled client-hints
Will probably use Picfit

## (Todo) Application shell architecture
Make the site work even better offline. Not quite sure how I'll implement this
just yet; I'm using the hugo static site generator, and it means I'll have to
request chunks of HTML (which I generally abhore).

## CSS Variables + PostCSS
Trying to move away from meta tools around web technologies such as jQuery,
SCSS and other nicities and work directly with the browser APIs. They're pretty
damned good these days!

## HTTP/2
The site both runs and is optimised for H/2. If you don't have a H/2 connection
you're going to have a bad time; but you probably do have one.

If you're curious, visit chrome://net-internals

## Continious deployments
This site is continiously deployed. There are no tests -- I'm just too lazy
to run the deployments manually. I've never had a problem. Deployments are
handled by Travis

## Bower
Bower is a nice framework for handling frontend dependencies.
