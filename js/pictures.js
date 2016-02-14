
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
  var ELEMENT_IMAGE_WIDTH = 182;
  var ELEMENT_IMAGE_HEIGHT = 182;
  var IMAGE_LOAD_TIMEOUT = 10000;
  var PAGE_SIZE = 12;

  var activeFilter = '';
  var currentPage = 0;
  var scrollTimeout;

  filtersContainer.classList.remove('hidden');



  /**
   * Отрисовка списка картинок
   * @param {Array.<Object>} picturesToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   */
  function renderPictures(picturesToRender, pageNumber, replace) {

    // Обнулим контейнер если требуется
    if (replace) {
      picturesContainer.innerHTML = '';
    }

    var fragment = document.createDocumentFragment();

    // Отсортируем массив по количеству нужных картинко
    var renderFrom = pageNumber * PAGE_SIZE;
    var renderTo = renderFrom + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(renderFrom, renderTo);

    pagePictures.forEach(function(picture) {
      var element = getElementFromTemplate(picture);
      fragment.appendChild(element);
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

  window.addEventListener('load', function() {
   addPicturesPage()
  });

  window.addEventListener('resize', addPicturesPage);

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      console.log('scroll');
      addPicturesPage();
    }, 100);
    if (window.innerHeight <= document.body.offsetHeight) {
      addPicturesPage();
    }

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





  /**
   * Создаем новый DOM элемент на основе шаблона
   * @param {Object} data
   * @return {Element}
   */
  function getElementFromTemplate(data) {
    var templateSelector = 'picture-template';
    var template = document.getElementById(templateSelector);
    var element;
    var elementImage = new Image(ELEMENT_IMAGE_WIDTH, ELEMENT_IMAGE_HEIGHT);

    if ('content' in template) {
      element = template.content.childNodes[1].cloneNode(true);
    } else {
      element = template.childNodes[1].cloneNode(true);
    }
    var templateImage = element.querySelector('img');

    elementImage.src = data.url;


    var loadErrorTimeout = setTimeout(function() {
      element.classList.add('picture-load-failure');
    }, IMAGE_LOAD_TIMEOUT);

    elementImage.onload = function() {
      element.replaceChild(elementImage, templateImage);
      clearTimeout(loadErrorTimeout);
    };
    elementImage.onerror = function() {
      element.classList.add('picture-load-failure');
      console.log(data.url + ' not loaded');
    };



    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    return element;
  }



})();
