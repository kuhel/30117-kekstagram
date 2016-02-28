/**
 * @fileoverview Наследуем в объект PhotoPreview методы и свойства объекта PhotoBase
=======
/* global inherit: true, PhotoBase: true */

/**
 * @fileoverview
>>>>>>> ca607851ff380100aace3eaff2251eec619b4fb8
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
