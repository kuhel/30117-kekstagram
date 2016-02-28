/**
 * @fileoverview
 * @author Gleb Vorontsov
 */

'use strict';

define(function() {

  function PhotoBase() {}

  /**
   * Данные о картинках
   * @type {Object}
   */
  PhotoBase.prototype._data = null;

  /**
   * Клик по фотографии
   */
  PhotoBase.prototype.onPhotoClick = function() {};

  /**
   * Клик по объекту
   */
  PhotoBase.prototype.onClick = null;

  /**
   * Запись данных
   * @param {Object} data
   */
  PhotoBase.prototype.setData = function(data) {
    this._data = data;
  };

  /**
   * Выдача данных
   * @return {Object} _data
   */
  PhotoBase.prototype.getData = function() {
    return this._data;
  };

  return PhotoBase;
});
