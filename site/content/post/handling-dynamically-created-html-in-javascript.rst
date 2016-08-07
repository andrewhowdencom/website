===============================================
Handling dynamically created HTML in JavaScript
===============================================

Time spent writing this: 230 minutes so far.

TL,DR
-----

- Where you can, use events that bubble and attach elements to the document object. You can then filter them on a
  selector.
- If you have a JavaScript plugin that needs to keep state, store that state on that element's dataset. Then, in
  the click handler, you can check whether the plugin is initialized by checking that elements dataset, and
  initialise it if it isn't.

Getting into it
---------------

It's becoming much harder to reason about the state of the document when our JavaScript is being run. For example:

- Content might be populated after the JavaScript has been run by AJAX, such as category facets
- Content might be constructed by other JavaScript that our JavaScript doesn't know about, such as third party scripts
- Our scripts might be loaded and executed asynchronously.

Making HTML content interactive with JavaScript is a hugely common requirement; triggering modals, tracking users
or showing a quick view are all pretty common tasks. More often then not, developers do something like the following:

.. code:: html

  <div class="item-list__item">Alert</div>
  <div class="item-list__item">Alert</div>

  <script type="text/javascript">
    // Todo: Sanity check this javascript actually works
    document.querySelectorAll('.item-list__item').forEach(function(el) {
      el.addEventListener(
        'click',
        function() {
            alert('Hello, World!);
        }
    });
  </script>

In that example, the developer adds an *event handler* to the element that listens for the users `Click` action.
However, the only way this is possible is if the JavaScript can guarantee that these elements will exist
when it's executed - something that we can't. A simple example is below; we have a set of boxes
that change when the user clicks a button:

.. raw:: html

  <p data-height="265" data-theme-id="light" data-slug-hash="vKVLPm" data-default-tab="result" data-user="andrewhowdencom" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/andrewhowdencom/pen/vKVLPm/">vKVLPm</a> by Andrew Howden (<a href="http://codepen.io/andrewhowdencom">@andrewhowdencom</a>) on <a href="http://codepen.io">CodePen</a>.</p>
  <script async src="//assets.codepen.io/assets/embed/ei.js"></script>

.. container:: tip info

  There is a lot of boilrplate code in the examples to make the filtering work. Mostly, it's irrelevant to this
  post, but if you're curious feel free to poke around.

Consider a new requirement - Each of these elements much create an alert that says "Hello". On the face of it, it seems
pretty trivial; the style might should work fine:

.. Code:: javascript

  // Let's stick things in a closure, so it's nice and tidy
  (function() {

    // Create the event handler on the document ready event, as we know then that the DOM document that was initially loaded
    // will be rendered about now.
    document.addEventListener('DOMContentLoaded', function() {

      // Get each of the elements
      document.querySelectorAll('.item-list__item').forEach(function(el) {

        // Bind the click handler
        el.addEventListener('click', function() {
          alert('Hello, World');
        })
      });
    });
  })();

.. raw:: html

  <p data-height="265" data-theme-id="light" data-slug-hash="pbxrrQ" data-default-tab="result" data-user="andrewhowdencom" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/andrewhowdencom/pen/pbxrrQ/">pbxrrQ</a> by Andrew Howden (<a href="http://codepen.io/andrewhowdencom">@andrewhowdencom</a>) on <a href="http://codepen.io">CodePen</a>.</p>
  <script async src="//assets.codepen.io/assets/embed/ei.js"></script>

This initially appears to work. Quite often a solution like this will make it to the production site!
However, after using for a short period it's pretty apparent it's broken. On the first click, it works fine,
but once a user has applied the filter the click does not work anymore. Examining the source of the facet JS
makes it apparent why:

.. code:: JavaScript

  Facet.prototype.query = function() {
    var noElements = Number(this.options.elements);

    var template = this.renderTemplate(this.options.templateVariables);
    var output = '';

    for (var i = 0; i < noElements; i++) {
      output += template;
    }

    this.container.innerHTML = output; // <-- This bit is the important bit
  }

The elements that the *event listeners* were bound to are gone! Deleted and replaced with the new facets in the
query function above. So, whats to be done? There are two alternatives:

1. Rebind the event handlers in the query function
2. Take advantage of *event bubbling* to capture the event on a parent event

Each has its own advantages, but in this case option 2 is better. To explain why *event bubbling* needs some
explanation:

  Event bubbling and capturing are two ways of event propagation in the HTML DOM API, when an event occurs in an
  element inside another element, and both elements have registered a handle for that event. With bubbling, the
  event is first captured and handled by the innermost element and then propagated to outer elements.

    - `Arun P Johny`_

*Event bubbling* allows the handling of the event on a parent DOM element, not the one that dispatched the
event. The most stable element is the document, and is thus the easiest to use. So, modifying the example
from earlier:

.. Code:: javascript

  // Let's stick things in a closure, so it's nice and tidy
  (function() {
    var selector = '.item-list__item';

    // We bind the event handler directly to the document.
    document.addEventListener('click', function(e) {
      // All click events will be handled by this function, so it needs to be as cheap as possible. To check
      // whether this function should be invoked, we're going to check whether the element that was clicked on
      // was the elemnt that we care about. The element that was clicked on is made available at "e.target"
      var el = e.target;

      // Check if it matches our previously defined selector
      if (!el.matches(selector)) {
        return;
      }

      // The method logic
      alert('Hello, World!');
    })
  })();

It works! The line `document.addEventListener('DOMContentLoaded')` is also gone; previously, it was required
as the JavaScript would not have worked if it was executed before the elements were part of the document.
However, now it doesn't matter - the JavaScript can be executed before or after those elements exist, and will
start working after it executes. Success!

This can be applied to even more complex examples. Quite often some sort of complex initialisation is required
with a JavaScript class; doing that on every click is needlessly expensive. An excellent solution is used by
`the Bootstrap library`_ - the JavaScript is initialised in the click handler and the result stored on the
element in `Element.dataset`. The click handler also checks to see whether the plugin has previously been
initialised, and skips initialisation where it is pointless.

An example of this is below:

.. Code:: JavaScript

  // Let's stick things in a closure, so it's nice and tidy
  (function() {
    var selector = '.item-list__item';

    // We bind the event handler directly to the document.
    document.addEventListener('click', function(e) {
      // All click events will be handled by this function, so it needs to be as cheap as possible. To check
      // whether this function should be invoked, we're going to check whether the element that was clicked on
      // was the elemnt that we care about. The element that was clicked on is made available at "e.target"
      var el = e.target;

      // Check if it matches our previously defined selector
      if (!el.matches(selector)) {
        return;
      }

      // This is a contrived example that just sleeps for one second, however more commonly you'll see this with
      // AJAX calls or just expensive JavaScript.
      setTimeout(function() {
        alert('Hello!');
      }, 3000); // 3 second timeout

    })
  })();

.. raw:: html

  <p data-height="265" data-theme-id="light" data-slug-hash="RRqbAg" data-default-tab="result" data-user="andrewhowdencom" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/andrewhowdencom/pen/RRqbAg/">RRqbAg</a> by Andrew Howden (<a href="http://codepen.io/andrewhowdencom">@andrewhowdencom</a>) on <a href="http://codepen.io">CodePen</a>.</p>
  <script async src="//assets.codepen.io/assets/embed/ei.js"></script>

The above example has a three second delay attached to the alert to simulate a particularly nasty server response
time, or some truly horrific JS initialisation. Making users wait through that is awful - it needs to be better.
Luckily, it's not too hard - storing the results on `Element.dataset` means that initialisation needs only be
performed once per element:

.. Code:: JavaScript

  // Let's stick things in a closure, so it's nice and tidy
  (function() {
    var selector = '.item-list__item';

    // We bind the event handler directly to the document.
    document.addEventListener('click', function(e) {
      // All click events will be handled by this function, so it needs to be as cheap as possible. To check
      // whether this function should be invoked, we're going to check whether the element that was clicked on
      // was the elemnt that we care about. The element that was clicked on is made available at "e.target"
      var el = e.target;

      // Check if it matches our previously defined selector
      if (!el.matches(selector)) {
        return;
      }

      // Here, we're checking whether the script has been run previously. You can store anything here -
      // I like storing initialized, stateful plugins.
      var result = el.dataset.result;
      if (!result) {
        setTimeout(function() {
          el.dataset.result = "Hello, World!";
          alert(el.dataset.result);
        }, 3000);
        return;
      }

      alert(el.dataset.result);
    })
  })();

.. raw:: html

  <p data-height="265" data-theme-id="light" data-slug-hash="grQYAX" data-default-tab="result" data-user="andrewhowdencom" data-embed-version="2" class="codepen">See the Pen <a href="http://codepen.io/andrewhowdencom/pen/grQYAX/">grQYAX</a> by Andrew Howden (<a href="http://codepen.io/andrewhowdencom">@andrewhowdencom</a>) on <a href="http://codepen.io">CodePen</a>.</p>
  <script async src="//assets.codepen.io/assets/embed/ei.js"></script>

That's quite a bit better. The first click still takes the 3 seconds, however the next click of that same element
is immediate.

.. _`the Bootstrap library`: https://github.com/twbs/bootstrap/blob/master/js/collapse.js#L167-L180

Performance Implications
------------------------

Attaching the click event handler to the document means that click handler will be run with every click in the document
. Therefore, we need that function to be as cheap as possible; this is accomplished by exiting early if it is not an
element that we care about.

Further, the event handlers of every intermediary element will also be fired:

.. code:: html

  <html> <!-- Your event handler is here -->
    <div class="foo"> <!-- Click events get handled here -->
      <div class="bar"> <!-- Click events get handled here -->
        <button id="#baz">Alert</button> <!-- Click events get handled here -->
      </div>
    </div>
  </html>

If there's an expensive event handler between the event handler and the event dispatcher, that event handler will get run
before and block the execution of the event handler. To solve this, always terminate as early as possible.

When it's better not to do this
--------------------------------

If there is no chance the element associated with an event will be inserted with AJAX, bind the event on the element
itself. It avoids all of the performance issues above.

When this doesn't work
----------------------

Not all events bubble. For example, while `Click` does bubble and can be handled by the parent elements, `Blur` does not.
For a full list of elements, `consult the MDN`:

.. _`consult the MDN`: https://developer.mozilla.org/en-US/docs/Web/Events

Getting tripped up by the wrong element being clicked
-----------------------------------------------------

I ran into an issue writing this post in that the element the user was clicking on was not the element I was checking
against. Consider the following example:

.. Code:: html

  <div class="button-container" id="event-handler">
    <button>Hello, World</button>
  </div>

  <script type="text/javascript">
    document.addEventListener('click', function(e) {

      // This won't work
      if (!e.target.matches('#event-handler')) {
        return;
      }

      alert('Hello, World');
    });
  </script>

The user is clicking on the button, not the div container. So, the code above won't work until it's modified like so:

.. Code:: html

  <div class="button-container">
    <button id="event-handler">Hello, World</button>
  </div>

  <script type="text/javascript">
    document.addEventListener('click', function(e) {

      // This won't work
      if (!e.target.matches('#event-handler')) {
        return;
      }

      alert('Hello, World');
    });
  </script>

That's it! There are no comments on this blog post just yet. That will be done at some point, however, if there is
anything hilariously wrong, please feel free to contact me (check the footer).

.. container:: tip info

  This is all written without the use of any libraries. The most common library I use to solve a bunch of these
  problems is jQuery; however, so as to keep this as "forward looking" as possible everything is implemented in
  ES5 or polyfilled ES6 (So, it should still work on IE)

  I'm quite looking forward to the day IE (not Edge) dies. It'll allow the use of much more ES6 stuff, and much simpler
  CSS APIs

.. _`Arun P Johny`: http://stackoverflow.com/questions/4616694/what-is-event-bubbling-and-capturing
