'use strict';

// модуль для показа карточки выбранного жилья по нажатию на метку на карте
(function () {
  window.showCard = function () {
    window.card.removeActive();
    window.card.hideArticle();
    document.addEventListener('keydown', window.card.onPopupEscPress);
  };
  /*
  window.showCard = function () {
    var newFragment = document.createDocumentFragment();
    for (var i = 0; i < window.card.arrayOfAds.length; i++) { // Перебор всех восьми элементов-объявлений массива
      newFragment.appendChild(window.pin.renderPoint(window.card.arrayOfAds[i])); // рендорим в массив-объявлений маркеры, каждому объявлению по маркеру
    }
    window.querySelector('.map__pins').appendChild(newFragment); // добавляем на карту отрисовку пина
  };
  */
})();
