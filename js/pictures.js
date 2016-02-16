/* global Photo: true */

/**
 * @fileoverview
 * @author Gleb Vorontsov
 */

'use strict';


(function() {
  var pictures = [];
  var filteredPictures = [];
  var picturesContainer = document.querySelector('.pictures');
  var filtersContainer = document.querySelector('.filters');


  var DEFAULT_FILTER = 'filter-popular';
  var IMAGE_SIDE = 182;
  var IMAGE_LOAD_TIMEOUT = 10000;
  var PAGE_SIZE = 12;

  var activeFilter = '';
  var currentPage = 0;
  var scrollTimeout;

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
      Array.prototype.forEach.call( picturesContainer, function(node) {
        picturesContainer.removeChild(node);
      });
      //picturesContainer.innerHTML = '';
    }

    var fragment = document.createDocumentFragment();

    // Отсортируем массив по количеству нужных картинко
    var renderFrom = pageNumber * PAGE_SIZE;
    var renderTo = renderFrom + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(renderFrom, renderTo);

    pagePictures.forEach(function(picture) {
      var photoItem = new Photo(picture);
      photoItem.render();
      fragment.appendChild(photoItem.element);
    });

    picturesContainer.appendChild(fragment);
  }

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
        renderPictures(filteredPictures, ++currentPage);
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

  }


  /**
   * Получаем список картинок с сервера
   */
  function getPictures() {
    var XHRequest = new XMLHttpRequest();

    XHRequest.open('GET', 'http://o0.github.io/assets/json/pictures.json');
    XHRequest.timeout = IMAGE_LOAD_TIMEOUT;
    document.querySelector('.pictures').classList.add('pictures-loading');
    XHRequest.onload = function(event) {
      var rawData = event.target.response;
      pictures = JSON.parse(rawData);
      document.querySelector('.pictures').classList.remove('pictures-loading');
      setActiveFilter(DEFAULT_FILTER, true);
    };

    XHRequest.send();
  }



})();
