'use strict';

//  модуль, который создает данные
(function () {
  var CHECKINS = ['12:00', '13:00', '14:00'];
  var CHECKOUTS = ['12:00', '13:00', '14:00'];
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

  // создаю шаблон объекта, который будет описывать похожие объявления
  var objectOfAds = function () {
    var locationX = getRandomNumber(locationXY.minX, locationXY.maxX);
    var locationY = getRandomNumber(locationXY.minY, locationXY.maxY);
    return {
      'location': {
        x: locationX,
        y: locationY
      }
    };
  };

  // возвращает переменную объявлений
  var get = function () {
    return ads;
  };

  // переназначает переменную объявлений, старые объявления заменяет adsData из сервака
  var set = function (newAds) {
    ads = newAds;
  };

  // перенос в глобальную область видимости
  window.data = {
    // getRandomNumber: getRandomNumber,
    objectOfAds: objectOfAds,
    locationXY: locationXY,
    CHECKINS: CHECKINS,
    CHECKOUTS: CHECKOUTS,
    get: get,
    set: set
  };
})();
