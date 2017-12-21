'use strict';

//  модуль, который создает данные
(function () {
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPES = ['flat', 'house', 'bungalo'];
  var CHECKIN = ['12:00', '13:00', '14:00'];
  var CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var avatarNumber = {
    'min': 1,
    'max': 8
  };
  var price = {
    'min': 1000,
    'max': 1000000
  };
  var rooms = {
    'min': 1,
    'max': 5
  };
  var locationXY = {
    'minX': 300,
    'maxX': 900,
    'minY': 100,
    'maxY': 500
  };
  var ads = []; // переменная объявлений
  window.backend.load(window.backend.successHandler, window.backend.errorHandler); // загрузка данных с сервера сразу

  // функция рандома возвращает случайное число в заданном пределе
  var getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };

  // функция рандома возвращает случайный элемент массива
  var getRandomItem = function (arr) {
    var randomIndex = Math.round(Math.random() * (arr.length - 1)); // получаем случайное число от 0 до индекса последнего элемента
    return arr[randomIndex];
  };

  // функция рандома возвращает случайный элемент массива без повторения
  var getRandomTitle = function (arr) {
    var titleIndex = getRandomNumber(0, arr.length - 1);
    return arr.splice(titleIndex, 1);
  };

  // функция для возвращения номер аватара пользователя
  var getAvatarNumber = function () {
    return (avatarNumber.min <= avatarNumber.max) ? avatarNumber.min++ : 0;
  };

  // создаю шаблон объекта, который будет описывать похожие объявления
  var objectOfAds = function () {
    var locationX = getRandomNumber(locationXY.minX, locationXY.maxX);
    var locationY = getRandomNumber(locationXY.minY, locationXY.maxY);
    return {
      'author': {
        avatar: 'img/avatars/user0' + getAvatarNumber() + '.png'
      },
      'offer': {
        'title': getRandomTitle(TITLES),
        'address': locationX + ', ' + locationY,
        'price': getRandomNumber(price.min, (price.max + 1)),
        'type': getRandomItem(TYPES),
        'rooms': getRandomNumber(rooms.min, (rooms.max + 1)),
        'guests': getRandomNumber(1, 9),
        'checkin': getRandomItem(CHECKIN),
        'checkout': getRandomItem(CHECKOUT),
        'features': FEATURES.splice(getRandomNumber(0, FEATURES.length), getRandomNumber(0, FEATURES.length)), // С любой позиции массива рандомно от 0й до 5й позиции (всего 6 и она не включается) удаляем количество эелментов массива от 0 до 5
        'description': '',
        'photos': []
      },
      'location': {
        x: locationX,
        y: locationY
      }
    };
  };

  // возвращает переменную объявлений
  function get() {
    return ads;
  }

  // переназначает переменную объявлений, старые объявления заменяет adsData из сервака
  function set(newAds) {
    ads = newAds;
  }

  // перенос в глобальную область видимости
  window.data = {
    getRandomNumber: getRandomNumber,
    objectOfAds: objectOfAds,
    locationXY: locationXY,
    CHECKIN: CHECKIN,
    CHECKOUT: CHECKOUT,
    get: get,
    set: set
  };
})();
