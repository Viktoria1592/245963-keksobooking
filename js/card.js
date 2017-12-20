'use strict';

// модуль для добавления элемента-объявление в массив
(function () {

  // Находим шаблон объявления в template, которы будем копировать
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card'); // перенёс -??
  // клонируем содержимое объявления из template
  var articleElement = mapCardTemplate.cloneNode(true); // перенёс -??

  /*
  var getArrayOfAds = function (adsAmount) { // TODO перенести в data
    var adsArr = [];
    for (var j = 1; j <= adsAmount; j++) {
      adsArr.push(window.data.objectOfAds()); // добаляю в массив шаблон объявления-попапа
    }
    return adsArr;
  };
  var countOfObject = 8; // количество js объектов нам необходимое в массиве по условию
  var arrayOfAds = getArrayOfAds(countOfObject); // создаём шаблон массив-объявлений из 8 объектов на карте
  // TODO  - arrayOfAds = ads
  */

  function get() { // возвращает шаблон объявления
    return articleElement;
  }

  // перенос в глобальную область видимости
  window.card = {
    get: get
  };
})();
