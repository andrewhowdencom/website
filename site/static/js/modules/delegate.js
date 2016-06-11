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
  return function(element, filter, function) {
    element.addEventListener(function(e) {
      
    })
  }
}));
