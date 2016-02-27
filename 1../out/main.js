webpackJsonp([1],[
/* 0 */,
/* 1 */,
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @fileoverview
	 * @author Gleb Vorontsov
	 */

	'use strict';


	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	  __webpack_require__(3),
	  __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function(Photo, Gallery) {
	  var pictures = [];
	  var filteredPictures = [];
	  var renderedPictures = [];
	  var picturesContainer = document.querySelector('.pictures');
	  var filtersContainer = document.querySelector('.filters');


	  var DEFAULT_FILTER = 'filter-popular';
	  var IMAGE_SIDE = 182;
	  var IMAGE_LOAD_TIMEOUT = 10000;
	  var PAGE_SIZE = 12;

	  var activeFilter = '';
	  var currentPage = 0;
	  var scrollTimeout;

	  var gallery = new Gallery();

	  filtersContainer.classList.remove('hidden');

	  /**
	   * Нужно ли догружать картинки
	   * @returns {boolean}
	   */
	  function loadedNextPage() {
	    return ((picturesContainer.getBoundingClientRect().bottom - IMAGE_SIDE <= window.innerHeight) && (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)));
	  }



	  /**
	   * Отрисовка списка картинок
	   * @param {Array.<Object>} picturesToRender
	   * @param {number} pageNumber
	   * @param {boolean=} replace
	   */
	  function renderPictures(picturesToRender, pageNumber, replace) {

	    // Обнулим контейнер если требуется
	    if (replace) {
	      currentPage = 0;
	      var el;
	      while ((el = renderedPictures.shift())) {
	        picturesContainer.removeChild(el.element);
	        el.onClick = null;
	      }
	    }

	    var fragment = document.createDocumentFragment();

	    // Отсортируем массив по количеству нужных картинко
	    var renderFrom = pageNumber * PAGE_SIZE;
	    var renderTo = renderFrom + PAGE_SIZE;
	    var pagePictures = picturesToRender.slice(renderFrom, renderTo);

	    renderedPictures = renderedPictures.concat(pagePictures.map(function(picture) {

	      var elementPicture = new Photo(picture);
	      elementPicture.setData(picture);
	      elementPicture.render();
	      fragment.appendChild(elementPicture.element);
	      elementPicture.onClick = function() {
	        gallery.setData(elementPicture.getData());
	        gallery.render();
	      };
	      return elementPicture;
	    }));

	    picturesContainer.appendChild(fragment);
	  }

	  ///**
	  // * Обраюотка клика по фотографии
	  // * @param {Event} evt
	  // */
	  //function _onPhotoClick(evt) {
	  //  evt.preventDefault();
	  //  gallery.show();
	  //}

	  /**
	   * Установка фильтрации
	   *
	   */
	  function setFilter() {

	    filtersContainer.addEventListener('click', function(evt) {
	      var clickedElement = evt.target;
	      if (clickedElement.classList.contains('filters-radio')) {
	        setActiveFilter(clickedElement.id);
	      }
	    });
	  }

	  window.addEventListener('load', addPicturesPage);

	  window.addEventListener('resize', addPicturesPage);

	  window.addEventListener('scroll', function() {
	    clearTimeout(scrollTimeout);
	    scrollTimeout = setTimeout(function() {
	      console.log('scroll');
	      while (loadedNextPage()) {
	        addPicturesPage();
	      }
	    }, 100);


	  });

	  function addPicturesPage() {
	    var picturesContainerCoordinates = document.querySelector('.pictures').getBoundingClientRect();
	    var viewportSize = window.innerHeight;

	    if (picturesContainerCoordinates.bottom - viewportSize <= picturesContainerCoordinates.height) {
	      if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
	        renderPictures(filteredPictures, ++currentPage, false);
	        console.log('Page  #' + currentPage + ' rendered');
	      }
	    }
	  }

	  getPictures();
	  setFilter();


	  /**
	   * Установка выбранного фильтра
	   * @param {string} id
	   * @param {boolean} force
	   */
	  function setActiveFilter(id, force) {


	    if ( activeFilter === id && !force) {
	      return;
	    } else if (activeFilter === '') {
	      activeFilter = DEFAULT_FILTER;
	    }

	    activeFilter = id;
	    currentPage = 0;

	    // Выставляем актвиный фильтр
	    var selectedFilter = document.querySelector('#' + activeFilter);
	    if (selectedFilter) {
	      selectedFilter.setAttribute('checked', 'false');
	    }
	    document.querySelector('#' + id).setAttribute('checked', 'true');

	    filteredPictures = pictures.slice(0);

	    switch (id) {
	      case 'filter-new':
	        // Сортировка по дате по убыванию
	        filteredPictures = filteredPictures.sort(function(a, b) {
	          return new Date(b.date) - new Date(a.date);
	        });
	        break;

	      case 'filter-discussed':
	        // Сортировка по количеству комментариев по убванию
	        filteredPictures = filteredPictures.sort(function(a, b) {
	          return b.comments - a.comments;
	        });
	        break;

	      case 'filter-popular':
	        // Сортировка по популярности
	        filteredPictures = filteredPictures.sort(function(a, b) {
	          return b.likes - a.likes;
	        });
	        break;
	    }

	    renderPictures(filteredPictures, 0, true);
	    gallery.setPictures(filteredPictures);

	  }


	  /**
	   * Получаем список картинок с сервера
	   */
	  function getPictures() {
	    var XHRequest = new XMLHttpRequest();

	    XHRequest.open('GET', 'http://o0.github.io/assets/json/pictures.json');
	    XHRequest.timeout = IMAGE_LOAD_TIMEOUT;
	    document.querySelector('.pictures').classList.add('pictures-loading');

	    XHRequest.addEventListener('load', function(event) {
	      var rawData = event.target.response;
	      pictures = JSON.parse(rawData);
	      document.querySelector('.pictures').classList.remove('pictures-loading');
	      setActiveFilter(DEFAULT_FILTER, true);
	    });

	    XHRequest.send();
	  }



	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @fileoverview
	 * @author Gleb Vorontsov
	 */

	'use strict';

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(4),
	  __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function(inherit, PhotoBase) {

	  /** Типизированный объект Фото
	   * @param {Object} data
	   * @constractor
	   */

	  function Photo(data) {
	    this._data = data;

	    this.onPhotoClick = this.onPhotoClick.bind(this);
	  }

	  inherit(Photo, PhotoBase);

	  Photo.prototype.render = function() {
	    var ELEMENT_IMAGE_WIDTH = 182;
	    var ELEMENT_IMAGE_HEIGHT = 182;
	    var IMAGE_LOAD_TIMEOUT = 10000;

	    var templateSelector = 'picture-template';
	    var template = document.getElementById(templateSelector);
	    var elementImage = new Image(ELEMENT_IMAGE_WIDTH, ELEMENT_IMAGE_HEIGHT);
	    if ('content' in template) {
	      this.element = template.content.childNodes[1].cloneNode(true);
	    } else {
	      this.element = template.childNodes[1].cloneNode(true);
	    }
	    var templateImage = this.element.querySelector('img');
	    var loadErrorTimeout;

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
	    }.bind(this), IMAGE_LOAD_TIMEOUT);

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

	  return Photo;

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @fileoverview
	 * @author Gleb Vorontsov
	 */

	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

	  /**
	   * Наследование одного объекта от другого
	   * @param {Function} child
	   * @param {Function} parent
	   */
	  function inherit(child, parent) {
	    var EmptyConstructor = function() {};
	    EmptyConstructor.prototype = parent.prototype;
	    child.prototype = new EmptyConstructor();
	  }

	  return inherit;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));



/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @fileoverview
	 * @author Gleb Vorontsov
	 */

	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {

	  function PhotoBase() {}

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
	   * @param {Object} data
	   */
	  PhotoBase.prototype.getData = function() {
	    return this._data;
	  };

	  return PhotoBase
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * @fileoverview
	 * @author Gleb Vorontsov
	 */

	'use strict';

	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {


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
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }
]);