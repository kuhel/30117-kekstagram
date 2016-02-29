/**
 * @fileoverview
 * @author Gleb Vorontsov
 */

'use strict';

define(
  ['inherit',
  'photo-base'],
  function(inherit, PhotoBase) {

    /**
     * Ширина картинки
     * @type {number}
     * @const
     */
    var ELEMENT_IMAGE_WIDTH = 182;

    /**
     * Высота картинки
     * @type {number}
     * @const
     */
    var ELEMENT_IMAGE_HEIGHT = 182;

    /**
     * Таймаут загрузки картинки
     * @type {number}
     * @const
     */
    var IMAGE_LOAD_TIMEOUT = 10000;

    /** Типизированный объект Фото
     * @param {Object} data
     * @constructor
     */
    function Photo(data) {
      this._data = data;
      this.onPhotoClick = this.onPhotoClick.bind(this);
    }

    inherit(Photo, PhotoBase);

    /**
     * Рендер одной картинки
     */
    Photo.prototype.render = function() {

      /**
       * Селектора шаблона
       * @type {String}
       */
      var templateSelector = 'picture-template';

      /**
       * Шаблон
       * @type {HTMLElement}
       */
      var template = document.getElementById(templateSelector);

      /**
       * Создаем новую картинку
       * @type {Image}
       */
      var elementImage = new Image(ELEMENT_IMAGE_WIDTH, ELEMENT_IMAGE_HEIGHT);
      if ('content' in template) {
        this.element = template.content.childNodes[1].cloneNode(true);
      } else {
        this.element = template.childNodes[1].cloneNode(true);
      }

      /**
       * HTML элемент IMG
       * @type {HTMLElement}
       */
      var templateImage = this.element.querySelector('img');

      /**
       * Таймаут загрузки изображения
       * @type {Timeout}
       */
      var loadErrorTimeout;

      elementImage.addEventListener('load', function() {
        clearTimeout(loadErrorTimeout);
        this.element.replaceChild(elementImage, templateImage);

      }.bind(this));
      elementImage.addEventListener('error', function() {
        this.element.classList.add('picture-load-failure');
      }.bind(this));

      this.element.addEventListener('click', this.onPhotoClick);

      elementImage.src = this._data.url;

      loadErrorTimeout = setTimeout(function() {
        elementImage.src = '';
        this.element.classList.add('picture-load-failure');
      }.bind(this), IMAGE_LOAD_TIMEOUT);

      this.element.querySelector('.picture-comments').textContent = this._data.comments;
      this.element.querySelector('.picture-likes').textContent = this._data.likes;

    };

    /**
     * Обработчик клика по картинке
     */
    Photo.prototype.onPhotoClick = function(evt) {
      evt.preventDefault();
      if (this.element.classList.contains('picture') && !this.element.classList.contains('picture-load-failure')) {
        if (typeof this.onClick === 'function') {
          this.onClick();
        }
      }
    };

    return Photo;

  });
