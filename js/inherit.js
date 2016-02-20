/**
 * @fileoverview
 * @author Gleb Vorontsov
 */

'use strict';


/**
 * Пишем в прототип наследник методы и свойтсва родительского конструктора
 * через пустой конструктор
 * @param {Function} child
 * @param {Function} parent
 */
window.inherit = function(child, parent) {
  var EmptyConstructor = function() {};

  EmptyConstructor.prototype = parent.prototype;
  child.prototype = new EmptyConstructor();
};
