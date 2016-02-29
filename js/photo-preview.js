/**
 * @fileoverview Наследуем в объект PhotoPreview методы и свойства объекта PhotoBase
 * @author Gleb Vorontsov
 */

'use strict';

define([
  'inherit',
  'photo-base'],
  function(inherit, PhotoBase) {
    function PhotoPreview() {}
    inherit(PhotoPreview, PhotoBase);
  });
