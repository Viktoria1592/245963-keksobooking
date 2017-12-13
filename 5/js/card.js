'use strict';

// модуль для отрисовки элемента на карточке
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

  // Отрисовка DOM-элемент маркера отелей и вставка

  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card'); // Находим шаблон объявления в template, которы будем копировать
  var map = document.querySelector('.map'); // общая поле = карта + настройки
  var mapPins = map.querySelector('.map__pins'); // находим элемент-карту в которую отрисовываем сгенерированные DOM-элементы
  var articleElement = mapCardTemplate.cloneNode(true); // клонируем содержимое объявления из template
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  // функция снятия класса активного маркера
  var removeActive = function () {
    var pin = document.querySelector('.map__pin--active');
    if (pin !== null) {
      pin.classList.remove('map__pin--active');
    }
  };

  // функция удаления попапа
  var hideArticle = function () {
    var removePopup = document.querySelector('.map__card'); // шаблон объявления-попап
    if (removePopup !== null) {
      mapPins.removeChild(removePopup); // map.
    }
  };

  // закрываем попап Enter и убираем активный класс
  var onCloseEnterPress = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      removeActive();
      hideArticle();
    }
  };

  // закрываем попап Esc и убираем активный класс
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      removeActive();
      hideArticle();
    }
  };

  // ============ Отрисовка DOM-элемент объявление и вставка ============ //

  // удаляем дочерние элементы
  var deletePopupFeatures = function (featureElement) {
    while (featureElement.firstChild) {
      featureElement.removeChild(featureElement.firstChild);
    }
    return featureElement;
  };
  // deletePopupFeatures(popupFeatures);

  var getFeatures = function (item) {
    return '<li class="feature feature--' + item + '"></li>';
  };

  // создаём DOM-элемент объявление-попап, заполняя его данными из объекта objectOfAds
  var renderArticle = function (ads) { // функция создания DOM-элемента на основе JS-объекта
    articleElement.querySelector('.popup__avatar').src = ads.author.avatar; // Заменяем аватарку пользователя
    articleElement.querySelector('h3').textContent = ads.offer.title;
    articleElement.querySelector('small').textContent = ads.offer.address;
    articleElement.querySelector('.popup__price').innerHTML = ads.offer.price + '&#x20bd;/ночь';
    articleElement.querySelector('h4').textContent = ads.offer.type;
    articleElement.querySelector('p:nth-of-type(3)').textContent = ads.offer.rooms + ' комнат для ' + ads.offer.guests + ' гостей';
    articleElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + ads.offer.checkin + ', выезд до ' + ads.offer.checkout;
    deletePopupFeatures(articleElement.querySelector('.popup__features')); // удаляем дочерние элементы
    articleElement.querySelector('.popup__features').insertAdjacentHTML('afterbegin', ads.offer.features.map(getFeatures).join(' '));
    articleElement.querySelector('ul + p').textContent = ads.offer.description;
    // кириллицу выводит вместо латинницы
    if (ads.offer.type === 'flat') { // Квартира для flat, Бунгало для bungalo, Дом для house
      articleElement.querySelector('h4').textContent = 'Квартира';
    } else if (ads.offer.type === 'bungalo') {
      articleElement.querySelector('h4').textContent = 'Бунгало';
    } else {
      articleElement.querySelector('h4').textContent = 'Дом';
    }
    // обработчик события закрытия попапа и смены класса
    var closePopupItem = articleElement.querySelector('.popup__close');
    closePopupItem.addEventListener('click', function () {
      closePopupItem.autofocus = false;
      removeActive();
      hideArticle();
    });
    // обработчик события закрытия попапа и убирает активный класс при нажатии Enter
    closePopupItem.addEventListener('keydown', onCloseEnterPress);
    closePopupItem.tabIndex = 1;
    mapPins.appendChild(articleElement); // на карту добавить отрисованный попап - map.
    // return articleElement; - устарело
  };

  // перенос в глобальную область видимости
  window.card = {
    renderArticle: renderArticle,
    arrayOfAds: arrayOfAds,
    onPopupEscPress: onPopupEscPress,
    removeActive: removeActive,
    hideArticle: hideArticle
  };
})();
