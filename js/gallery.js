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
    /**
     * Контейнер галереи
     * @type {HTMLElement}
     */
    this.element = document.querySelector('.gallery-overlay');

    /**
     * Контейнер картинки в галереи
     * @type {HTMLElement}
     */
    this.elementImage = document.querySelector('.gallery-overlay-image');
    /**
     * Контейнер лайков галереи
     * @type {HTMLElement}
     */
    this.elementLikes = document.querySelector('.gallery-overlay-controls-like');

    /**
     * Контейнер счетчика лайков
     * @type {HTMLElement}
     */
    this.elementLikesCount = document.querySelector('.likes-count');

    /**
     * Контейнер комментариев
     * @type {HTMLElement}
     */
    this.elementComments = document.querySelector('.gallery-overlay-controls-comments');

    /**
     * Кнопка закрытия (крестик)
     * @type {HTMLElement}
     */
    this._closeButton = document.querySelector('.gallery-overlay-close');

    /**
     * Номер картинки
     * @type {number}
     */
    this.currentPicture = 0;

    /**
     * Кейкоды необходимые для обработки нажатий кнопок
     * @type {KeyCodes}
     */
    this.KeyCodes = {
      ESC: 27,
      LEFT_ARROW: 37,
      RIGHT_ARROW: 39
    };

    /**
     * Привязываем функции обрабатывающие события к нужному контексту
     */
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onLikeClick = this._onLikeClick.bind(this);
  };

  /**
   * Отрисовка галереи
   * @param {string} pictureURL
   */
  Gallery.prototype.render = function(pictureURL) {
    this.show();
    this.setCurrentPicture(pictureURL);
  };

  /**
   * Показать галерею
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');


    /**
     * Слушаем клик по крестику
     */
    this._closeButton.addEventListener('click', this._onCloseClick);

    /**
     * Клик по фото
     */
    this.elementImage.addEventListener('click', this._onPhotoClick);

    /**
     * Клик по Лайку
     */
    this.elementLikes.addEventListener('click', this._onLikeClick);

    /**
     * Слушаем Esc
     */
    document.addEventListener('keydown', this._onDocumentKeyDown);

    this.setCurrentPicture(this.currentPicture);
  };

  /**
   * Скрыть галерею
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');



    /**
     * Убираем прослушку клика
     */
    this._closeButton.removeEventListener('click', this._onCloseClick);

    /**
     * Убираем клик по фото
     */
    this.elementImage.removeEventListener('click', this._onPhotoClick);

    /**
     * Слушаем Esc
     */
    this.elementLikes.removeEventListener('click', this._onLikeClick);

    /**
     * Убираем клик по лайку
     */
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
   * @param {number|string} pictureIndex
   */
  Gallery.prototype.setCurrentPicture = function(pictureIndex) {
    var currentPicture;
    if (typeof pictureIndex === 'number') {
      currentPicture = this.pictures[pictureIndex];
    } else if (typeof pictureIndex === 'string') {
      currentPicture = this.pictures[this.getPictureNumber(pictureIndex)];
    }


    this.elementImage.src = currentPicture.url;
    this.elementLikes.querySelector('.likes-count').innerHTML = currentPicture.likes;
    this.elementComments.querySelector('.comments-count').innerHTML = currentPicture.comments;

    if (currentPicture.alreadyLiked === true) {
      this.elementLikesCount.classList.add('likes-count-liked');
    } else {
      this.elementLikesCount.classList.remove('likes-count-liked');
    }
  };

  /**
   * Записываем данные и устанавливаем индекс картинки
   */
  Gallery.prototype.setData = function(data) {
    this._data = data;
    this.currentPicture = this.getPictureNumber(data.url);
  };

  /**
   * Получаем индекс картинки
   * @return {number} i
   */
  Gallery.prototype.getPictureNumber = function(url) {
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
      this.setHash(this.pictures[++this.currentPicture].url);
    }
  };

  /**
   * Устанавливаем предыдущую картинку, если она существует
   */
  Gallery.prototype.setPreviousPicture = function() {
    if (this.pictures[this.currentPicture - 1]) {
      this.setHash(this.pictures[--this.currentPicture].url);
    }
  };



  /**
   * Обработка клика по кресткику
   * @Private
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
    this.setHash('');
  };

  /**
   * Обработка клика по картинке в галерее
   * @Private
   */
  Gallery.prototype._onPhotoClick = function() {
    this.setNextPicture();
    this.setCurrentPicture(this.currentPicture);
  };

  /**
   * Обработка клика по лайку в галерее
   * @Private
   */
  Gallery.prototype._onLikeClick = function() {

    var pictureToLike = this.pictures[this.currentPicture];
    if (!pictureToLike.alreadyLiked === true) {
      this.elementLikesCount.classList.add('likes-count-liked');
      pictureToLike.likes++;
      this.elementLikesCount.innerHTML = pictureToLike.likes;
      pictureToLike.alreadyLiked = true;
    } else {
      this.elementLikesCount.classList.remove('likes-count-liked');
      pictureToLike.likes--;
      this.elementLikesCount.innerHTML = pictureToLike.likes;
      pictureToLike.alreadyLiked = false;
    }
  };

  /**
   * Обработка нажатия клавиши Esc
   * @Private
   * @param {Event} evt
   */
  Gallery.prototype._onDocumentKeyDown = function(evt) {
    if (evt.keyCode === this.KeyCodes.ESC) {
      this.hide();
      this.setHash('');
    }
    if (evt.keyCode === this.KeyCodes.LEFT_ARROW) {
      this.setPreviousPicture();
    }
    if (evt.keyCode === this.KeyCodes.RIGHT_ARROW) {
      this.setNextPicture();
    }
    this.setCurrentPicture(this.currentPicture);
  };

  /**
   * Установка либо очистка хэша
   * @param {string} hash
   */
  Gallery.prototype.setHash = function(hash) {
    location.hash = hash ? 'photo/' + hash : '';
  };




  return Gallery;
});
