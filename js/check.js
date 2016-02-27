/**
 * @fileoverview
 * @author Gleb Vorontsov
 */

'use strict';

/**
 * Анализ входного изображения при загрузке
 * @param {Function} child
 * @param {Function} parent
 * @returns {string} message – строка с сообщением
 */

function getMessage(a, b) {

  var message = '';

  if ( typeof(a) == 'boolean' ) {
    if (a) {
      message = 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    }
    else {
      message = 'Переданное GIF-изображение не анимировано';
    }
  }

  if (typeof(a) == 'number') {
    message =  'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 +' аттрибутов';
  }

  if (Array.isArray(a)) {
    var sum = 0;
    for (var i = 0; i < a.length; i++ ) {
      sum += a[i];
    }
    message = 'Количество красных точек во всех строчках изображения: ' + sum;
  }

  if ( Array.isArray(a) && Array.isArray(b) ) {
    var square = 0;
    var minArray = 0;

    if ( a.length > b.length ) {
      minArray = b.length;
    }
    else {
      minArray = a.length;
    }

    for ( var i = 0; i < minArray; i++ ) {
      square += a[i] * b[i];
    }

    message = 'Общая площадь артефактов сжатия: ' + square + 'пикселей';
  }

  return message;
}
