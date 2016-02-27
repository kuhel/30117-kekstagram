/**
 * @fileoverview
 * @author Gleb Vorontsov
 */

'use strict';

define(function() {


  /**
   * @constructor
   */
  var Gallery = function() {
    this.element = document.querySelector('.gallery-overlay');
    this.elementImage = document.querySelector('.gallery-overlay-image');
    this.elementLikes = document.querySelector('.gallery-overlay-controls-like');
    this.elementComments = document.querySelector('.gallery-overlay-controls-comments');
    this._closeButton = document.querySelector('.gallery-overlay-close');
    this.currentPicture = 0;
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
  };

  /**
   * Отрисовка галереи
   */
  Gallery.prototype.render = function() {
    this.show();
    this.setCurrentPicture(this.currentPicture);
  };

  /**
   * Показать галерею
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');

    // Слушаем клик по крестику
    this._closeButton.addEventListener('click', this._onCloseClick);

    // Клик по фото
    this.elementImage.addEventListener('click', this._onPhotoClick);

    // Слушаем Esc
    document.addEventListener('keydown', this._onDocumentKeyDown);

    this.setCurrentPicture(this.currentPicture);
  };

  /**
   * Скрыть галерею
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');

    // Убираем прослушку клика
    this._closeButton.removeEventListener('click', this._onCloseClick);

    // Убираем клик по фото
    this.elementImage.removeEventListener('click', this._onPhotoClick);

    // Убираем прослушку Esc
    document.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Установка объекта с картинками
   * @param {Object} pictures
   */
  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };

  /**
   * Отрисовка картинки
   * @param {Number} pictureIndex
   */
  Gallery.prototype.setCurrentPicture = function(pictureIndex) {

    this.elementImage.src = this.pictures[pictureIndex].url;
    this.elementLikes.querySelector('.likes-count').innerText = this.pictures[pictureIndex].likes;
    this.elementComments.querySelector('.comments-count').innerText = this.pictures[pictureIndex].comments;
  };

  /**
   * Записываем данные и устанавливаем индекс картинки
   */
  Gallery.prototype.setData = function(data) {
    this._data = data;
    this.currentPicture = this.getNumberPicture(data.url);
  };

  /**
   * Получаем индекс картинки
   */
  Gallery.prototype.getNumberPicture = function(url) {
    for (var i = 0; i < this.pictures.length; i++) {
      if (url === this.pictures[i].url) {
        this.currentPicture = i;
        return i;
      }
    }
  };


  /**
   * Устанавливаем следующую картинку, если она существует
   */
  Gallery.prototype.setNextPicture = function() {
    if (this.pictures[this.currentPicture + 1]) {
      this.currentPicture++;
    }
  };

  /**
   * Устанавливаем предыдущую картинку, если она существует
   */
  Gallery.prototype.setPreviousPicture = function() {
    if (this.pictures[this.currentPicture - 1]) {
      this.currentPicture--;
    }
  };



  /**
   * Обработка клика по кресткику
   * @Private
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  /**
   * Обработка клика по картинке в галереи
   * @Private
   */
  Gallery.prototype._onPhotoClick = function() {
    this.setNextPicture();
    this.setCurrentPicture(this.currentPicture);
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
    if (evt.keyCode === 37) {
      this.setPreviousPicture();
    }
    if (evt.keyCode === 39) {
      this.setNextPicture();
    }
    this.setCurrentPicture(this.currentPicture);
  };


  //TODO likePicture

  return Gallery;
});
