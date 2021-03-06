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
    locationXY: locationXY,
    CHECKINS: CHECKINS,
    CHECKOUTS: CHECKOUTS,
    get: get,
    set: set
  };
})();
