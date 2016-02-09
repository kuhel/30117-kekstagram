
/**
 * @fileoverview
 * @author Gleb Vorontsov
 */

'use strict';


(function() {
  var pictures = [];
  var picturesContainer = document.querySelector('.pictures');
  var filtersContainer = document.querySelector('.filters');
  var activeFilter = 'filter-popular';
  var filters = document.querySelectorAll('.filters-radio');

  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function(event) {
      var clickedFilterID = event.target.id;
      setActiveFilter(clickedFilterID);
    };
  }

  filtersContainer.classList.remove('hidden');



  /**
   * Отрисовка списка картинок
   * @param {Array.<Object>} picturesToDraw
   */
  function renderPictures(picturesToDraw) {
    picturesContainer.innerHTML = '';
    var fragment = document.createDocumentFragment();

    picturesToDraw.forEach(function(picture) {
      var element = getElementFromTemplate(picture);
      fragment.appendChild(element);
    });

    picturesContainer.appendChild(fragment);
  }

  /**
   * Установка выбранного фильтра
   * @param {string} id
   */
  function setActiveFilter(id) {
    var filteredPictures = pictures.slice(0);
    if (activeFilter === id) {
      return;
    }

    document.querySelector('#' + activeFilter).setAttribute('checked', 'false');
    document.querySelector('#' + id).setAttribute('checked', 'true');

    if (id === 'filter-new') {
      filteredPictures = filteredPictures.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
    } else if (id === 'filter-discussed') {
      filteredPictures = filteredPictures.sort(function(a, b) {
        return b.comments - a.comments;
      });
    } else if (id === 'filter-popular') {
      filteredPictures = filteredPictures.sort(function(a, b) {
        return b.likes - a.likes;
      });
    }

    renderPictures(filteredPictures);

  }


  /**
   * Получаем список картинок с сервера
   */
  function getPictures() {
    var XHRequest = new XMLHttpRequest();

    XHRequest.open('GET', 'http://o0.github.io/assets/json/pictures.json');
    XHRequest.timeout = 10000;
    document.querySelector('.pictures').classList.add('pictures-loading');
    XHRequest.onload = function(event) {
      var rawData = event.target.response;
      pictures = JSON.parse(rawData);
      document.querySelector('.pictures').classList.remove('pictures-loading');
      renderPictures(pictures);
    };

    XHRequest.send();
  }

  getPictures();



  /**
   * Создаем новый DOM элемент на основе шаблона
   * @param {Object} data
   * @return {Element}
   */
  function getElementFromTemplate(data) {
    var templateSelector = 'picture-template';
    var template = document.getElementById(templateSelector);
    var element;
    var ELEMENT_IMAGE_WIDTH = 182;
    var ELEMENT_IMAGE_HEIGHT = 182;
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
    }, 10000);

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
