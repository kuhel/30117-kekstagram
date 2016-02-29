/**
 * @fileoverview
 * @author Gleb Vorontsov
 */

'use strict';


define([
  'photo',
  'gallery'],
  function(Photo, Gallery) {
    /**
     * Массив загруженных картинок
     * @type {Array.<Object>}
     */
    var pictures = [];

    /**
     * Массив остортированных по филтру картинок
     * @type {Array.<Object>}
     */
    var filteredPictures = [];

    /**
     * Массив отрисованных картинок
     * @type {Array.<Object>}
     */
    var renderedPictures = [];

    /**
     * Контейнер всех картинок
     * @type {HTMLElement}
     */
    var picturesContainer = document.querySelector('.pictures');

    /**
     * Контейнер инпутов фильтров
     * @type {HTMLElement}
     */
    var filtersContainer = document.querySelector('.filters');

    /**
     * Фильтр по умолчанию
     * @type {string}
     * @const
     */
    var DEFAULT_FILTER = 'filter-popular';

    /**
     * Размер стороны картинки-превьюшки
     * @type {number}
     * @const
     */
    var IMAGE_SIDE = 182;

    /**
     * Таймаут загрузки картинки с сервера
     * @type {number}
     * @const
     */
    var IMAGE_LOAD_TIMEOUT = 10000;

    /**
     * Количество картинок выводящихся в одном блоке(странице)
     * @type {number}
     * @const
     */
    var PAGE_SIZE = 12;

    /**
     * Таймаут троттла скролла
     * @type {number}
     * @const
     */
    var SCROLL_TIMEOUT = 100;


    /**
     * Активный фильтр берется из localStorage, если там есть запись
     * @type {string}
     */
    var activeFilter = localStorage.getItem('picturesFilter') || DEFAULT_FILTER;

    /**
     * Текущий блок(страница) с картинками
     * @type {number}
     */
    var currentPage = 0;

    /**
     * Функция устанавливающая таймаут на скролл
     * @type {function}
     */
    var scrollTimeout;

    /**
     * Объект галереи
     * @type {Gallery}
     */
    var gallery = new Gallery();


    /**
     * Показываем контейнер с филтрами
     */
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

      /**
       * Обнулим контейнер если требуется
       */
      if (replace) {
        currentPage = 0;
        var el;
        while ((el = renderedPictures.shift())) {
          picturesContainer.removeChild(el.element);
          el.onClick = null;
        }
      }

      /**
       * Контейнер который наполнят картинками и добавят в DOM
       * @type {HTMLElement}
       */
      var fragment = document.createDocumentFragment();

      /**
       * С какой картинки отрисовываем блок с картинками
       * @type {number}
       */
      var renderFrom = pageNumber * PAGE_SIZE;

      /**
       * По какой элемент отрисовываем блок с картинками
       * @type {number}
       */
      var renderTo = renderFrom + PAGE_SIZE;

      /**
       * Массив картинок для отрисовки блока
       * @type {Array.<Object>}
       */
      var pagePictures = picturesToRender.slice(renderFrom, renderTo);

      renderedPictures = renderedPictures.concat(pagePictures.map(function(picture) {

        /**
         * Объект Photo
         * @type {Photo}
         */
        var elementPicture = new Photo(picture);
        elementPicture.setData(picture);
        elementPicture.render();
        fragment.appendChild(elementPicture.element);
        elementPicture.onClick = function() {
          gallery.setData(elementPicture.getData());
          gallery.setHash(picture.url);
        };
        return elementPicture;
      }));

      picturesContainer.appendChild(fragment);
    }



    /**
     * Записываем информацию о фильтре в localStorage
     * @param {String} id
     */
    function setLocalStorageFilter(id) {
      localStorage.setItem('picturesFilter', id);
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
          setLocalStorageFilter(clickedElement.id);
        }
      });
    }




    /**
     * Слушаем загрузку и отрисовываем картинки
     */
    window.addEventListener('load', addPicturesPage);

    /**
     * Слушаем изменение размеров окна и отрисовываем картинки
     */
    window.addEventListener('resize', addPicturesPage);

    /**
     * Слушаем скролл и отрисовываем картинки
     */
    window.addEventListener('scroll', function() {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function() {
        while (loadedNextPage()) {
          addPicturesPage();
        }
      }, SCROLL_TIMEOUT);
    });

    /**
     * Добавляем секцию с картинками в контейнер картинок
     *
     */
    function addPicturesPage() {
      var picturesContainerCoordinates = document.querySelector('.pictures').getBoundingClientRect();
      var viewportSize = window.innerHeight;

      if (picturesContainerCoordinates.bottom - viewportSize <= picturesContainerCoordinates.height) {
        if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
          renderPictures(filteredPictures, ++currentPage, false);
        }
      }
    }

    /**
     * Загружаем картинки
     */
    getPictures();

    /**
     * Устанавливаем сортировку
     */
    setFilter();


    /**
     * Установка выбранного фильтра
     * @param {string} id
     * @param {boolean} force
     */
    function setActiveFilter(id, force) {


      if ( activeFilter === id && !force) {
        return;
      }

      activeFilter = id;
      currentPage = 0;

      /**
       * Выставляем актвиный фильтр
       */
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
        setActiveFilter(activeFilter, true);
      });

      XHRequest.send();
    }

    /**
     * Слушаем изменение хэша и рисуем галерею
     */
    window.addEventListener('hashchange', galleryByHash);

    /**
     * Слушаем загрузку и рисуем галерею
     */
    window.addEventListener('load', galleryByHash);

    /**
     * Обработка изменения хэша
     */
    function galleryByHash() {
      /**
       * Матч хэша по урлу
       * @type {Object}
       */
      var hashMatch;

      /**
       * Хэш страницы
       * @type {string}
       */
      var locationHash = location.hash;
      if (locationHash === '') {
        gallery.hide();
      } else {
        hashMatch = locationHash.match(/#photo\/(\S+)/);
        gallery.render(hashMatch[1]);
      }
    }

  });
