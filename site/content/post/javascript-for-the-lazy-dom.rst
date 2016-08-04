===========================
JavaScript for the lazy DOM
===========================

Time spent writing this: 90 minutes so far.

So, let's take a journey down one step checkout lane. You've built a lovely category page shows a series of awesome things,
filters according to facets the user clicks:

.. raw:: html

  <p data-height="265" data-theme-id="light" data-slug-hash="vKVLPm" data-default-tab="result" data-user="andrewhowdencom" data-embed-version="2" class="codepen">See the Pen <a href="https://codepen.io/andrewhowdencom/pen/vKVLPm/">vKVLPm</a> by Andrew Howden (<a href="http://codepen.io/andrewhowdencom">@andrewhowdencom</a>) on <a href="http://codepen.io">CodePen</a>.</p>
  <script async src="//assets.codepen.io/assets/embed/ei.js"></script>

You've had an awesome idea; you're going to add a quick view to each of your awesome things! Now, the user won't even have
to navigate to the next page. You add the quick view links in:

.. Code:: html

  ...
  <div class="item-list__item">
    <a class="item-list__item__title"
       href="/my-awesome-thing-1">My Awesome Thing 1</a>
    <img class="item-list__item__img" src="/img/my-awesome-thing-1.jpg" alt="My Awesome Thing 1">
    <a href="#" data-quick-view="my-awesome-thing-1">Quick View</a>
  </div>

Let's add the JavaScript to make this work

.. Code:: javascript

  // Todo: This class needs to be stateful, otherwise there's no point.
  // Todo: Filter the elements based on the selector. It also gets ugly then.
  // Todo: Maybe use jQuery? Trying to get away without it though.
  
  // Let's put things in a closure so we don't go polluting the global namespace.
  (function() {
    var elements = document.querySelectorAll('[data-quick-view]');
    
    var showQuickView = function() {
    }
    
    /**
     * @param {HTMLElement} element
     */
    var bindClick = function(element) {
      element.addEventListener(function(e) {
        // Todo: Need to get the data value, and showQuickView with that value.
      }
    }
    
    // Todo: Stick this in document ready, just because it's a nice thing that everyone does.
    elements.forEach(bindClick);
  )();

Excellent! Now, we can use the quick view. But - What happens if we use the facets? The content is going to be replaced, 
and we'll need to rebind the elements! What can we do? I think it comes down to

- Rebinding the elements
- Using a delegated event handler that doesn't get replaced (such as `document`) *<-- this one is better*

HTMLElement events "bubble". Concretely, that means that if a button is clicked, the browser will first check if there's an
event handler on the button. Then, it'll check on it parent element. Then, on that parent element - and on, until we get
to the root element; `document`. We're never going to replace document, so if we're willing to let our events bubble, we
can just handle the click events there! Let's have a simple example:


// Todo: Make these actually functioning examples, using a codepen or something (maybe even self hosted? Blargh, that 
be hard)

.. code:: html

  <div id="#delegate-handler">
    <button>
  </div>

.. code:: javascript

  var element = document.getElementById('delegate-handler');
  element.addEventListener('click', function(e) {
    alert('hello! It looks like you cliked on ' + e.target);
  }
  
Even though we click on the button, the event is picked up and handled by it's parent element - in this case, 
`#delegate-handler`. How neat is that! There are some caveats: 

- Not all events bubble. You can find a list of the ones that do on the MDN docs // Todo: Make that a link
- Event bubbling has some negative performance implications. Generally, you want to handle the event as close to its
  disaptcher as possible! // Todo: Make that a link also
  
Let's go back to our earlier example of faceted content. Since we're creating new elements, we'll need to pick
a common parent of all the elements replaced. For convenience, I tend to pick `document`
  
Todo:
- Note that note all events bubble
- Note that the performance implications aren't good
- Note that we don't handle destruction of elements
- Finish the post 
