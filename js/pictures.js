/* global pictures: true */

/**
 * @fileoverview
 * @author Gleb Vorontsov
 */

'use strict';


(function() {
  var picturesContainer = document.querySelector('.pictures');
  var filtersContainer = document.querySelector('.filters');
  filtersContainer.classList.remove('hidden');

  //Создаёт для каждой записи массива pictures блок фотографии на основе шаблона #picture-template
  pictures.forEach(function(picture) {
    var element = getElementFromTemplate(picture);
    picturesContainer.appendChild(element);
  });

  /**
   * Создаем новый DOM элемент на основе шаблона
   * @param {Object} data
   * @return {Element}
   */
  function getElementFromTemplate(data) {
    var templateSelector = 'picture-template';
    var template = document.getElementById(templateSelector);
    var element;

    if ('content' in template) {
      element = template.content.childNodes[1].cloneNode(true);
    } else {
      element = template.childNodes[1].cloneNode(true);
    }

    var ELEMENT_IMAGE_WIDTH = 182;
    var ELEMENT_IMAGE_HEIGHT = 182;
    var elementImage = new Image(ELEMENT_IMAGE_WIDTH, ELEMENT_IMAGE_HEIGHT);
    elementImage.src = data.url;

    var templateImage = element.querySelector('img');

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
