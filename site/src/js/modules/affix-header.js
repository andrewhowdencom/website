require(['modules/debounce', 'modules/offset'], function(debounce, offset) {
  // var affixClass = 'page__masthead--affixed';

  var masthead = document.getElementById('js-masthead');
  if (masthead === null) {
    return;
  }

  var affixHeader = debounce(function() {
    console.log(offset(masthead));
  }, 100);

  window.addEventListener('scroll', affixHeader);
});
