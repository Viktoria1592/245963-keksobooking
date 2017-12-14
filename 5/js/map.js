'use strict';

// модуль, который работает с картой
(function () {

  var ENTER_KEYCODE = 13;
  var noticeForm = document.querySelector('.notice__form');
  var address = noticeForm.querySelector('#address');
  var formFieldset = document.querySelectorAll('.fieldset');
  var map = document.querySelector('.map'); // общая поле = карта + настройки
  var mapPinMain = map.querySelector('.map__pin--main');
  var mapPins = map.querySelector('.map__pins'); // находим элемент-карту в которую отрисовываем сгенерированные DOM-элементы
  var locationMainInForm = { // координаты главного маркера-пина
    x: 580,
    y: 355
  };
  var pinWidth = 40; // ширина иконки
  var pinHeight = 40; // высота иконки пина

  // функция внесения адрес-координат в форму по умолчанию - для тестирования формы
  var getAddress = function () {
    address.value = locationMainInForm.x + ', ' + locationMainInForm.y;
  };

  /*
  // Закрыть попап объявления по умолчанию
  var closePopup = function () {
    articleElement.classList.add('hidden');
  };
  var openPopup = function () {
    articleElement.classList.remove('hidden');
  };
  */

  // функция делает недоступными все поля форм по умолчанию
  var getDisabledMapAndForms = function () {
    map.classList.add('map--faded');
    for (var j = 0; j < formFieldset.length; j++) {
      formFieldset[j].setAttribute('disabled', 'disabled');
    }
  };
  getDisabledMapAndForms();

  // событие активирует карту и форму
  var getActivateMapAndForms = function () {
    mapPins.appendChild(window.pin.fragment); // добавленте маркеров на карту, хранящихся в fragment
    map.classList.remove('map--faded');
    noticeForm.classList.remove('notice__form--disabled');
    window.card.renderArticle(window.card.arrayOfAds[0]); // отрисовываем 1й попап по умолчанию в общий map перед блоком map__filters-container
    for (var j = 0; j < formFieldset.length; j++) {
      formFieldset[j].removeAttribute('disabled', 'disabled');
    }
    getAddress();
  };

  // обработчик события на блоке при отпускании кнопки мыши активирует поля и карту
  mapPinMain.addEventListener('mouseup', getActivateMapAndForms);

  // обработчик события на блоке при нажатии ENTER
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      getActivateMapAndForms();
    }
  });

  // обработчик события закрытия попапа и убирает активный класса при ESC
  document.addEventListener('keydown', window.card.onPopupEscPress);

  // перетаскивание
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newX = mapPinMain.offsetLeft - shift.x; // переменная для отображения положения текущего пина по оси абсцисс
      if (newX > window.data.locationXY.maxX) { // ограничения для пина на крте по оси абсцисс
        mapPinMain.style.left = '900 px';
        locationMainInForm.x = window.data.locationXY.maxX;
      } else if (newX < window.data.locationXY.minX) {
        mapPinMain.style.left = '300 px';
        locationMainInForm.x = window.data.locationXY.minX;
      } else {
        mapPinMain.style.left = newX + 'px'; // отображение текущей координаты х
        locationMainInForm.x = newX - pinWidth / 2; // отображение координат для вывода в форму
      }

      var newY = mapPinMain.offsetTop - shift.y; // переменная для отображения положения текущего пина по оси ординат
      if (newY > window.data.locationXY.maxY) { // ограничения для пина на крте по оси ординат
        mapPinMain.style.top = '500 px';
        locationMainInForm.y = window.data.locationXY.maxY;
      } else if (newY < window.data.locationXY.minY) {
        mapPinMain.style.top = '100 px';
        locationMainInForm.y = window.data.locationXY.minY;
      } else {
        mapPinMain.style.top = newY + 'px'; // отображение текущей координаты у
        locationMainInForm.y = newY - pinHeight / 2; // отображение координат для вывода в форму
      }

      getAddress(); // вывод текущих координат главного пина в форму
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
