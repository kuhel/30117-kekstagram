/**
 * @fileoverview
 * @author Gleb Vorontsov
 */

'use strict';

define(function() {

  /**
   * Наследование одного объекта от другого
   * @param {Function} child
   * @param {Function} parent
   */
  function inherit(child, parent) {
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = parent.prototype;
    child.prototype = new EmptyConstructor();
  }

  return inherit;
});

