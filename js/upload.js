/**
 * @fileoverview
 * @author Igor Alexeenko (o0), Gleb Vorontsov
 */

'use strict';

define([
  'resizer'],
  function(Resizer) {
    /** @enum {string} */
    var FileType = {
      'GIF': '',
      'JPEG': '',
      'PNG': '',
      'SVG+XML': ''
    };

    /** @enum {number} */
    var Action = {
      ERROR: 0,
      UPLOADING: 1,
      CUSTOM: 2
    };




    /**
     * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
     * из ключей FileType.
     * @type {RegExp}
     */
    var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

    /**
     * @type {Object.<string, string>}
     */
    var filterMap;

    /**
     * Объект, который занимается кадрированием изображения.
     * @type {Resizer}
     */
    var currentResizer;

    /**
     * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
     * изображением.
     */
    function cleanupResizer() {
      if (currentResizer) {
        currentResizer.remove();
        currentResizer = null;
      }
    }

    /**
     * Ставит одну из трех случайных картинок на фон формы загрузки.
     */
    function updateBackground() {
      var images = [
        'img/logo-background-1.jpg',
        'img/logo-background-2.jpg',
        'img/logo-background-3.jpg'
      ];

      var backgroundElement = document.querySelector('.upload');
      var randomImageNumber = Math.round(Math.random() * (images.length - 1));
      backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
    }



    /**
     * Форма загрузки изображения.
     * @type {HTMLFormElement}
     */
    var uploadForm = document.forms['upload-select-image'];

    /**
     * Форма кадрирования изображения.
     * @type {HTMLFormElement}
     */
    var resizeForm = document.forms['upload-resize'];
    // Берем данные из формы
    var resizeX = resizeForm['resize-x'];
    var resizeY = resizeForm['resize-y'];
    var resizeSize = resizeForm['resize-size'];

    /**
     * Форма добавления фильтра.
     * @type {HTMLFormElement}
     */
    var filterForm = document.forms['upload-filter'];

    /**
     * @type {HTMLImageElement}
     */
    var filterImage = filterForm.querySelector('.filter-image-preview');

    /**
     * @type {HTMLElement}
     */
    var uploadMessage = document.querySelector('.upload-message');

    /**
     * Таймаут для проверки значения в форме
     * @type {function}
     */
    var checkValuesTimeout;

    /**
     * Значение таймаута проверки значений в форме
     * @type {number}
     * @const
     */
    var FORM_CHECK_TIMEOUT = 100;

    /**
     * Большая сторона
     */
    function setMaxSide() {
      resizeSize.max = Math.min((currentResizer._image.naturalWidth - resizeX.value), (currentResizer._image.naturalHeight - resizeY.value));
      clearTimeout(checkValuesTimeout);
      checkValuesTimeout = setTimeout(function() {
        resizeFormIsValid();
      }, FORM_CHECK_TIMEOUT);
    }

    resizeSize.min = 1;


    /**
     * Проверяет, валидны ли данные, в форме кадрирования.
     * @returns {boolean}
     */
    function resizeFormIsValid() {

      var isXSideLargeThenNaturalWidth = +resizeX.value + +resizeSize.value < currentResizer._image.naturalWidth;
      var isYSideLargeThenNaturalHeight = +resizeY.value + +resizeSize.value < currentResizer._image.naturalHeight;
      var isTopAndLeftPositive = +resizeX.value < 0 || +resizeY.value < 0 || +resizeSize.value < 0;

      if (isXSideLargeThenNaturalWidth && isYSideLargeThenNaturalHeight && isTopAndLeftPositive) {
        resizeForm['resize-fwd'].disabled = true;
        return false;
      } else {
        resizeForm['resize-fwd'].disabled = false;
        return true;
      }
    }


    /**
     * @param {Action} action
     * @param {string=} message
     * @return {Element}
     */
    function showMessage(action, message) {
      var isError = false;

      switch (action) {
        case Action.UPLOADING:
          message = message || 'Кексограмим&hellip;';
          break;

        case Action.ERROR:
          isError = true;
          message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
          break;
      }

      uploadMessage.querySelector('.upload-message-container').innerHTML = message;
      uploadMessage.classList.remove('invisible');
      uploadMessage.classList.toggle('upload-message-error', isError);
      return uploadMessage;
    }

    /**
     * Валидация формы при изменение вводимых данных
     */
    resizeForm.addEventListener('change', function() {
      resizeFormIsValid();
    });


    function hideMessage() {
      uploadMessage.classList.add('invisible');
    }

    /**
     * Обработчик изменения изображения в форме загрузки. Если загруженный
     * файл является изображением, считывается исходник картинки, создается
     * Resizer с загруженной картинкой, добавляется в форму кадрирования
     * и показывается форма кадрирования.
     * @param {Event} evt
     */
    uploadForm.addEventListener('change', function(evt) {
      var element = evt.target;
      if (element.id === 'upload-file') {
        // Проверка типа загружаемого файла, тип должен быть изображением
        // одного из форматов: JPEG, PNG, GIF или SVG.
        if (fileRegExp.test(element.files[0].type)) {
          var fileReader = new FileReader();

          showMessage(Action.UPLOADING);

          fileReader.onload = function() {
            cleanupResizer();

            currentResizer = new Resizer(fileReader.result);
            currentResizer.setElement(resizeForm);
            uploadMessage.classList.add('invisible');

            uploadForm.classList.add('invisible');
            resizeForm.classList.remove('invisible');

            hideMessage();
            setMaxSide();
            setTimeout(setResizeValues, 1);

          };

          fileReader.readAsDataURL(element.files[0]);
        } else {
          // Показ сообщения об ошибке, если загружаемый файл, не является
          // поддерживаемым изображением.
          showMessage(Action.ERROR);
        }
      }
    });

    function setResizeValues() {
      var baseSize = currentResizer.getConstraint();
      resizeX.value = Math.ceil(baseSize.x);
      resizeY.value = Math.ceil(baseSize.y);
      resizeSize.value = Math.ceil(baseSize.side);
    }

    /**
     * Передаетв объект resizer значения для метода moveConstraint
     */
    function setConstraitMoveValues() {
      currentResizer.moveConstraint(+resizeX.value, +resizeY.value, +resizeSize.value);
      setMaxSide();
    }


    resizeX.addEventListener('change', setConstraitMoveValues);

    resizeY.addEventListener('change', setConstraitMoveValues);

    resizeSize.addEventListener('change', setConstraitMoveValues);

    /**
     * Обработчик берущий значения смещения и размера кадра из объекта resizer для добавления их в форму
     * @param {Event} resizerchange
     */
    window.addEventListener('resizerchange', function() {
      setResizeValues();
      setMaxSide();
    });

    /**
     * Синхронизация изменения значений полей resizeForm
     * и валидация формы.
     * @param {Event} change
     */
    resizeForm.addEventListener('change', function() {
      if (resizeFormIsValid()) {
        currentResizer.setConstraint(+resizeX.value, +resizeY.value, +resizeSize.value);
      }
    });

    /**
     * Обработка сброса формы кадрирования. Возвращает в начальное состояние
     * и обновляет фон.
     * @param {Event} evt
     */
    resizeForm.addEventListener('reset', function(evt) {
      evt.preventDefault();

      cleanupResizer();
      updateBackground();

      resizeForm.classList.add('invisible');
      uploadForm.classList.remove('invisible');
    });

    /**
     * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
     * кропнутое изображение в форму добавления фильтра и показывает ее.
     * @param {Event} evt
     */
    resizeForm.addEventListener('submit', function(evt) {
      evt.preventDefault();

      if (resizeFormIsValid()) {
        filterImage.src = currentResizer.exportImage().src;
        resizeForm.classList.add('invisible');
        filterForm.classList.remove('invisible');
      }
    });

    /**
     * Вычисления срока жизни куки по дате рождения пользователя
     * Формат даты дд/мм
     * @param {string} birthday
     * @returns {string} expireDate
     */
    function cookieExpireDateByBirthday(birthday) {
      var todayDate = new Date();

      var formatDate = birhday.split('/');
      var birthdayDate = new Date();
      birthdayDate.setMonth(formatDate[1] - 1);
      birthdayDate.setDate(formatDate[0]);

      if (todayDate.getMonth() - 1 > formatDate[1]) {
        birthdayDate.setYear(todayDate.getFullYear());
      } else if (todayDate.getMonth() - 1 === formatDate[1]) {
        if (todayDate.getDay() < formatDate[0]) {
          birthdayDate.setYear(todayDate.getFullYear() - 1);
        } else {
          birthdayDate.setYear(todayDate.getFullYear());
        }
      } else {
        birthdayDate.setYear(todayDate.getFullYear() - 1);
      }


      var expireDate = new Date(todayDate.valueOf() + (todayDate.valueOf() - birthdayDate.valueOf()));

      return expireDate.toUTCString();
    }

    /**
     * Сброс формы фильтра. Показывает форму кадрирования.
     * @param {Event} evt
     */
    filterForm.addEventListener('reset', function(evt) {
      evt.preventDefault();

      filterForm.classList.add('invisible');
      resizeForm.classList.remove('invisible');
    });

    /**
     * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
     * записав сохраненный фильтр в cookie.
     * @param {Event} evt
     */
    filterForm.addEventListener('submit', function(evt) {
      evt.preventDefault();

      cleanupResizer();
      updateBackground();

      var BIRTHDAY_DATE = '13/11';
      var cookieExpires = cookieExpireDateByBirthday(BIRTHDAY_DATE);
      var filterName = (filterImage.classList[1]) ? filterImage.classList[1] : 'no-filter';
      window.docCookies.setItem('filter', filterName, cookieExpires);

      filterForm.classList.add('invisible');
      uploadForm.classList.remove('invisible');
    });

    /**
     * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
     * выбранному значению в форме.
     */
    filterForm.addEventListener('change', function() {
      if (!filterMap) {
        // Ленивая инициализация. Объект не создается до тех пор, пока
        // не понадобится прочитать его в первый раз, а после этого запоминается
        // навсегда.
        filterMap = {
          'none': 'filter-none',
          'chrome': 'filter-chrome',
          'sepia': 'filter-sepia'
        };
      }

      var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
        return item.checked;
      })[0].value;

      // Класс перезаписывается, а не обновляется через classList потому что нужно
      // убрать предыдущий примененный класс. Для этого нужно или запоминать его
      // состояние или просто перезаписывать.
      filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
    });

    /**
     * Применяем фильтр взятый из куки изображению и инпуту
     *
     */
    function getLastFilter() {
      var lastFilter = window.docCookies.getItem('filter');
      if (lastFilter) {
        filterImage.className = 'filter-image-preview ' + lastFilter;
        filterForm['upload-' + lastFilter].setAttribute('checked', 'checked');
      }
    }

    window.addEventListener('load', function() {
      getLastFilter();
    });

    cleanupResizer();
    updateBackground();
  });
