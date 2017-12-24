'use strict';

(function () {
  // Находим шаблон объявления в template, которы будем копировать
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  // клонируем содержимое объявления из template
  var articleElement = mapCardTemplate.cloneNode(true);

  // возвращает шаблон объявления
  var get = function () {
    return articleElement;
  };

  // перенос в глобальную область видимости
  window.card = {
    get: get
  };
})();
