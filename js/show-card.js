'use strict';

// модуль для показа карточки выбранного жилья по нажатию на метку на карте
(function () {
  window.showCard = function () {
    window.card.removeActive();
    window.card.hideArticle();
    document.addEventListener('keydown', window.card.onPopupEscPress);
  };


})();
