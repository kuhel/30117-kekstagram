function getMessage(a, b) {

  if ( typeof(a) == 'boolean' )
  {
    if (a) {
      return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
    }
    else {
      return 'Переданное GIF-изображение не анимировано'
    }
  }

  if (typeof(a) == 'number') {
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b * 4 +' аттрибутов';
  }

  if ( Array.isArray(a) ) {
    var sum = 0;
    for (var i = 0; i < a.length; i++ ) {
      sum += a[i];
    }
    return 'Количество красных точек во всех строчках изображения: ' + sum;
  }

  if ( Array.isArray(a) && Array.isArray(b) ) {
    var square = 0;
    var minArray;

    if (a.length > b.length) { minArray = b.length; }
    else { minArray = a.length; }

    for ( i = 0; i < minArray; i++ ) {
      square += a[i]*b[i]
    }

    return 'Общая площадь артефактов сжатия: ' + square + 'пикселей';
  }
}
