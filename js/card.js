'use strict';

// модуль для добавления элемента-объявление в массив
(function () {

  var getArrayOfAds = function (adsAmount) {
    var adsArr = [];
    for (var j = 1; j <= adsAmount; j++) {
      adsArr.push(window.data.objectOfAds()); // добаляю в массив шаблон объявления-попапа
    }
    return adsArr;
  };
  var countOfObject = 8; // количество js объектов нам необходимое в массиве по условию
  var arrayOfAds = getArrayOfAds(countOfObject); // создаём шаблон массив-объявлений из 8 объектов на карте

  // перенос в глобальную область видимости
  window.card = {
    arrayOfAds: arrayOfAds
  };
})();
