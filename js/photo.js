/* global inherit: true, PhotoBase: true */

'use strict';

(function() {

  /** Типизированный объект Фото
   * @param {Object} data
   * @constractor
   */

  function Photo(data) {
    this._data = data;
    this.ELEMENT_IMAGE_WIDTH = 182;
    this.ELEMENT_IMAGE_HEIGHT = 182;
    this.IMAGE_LOAD_TIMEOUT = 10000;

    this.onPhotoClick = this.onPhotoClick.bind(this);
  }

  inherit(Photo, PhotoBase);

  Photo.prototype.render = function() {

    var templateSelector = 'picture-template';
    var template = document.getElementById(templateSelector);
    var elementImage = new Image(this.ELEMENT_IMAGE_WIDTH, this.ELEMENT_IMAGE_HEIGHT);
    if ('content' in template) {
      this.element = template.content.childNodes[1].cloneNode(true);
    } else {
      this.element = template.childNodes[1].cloneNode(true);
    }
    var templateImage = this.element.querySelector('img');
    var loadErrorTimeout;

    //var loadErrorTimeout = setTimeout(function() {
    //  this.element.classList.add('picture-load-failure').bind(this);
    //}, this.IMAGE_LOAD_TIMEOUT);

    elementImage.addEventListener('load', function() {
      clearTimeout(loadErrorTimeout);
      this.element.replaceChild(elementImage, templateImage);

    }.bind(this));
    elementImage.addEventListener('error', function() {
      this.element.classList.add('picture-load-failure');
      console.log(this._data.url + ' not loaded');
    }.bind(this));

    this.element.addEventListener('click', this.onPhotoClick);

    elementImage.src = this._data.url;


    loadErrorTimeout = setTimeout(function() {
      elementImage.src = '';
      this.element.classList.add('picture-load-failure');
    }.bind(this), this.IMAGE_LOAD_TIMEOUT);

    this.element.querySelector('.picture-comments').textContent = this._data.comments;
    this.element.querySelector('.picture-likes').textContent = this._data.likes;

  };

  Photo.prototype.onPhotoClick = function(evt) {
    evt.preventDefault();
    if (this.element.classList.contains('picture') && !this.element.classList.contains('picture-load-failure')) {
      if (typeof this.onClick === 'function') {
        this.onClick();
      }
    }
  };

  window.Photo = Photo;

})();
