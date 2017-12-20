'use strict';

// модуль для отрисовки пина и взаимодействия с ним, без вставки
(function () {

  // Находим шаблон маркера в template, который будем копировать
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var ENTER_KEYCODE = 13;
  var pinWidth = 40; // ширина иконки
  var pinHeight = 40; // высота иконки

  // функция учитывает ширину картинки, смещается влево на пол-ширину
  var getPinWidth = function (x) {
    return x - pinWidth / 2;
  };

  // функция учитывает высоту маркера и высоту картинки
  var getPinHeight = function (y) {
    return y - pinHeight;
  };

  // var pinElement = mapPinTemplate.cloneNode(true); // клонируем содержимое маркера из template - НЕ РАБОТАЕТ СНАРУЖИ ФУНКЦИИ ??

  // Создает DOM-элемент маркера на основе шаблона и данных объявления
  var renderPoint = function (ads) { // TODO  - ad
    var pinElement = mapPinTemplate.cloneNode(true); // клонируем содержимое маркера из template
    pinElement.querySelector('img').width = pinWidth;
    pinElement.querySelector('img').height = pinHeight;
    pinElement.style.left = getPinWidth(ads.location.x) + 'px';
    pinElement.style.top = getPinHeight(ads.location.y) + 'px';
    pinElement.querySelector('img').src = ads.author.avatar;
    pinElement.tabIndex = 1;
    pinElement.className = 'map__pin'; // задал имя классу

    // обработчик событий замены акивного маркера по клику и появление своего попапа
    pinElement.addEventListener('click', function () {
      window.showCard.next(pinElement, ads);
      /* removeActive(); // снимает активный класс у кого находит при клике на маркер
      hideArticle(); // скрывает текущий попап
      pinElement.classList.add('map__pin--active');
      window.showCard.renderArticle(ads); // отрисовка объявления-попапа соответствующего нажатому маркеру*/
    });

    // обработчик событий замены акивного маркера по клику и появление своего попапа при нажатии Enter
    pinElement.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        window.showCard.next(pinElement, ads);
        /* removeActive();
        hideArticle();
        pinElement.classList.add('map__pin--active');
        window.showCard.renderArticle(ads);*/
      }
    });
    return pinElement;
  };

  // добавляем сгенерированный DOM-элемент маркера в fragment и храним его там. Добавляем на карту только при нажатии кнопки-активации
  var fragment = document.createDocumentFragment();

  // инициализация элементов пинов
  var init = function () {
    var ads = window.data.get(); // возвращает новые пины из модуля даты
    for (var i = 0; i < ads.length; i++) {
      fragment.appendChild(renderPoint(ads[i])); // рендорим в массив-объявлений маркеры, каждому объявлению по маркеру
    }
  };

  // перенос в глобальную область видимости
  window.pin = {
    fragment: fragment,
    renderPoint: renderPoint,
    init: init
  };
})();
