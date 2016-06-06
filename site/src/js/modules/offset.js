/**
 * Calculates somethings offset
 *
 * @see http://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
 */
define(function() {
  var doc = document.documentElement;

  /**
   * @param {HTMLElement} el The HTML element to calculate the offset
   * @return {Object} An object showing the position of the element
   */
  return function(el) {
    var bound = el.getBoundingClientRect();

    return {
      left: bound.left + (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
      top: bound.top + (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
    };
  };
});
