'use strict';

// модуль для отрисовки пина и взаимодействия с ним, без вставки
(function () {
  // Находим шаблон маркера в template, который будем копировать
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var ENTER_KEYCODE = 13;
  var pinWidth = 40; // ширина иконки
  var pinHeight = 40; // высота иконки
  var MAX_PINS = 5;

  // функция учитывает ширину картинки, смещается влево на пол-ширину
  var getPinWidth = function (x) {
    return x - pinWidth / 2;
  };

  // функция учитывает высоту маркера и высоту картинки
  var getPinHeight = function (y) {
    return y - pinHeight;
  };

  // Создает DOM-элемент маркера на основе шаблона и данных объявления
  var renderPoint = function (ad) {
    var pinElement = mapPinTemplate.cloneNode(true); // клонируем содержимое маркера из template
    pinElement.querySelector('img').width = pinWidth;
    pinElement.querySelector('img').height = pinHeight;
    pinElement.style.left = getPinWidth(ad.location.x) + 'px';
    pinElement.style.top = getPinHeight(ad.location.y) + 'px';
    pinElement.querySelector('img').src = ad.author.avatar;
    pinElement.tabIndex = 1;
    pinElement.className = 'map__pin'; // задал имя классу
    // обработчик событий замены акивного маркера по клику и появление своего попапа
    pinElement.addEventListener('click', function () {
      window.showCard.next(pinElement, ad);
    });
    // обработчик событий замены акивного маркера по клику и появление своего попапа при нажатии Enter
    pinElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        window.showCard.next(pinElement, ad);
      }
    });
    return pinElement;
  };

  // добавляем сгенерированный DOM-элемент маркера в fragment и храним его там. Добавляем на карту только при нажатии кнопки-активации
  var fragment = document.createDocumentFragment();
  // инициализация элементов пинов
  var init = function () {
    var ads = window.data.get(); // возвращает новые пины из модуля data
    for (var i = 0; i < ads.length; i++) {
      fragment.appendChild(renderPoint(ads[i])); // рендорим в массив-объявлений маркеры, каждому объявлению по маркеру
    }
  };
  // функция добавления пинов на карту, хранящихся в fragment
  var addPins = function () {
    document.querySelector('.map__pins').appendChild(fragment);
  };

  // ----- фильтрация данных с сервера ----- //

  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;
  // функция для устранения 'дребезг'
  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

  var mapFilters = document.querySelector('.map__filters');
  var filterHousingType = mapFilters.querySelector('#housing-type');
  var filterPrice = mapFilters.querySelector('#housing-price');
  var filterRooms = mapFilters.querySelector('#housing-rooms');
  var filterGuests = mapFilters.querySelector('#housing-guests');
  var filterFeatures = mapFilters.querySelector('#housing-features');
  var checkedElements = filterFeatures.querySelectorAll('input[type="checkbox"]:checked'); // Получаем список выделенных чекбоксов
  var checkedFeatures = []; // выделенные удобства
  var filterValue = { // объект c текущими значениями фильтров
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any'
  };
  var dataCopy = []; // копия данных полученных с сервера

  // Массив с функциями фильтров
  var ArrWithFunctionsFilters = [
    function (arr) { // по типу жилья
      if (filterValue.type !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.type === filterValue.type;
        });
      }
      return arr;
    },

    function (arr) { // по цене жилья
      if (filterValue.price !== 'any') {
        if (filterValue.price === 'low') {
          arr = arr.filter(function (element) {
            return element.offer.price <= 10000;
          });
        } else if (filterValue.price === 'high') {
          arr = arr.filter(function (element) {
            return element.offer.price >= 50000;
          });
        } else {
          arr = arr.filter(function (element) {
            return (element.offer.price > 10000) && (element.offer.price < 50000);
          });
        }
      }
      return arr;
    },

    function (arr) { // по количеству комнат
      if (filterValue.rooms !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.rooms === parseInt(filterValue.rooms, 10);
        });
      }
      return arr;
    },

    function (arr) { // по количеству гостей
      if (filterValue.guests !== 'any') {
        arr = arr.filter(function (element) {
          return element.offer.guests === parseInt(filterValue.guests, 10);
        });
      }
      return arr;
    },

    function (arr) { // по перечню удобств
      return arr.filter(function (element) {
        return checkedFeatures.every(function (elem) {
          return element.offer.features.indexOf(elem) >= 0;
        });
      });
    }
  ];

  // Функция фильтрации
  var updateMap = function (evt) {
    // Текущее значение фильтров меняется после сработавшего фильтра
    var filterName = evt.target.name.substring(6); // напр. HousingType
    filterValue[filterName] = evt.target.value;

    // Копируем исходные данные с сервера для фильтрования
    var dataFiltered = dataCopy.slice();

    // Преобразуем список отмеченных чекбоксов в массив строк
    checkedFeatures = [].map.call(checkedElements, function (element) {
      return element.value;
    });

    // Массив с функциями фильтров пропускаем через фильрованные данных (обработка системой фильтров)
    ArrWithFunctionsFilters.forEach(function (element) {
      dataFiltered = element(dataFiltered);
    });

    // устанавливаем необходимую длину для полученного массива
    if (dataFiltered.length > MAX_PINS) {
      dataFiltered = dataFiltered.slice(0, MAX_PINS + 1);
    }
    debounce(addPins); // "дребезг" для добавления пинов на карту
  };

  // обработчики событий изменённых фильтров
  filterHousingType.addEventListener('change', updateMap);
  filterPrice.addEventListener('change', updateMap);
  filterRooms.addEventListener('change', updateMap);
  filterGuests.addEventListener('change', updateMap);
  filterFeatures.addEventListener('change', updateMap);

  // перенос в глобальную область видимости
  window.pin = {
    fragment: fragment,
    renderPoint: renderPoint,
    init: init,
    addPins: addPins,
    updateMap: updateMap
  };
})();
