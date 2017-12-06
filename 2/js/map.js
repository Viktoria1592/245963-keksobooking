'use strict';

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

// функция для создания массива случайной длины
/*
var getRandomLength = function (arr) {
  var featuresAmount = getRandomNumber(1, arr.length);
  arr.length = featuresAmount;
  return arr;
};
*/

// функция для возвращения номер аватара пользователя
var getAvatarNumber = function () {
  return (avatarNumber.min <= avatarNumber.max) ? avatarNumber.min++ : 0;
};

// создаю объект, который будет описывать похожие объявления
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
      // 'features': getRandomLength(FEATURES), - одинаковое число для всех объектов
      'features': FEATURES.splice(getRandomNumber(0, FEATURES.length), getRandomNumber(0, FEATURES.length + 1)),
      'description': '',
      'photos': []
    },
    'location': {
      'x': locationX,
      'y': locationY
    }
  };
};

// создаю массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления
var getArrayOfAds = function (adsAmount) {
  var adsArr = [];
  for (var j = 1; j <= adsAmount; j++) {
    adsArr.push(objectOfAds());
  }
  return adsArr;
};

var countOfObject = 8; // количество js объектов нам необходимое в массиве по условию
var arrayOfAds = getArrayOfAds(countOfObject); // массив из js объектов нам необходимых


var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin'); // Находим шаблон-кнопки в template, который будем копировать
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card'); // Находим шаблон-описания в template, которы будем копировать

var pinWidth = 40; // ширина иконки
var pinHeight = 40; // высота иконки
var getPinHeight = function (locationX) { // функция учитывает ширину картинки, смещается влево на пол-ширину
  return locationX - pinWidth / 2;
};

var getPinWidth = function (locationY) { // функция учитывает высоту метки с острым концом (18px) и высоту картинки
  return locationY - pinHeight - 18;
};

// Создает DOM-элемент button на основе шаблона и данных объявления
var renderPin = function (ads) {
  var pinElement = mapPinTemplate.cloneNode(true); // клонируем содержимое кнопки из template
  pinElement.querySelector('img').width = pinWidth;
  pinElement.querySelector('img').height = pinHeight;
  pinElement.style.left = getPinHeight(ads.location.x) + ads.location.y + 'px';
  pinElement.style.top = getPinWidth(ads.location.x) + 'px';
  pinElement.querySelector('img').src = ads.author.avatar;
  return pinElement;
};

var map = document.querySelector('.map');
map.classList.remove('map--faded'); //  показываем окно настроек пользователя

var mapPins = map.querySelector('.map__pins'); // находим элемент/карту в которую отрисовываем сгенерированные DOM-элементы

// Отрисовываем сгенерированные DOM-элемент button в блок .map__pins
var fragment = document.createDocumentFragment();
for (var i = 0; i < arrayOfAds.length; i++) { // ? - до длинны массива из объектов
  fragment.appendChild(renderPin(arrayOfAds[i])); // ? - добавляем DOM-элемент объявление из массива пообъектно
}
mapPins.appendChild(fragment); // вставляем DOM-элемент button в нужное поле

var getFeatures = function (item) {
  return '<li class="feature feature--' + item + '"></li>';
};

var popupFeatures = mapCardTemplate.querySelector('.popup__features');

// удаляем дочерние элементы
var deletePopupFeatures = function (featureElement) {
  for (var j = 0; j < featureElement.children.length; j++) {
    featureElement.removeChild(featureElement.children[j]);
  }
  return featureElement;
};
deletePopupFeatures(popupFeatures);

// создаём DOM-элемент объявление, заполняя его данными из объекта objectOfAds
var renderMapCard = function (ads) { // Отрисуем шаблон-мага - функция создания DOM-элемента на основе JS-объекта
  var mapCardElement = mapCardTemplate.cloneNode(true); // клонируем содержимое объявления из template

  mapCardElement.querySelector('.popup__avatar').src = ads.author.avatar; // Замяем аватарку пользователя
  mapCardElement.querySelector('h3').textContent = ads.offer.title;
  mapCardElement.querySelector('small').textContent = ads.offer.address;
  mapCardElement.querySelector('.popup__price').innerHTML = ads.offer.price + '&#x20bd;/ночь';
  mapCardElement.querySelector('h4').textContent = ads.offer.type;
  mapCardElement.querySelector('p:nth-of-type(3)').textContent = ads.offer.rooms + ' комнат для ' + ads.offer.guests + ' гостей';
  mapCardElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + ads.offer.checkin + ', выезд до ' + ads.offer.checkout;
  // mapCardElement.querySelector('.popup__features').insertAdjacentHTML('afterbegin', ads.offer.features.map(getFeatures).join(' ')); // - ?
  mapCardElement.querySelector('ul + p').textContent = ads.offer.description;

  // Квартира для flat, Бунгало для bungalo, Дом для house
  if (ads.offer.type === 'flat') {
    mapCardElement.querySelector('h4').textContent = 'Квартира';
  } else if (ads.offer.type === 'bungalo') {
    mapCardElement.querySelector('h4').textContent = 'Бунгало';
  } else {
    mapCardElement.querySelector('h4').textContent = 'Дом';
  }
  return mapCardElement;
};


// вставляем 1-й полученный DOM-элемент в блок map перед блоком map__filters-container
var mapFiltersContainer = map.querySelector('.map__filters-container');
map.insertBefore(renderMapCard(arrayOfAds[0]), mapFiltersContainer);
