/**
 * Copyright (c) 2015 littleman.co
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Defines a method to make showing a toast notification easy. Minimal JavaScript, much css.
 */
/* eslint-disable wrap-iife */
/* globals define */
(function(root, definition) {
  'use strict';

  if (typeof module === 'object' && module.exports && typeof require === 'function') {
    // Common JS
    module.exports = definition();
    // AMD, Require.js
  } else if (typeof define === 'function' && typeof define.amd === 'object') {
    define(definition);
  } else {
    root.alerts = definition();
  }
}(this, function() {
  'use strict';

  /**
   * Allow creating toast events
   *
   * @param {Object} options The options that dictate the behaviour of this plugin
   * @constructor
   */
  var Alert = function(options) {
    this.options = this.mergeObject(Alert.DEFAULTS, options);
    var _ = this;

    // Check if there's a container supplied in options.
    if (_.options.container === null) {
      return;
    }

    // We need to bind any existing elements
    var elements = Array.from(_.options.container.children);

    elements.forEach(function(el) {
      _.handle(el);
    });

    _.listen();
  };

  Alert.DEFAULTS = {
    container: null,
    lifetime: 3000, // How long the alerts will stick around for.
    template: '<span class="alert"></span>',
    transitionClass: 'transition',
    transitionTimeout: 1000 // How long we'll keep the alerts after they're transitioned out before we delete htem.
  };

  /**
   * Does a shallow merge of two objects
   *
   * @param {Object} obj1 The object to combine with
   * @param {Object} obj2 The object to overwrite obj1
   * @return {Object} The amended object
   */
  Alert.prototype.mergeObject = function(obj1, obj2) {
    /* eslint-disable guard-for-in */
    var returnObj = {};
    var attrName;

    // Repeat merge
    for (attrName in obj1) {
      returnObj[attrName] = obj1[attrName];
    }

    for (attrName in obj2) {
      returnObj[attrName] = obj2[attrName];
    }

    return returnObj;
  };

  /**
   * Add a new message to the screen.
   *
   * @param {String} message The string message to add to the stack.
   */
  Alert.prototype.add = function(message) {
    var _ = this;
    var element = this.options.template.cloneNode();

    element.innerHTML = message;
    _.options.container.appendChild(element);

    setTimeout(function() {
      element.classList.remove(_.options.transitionClass);
    }, _.options.transitionTimeout);

    _.handle(element);
  };

  /**
   * Bind any exisitng elements that exist
   *
   * @param {HTMLElement} element The element to bind
   */
  Alert.prototype.handle = function(element) {
    var _ = this;

    element.addEventListener('click', function() {
      _.remove(element);
    });

    setTimeout(function() {
      _.remove(element);
    }, _.options.lifetime);
  };

  /**
   * Transitions an alert out, and schedules it for deletion. Uses the schedule so we can apply CSS transitions, rather
   * then just deleting it straight away.
   *
   * @param {HTMLElement} element The HTMLElement to remove.
   */
  Alert.prototype.remove = function(element) {
    // Add the delete class
    element.classList.add(this.options.transitionClass);

    setTimeout(function() {
      // The alert might have been removed by something in the mean time.
      if (element.parentNode === null) {
        return;
      }

      element.parentNode.removeChild(element);
    }, this.options.transitionTimeout);
  };

  /**
   * Allow triggering an alert on an event
   */
  Alert.prototype.listen = function() {
    var _ = this;

    // Remove the queue listener from the document, add our own
    document.removeEventListener('alerts.lc.add');
    document.addEventListener('alerts.lc.add', function(e) {
      _.add(e.detail.message);
    });

    // Check the queue
    if (typeof window._enqueue !== 'undefined') {
      // Redispatch the matching events.
      window._enqueue.forEach(function(event) {
        if (event.type === 'alerts.lc.add') {
          document.dispatchEvent(event);
        }
      });
    }
  };

  return Alert;
}));
