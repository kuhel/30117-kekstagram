/**
 * @fileoverview
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
