/**
 * @fileoverview
 * @author Gleb Vorontsov
 */

'use strict';

(function() {


  /**
   * @constructor
   */
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = document.querySelector('.gallery-overlay-close');
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  };

  /**
   * Показать галерею
   */

  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');

    // Слушаем клик по крестику
    this._closeButton.addEventListener('click', this._onCloseClick);

    // Слушаем Esc
    document.addEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Скрыть галерею
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');

    // Убираем прослушку клика
    this._closeButton.removeEventListener('click', this._onCloseClick);

    // Убираем прослушку Esc
    document.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Обработка клика по кресткику
   * @Private
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  /**
   * Обработка нажатия клавиши Esc
   * @private
   *
   */
  Gallery.prototype._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === 27) {
      this.hide();
    }

  };

  window.Gallery = Gallery;
})();
