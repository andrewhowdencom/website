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

  if (
    typeof module === 'object' &&
    module.exports &&
    typeof require === 'function'
  ) {
    // Common JS
    module.exports = definition();
    // AMD, Require.js
  } else if (
    typeof define === 'function' &&
    typeof define.amd === 'object'
  ) {
    define(definition);
  } else {
    root.alerts = definition();
  }
}(this, function() {
  'use strict';

  /**
   * Blurb indicating what this plugin is supposed to be used for.
   *
   * @param {Object} options The options that dictate the behaviour of this plugin
   * @constructor
   */
  var Alert = function(options) {
    this.options = this.mergeObject(Plugin.DEFAULTS, options);
  };

  Alert.DEFAULTS = {
    optionA: 'foo',
    optionB: 'bar'
  };

  /**
   * Does a shallow merge of two objects
   *
   * @param {Object} obj1 The object to combine with
   * @param {Object} obj2 The object to overwrite obj1
   * @return {Object} The amended object
   */
  Alert.prototype.mergeObject = function(obj1, obj2) {
    var returnObj = {};
    var attrName;

    // Repeat merge
    for (attrName in obj1) {
      if ({}.hasOwnProperty.call(attrName, obj1)) {
        returnObj[attrName] = obj1[attrName];
      }
    }

    for (attrName in obj2) {
      if ({}.hasOwnProperty.call(attrName, obj2)) {
        returnObj[attrName] = obj2[attrName];
      }
    }

    return returnObj;
  };

  /**
   * @param {String} arg
   * @return {Void}
   */
  Alert.prototype.show = function(message) {
    
  }

  return Alert;
}));
