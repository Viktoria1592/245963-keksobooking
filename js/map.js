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

// создаю шаблон объекта, который будет описывать похожие объявления
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
      'features': FEATURES.splice(getRandomNumber(0, FEATURES.length), getRandomNumber(0, FEATURES.length + 1)),
      'description': '',
      'photos': []
    },
    'location': {
      x: locationX,
      y: locationY
    }
  };
};

// создаю массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления
var getArrayOfAds = function (adsAmount) {
  var adsArr = [];
  for (var j = 1; j <= adsAmount; j++) {
    adsArr.push(objectOfAds()); // добаляю в массив шаблон объявления-попапа
  }
  return adsArr;
};

var countOfObject = 8; // количество js объектов нам необходимое в массиве по условию
var arrayOfAds = getArrayOfAds(countOfObject); // создаём массив-объявлений из 8 объектов на карте

// ============ Отрисовка DOM-элемент маркера отелей, но без вставки ============ //

var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin'); // Находим шаблон маркера в template, который будем копироват
var map = document.querySelector('.map'); // общая поле = карта + настройки
var mapPins = map.querySelector('.map__pins'); // находим элемент-карту в которую отрисовываем сгенерированные DOM-элементы

var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card'); // Находим шаблон объявления в template, которы будем копировать
var popupFeatures = mapCardTemplate.querySelector('.popup__features');
var articleElement = mapCardTemplate.cloneNode(true); // клонируем содержимое объявления из template

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var noticeForm = document.querySelector('.notice__form');
var formFieldset = document.querySelectorAll('.fieldset');

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

// закрываем попап Esc и убираем активный класс
var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    removeActive();
    hideArticle();
  }
};

// закрываем попап Enter и убираем активный класс
var onCloseEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    removeActive();
    hideArticle();
  }
};

// Создает DOM-элемент маркера на основе шаблона и данных объявления
var renderPoint = function (ads) {
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
    removeActive(); // снимает активный класс у кого находит при клике на маркер
    hideArticle(); // скрывает текущий попап
    pinElement.classList.add('map__pin--active');
    renderArticle(ads); // отрисовка объявления-попапа соответствующего нажатому маркеру
  });
  // обработчик событий замены акивного маркера по клику и появление своего попапа при нажатии Enter
  pinElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      removeActive();
      hideArticle();
      pinElement.classList.add('map__pin--active');
      renderArticle(ads);
    }
  });
  return pinElement;
};
// map.classList.remove('map--faded'); - устаревшее, показываем окно настроек пользователя

// добавляем сгенерированный DOM-элемент маркера в fragment и храним его там. Добавляем на карту только при нажатии кнопки-активации
var fragment = document.createDocumentFragment();
for (var i = 0; i < arrayOfAds.length; i++) {
  fragment.appendChild(renderPoint(arrayOfAds[i])); // рендорим в массив-объявлений маркеры, каждому объявлению по маркеру
}

// ============ Отрисовка DOM-элемент объявление и вставка ============ //

// удаляем дочерние элементы
var deletePopupFeatures = function (featureElement) {
  while (featureElement.firstChild) {
    featureElement.removeChild(featureElement.firstChild);
  }
  return featureElement;
};
deletePopupFeatures(popupFeatures);

var getFeatures = function (item) {
  return '<li class="feature feature--' + item + '"></li>';
};

// создаём DOM-элемент объявление, заполняя его данными из объекта objectOfAds
var renderArticle = function (ads) { // функция создания DOM-элемента на основе JS-объекта
  articleElement.querySelector('.popup__avatar').src = ads.author.avatar; // Замяем аватарку пользователя
  articleElement.querySelector('h3').textContent = ads.offer.title;
  articleElement.querySelector('small').textContent = ads.offer.address;
  articleElement.querySelector('.popup__price').innerHTML = ads.offer.price + '&#x20bd;/ночь';
  articleElement.querySelector('h4').textContent = ads.offer.type;
  articleElement.querySelector('p:nth-of-type(3)').textContent = ads.offer.rooms + ' комнат для ' + ads.offer.guests + ' гостей';
  articleElement.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + ads.offer.checkin + ', выезд до ' + ads.offer.checkout;
  articleElement.querySelector('.popup__features').insertAdjacentHTML('afterbegin', ads.offer.features.map(getFeatures).join(' '));
  articleElement.querySelector('ul + p').textContent = ads.offer.description;
  // Квартира для flat, Бунгало для bungalo, Дом для house
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

/* // вставляем 1-й полученный DOM-элемент в блок map перед блоком map__filters-container
var mapFiltersContainer = map.querySelector('.map__filters-container');- устарело
map.insertBefore(renderArticle(arrayOfAds[0]), mapFiltersContainer); - устарело */

// ============ Обработка событий ============ //

/* // Закрыть попап объявления по умолчанию
var closePopup = function () {
  articleElement.classList.add('hidden');
};
var openPopup = function () {
  articleElement.classList.remove('hidden');
};*/

// функция делает недоступными все поля форм по умолчанию
var getDisabledMapAndForms = function () {
  map.classList.add('map--faded');
  for (var j = 0; j < formFieldset.length; j++) {
    formFieldset[j].setAttribute('disabled', 'disabled');
  }
};
getDisabledMapAndForms();

// событие активирует карту и форму
var getActivateMapAndForms = function () {
  mapPins.appendChild(fragment); // добавленте маркеров на карту, хранящихся в fragment
  map.classList.remove('map--faded');
  noticeForm.classList.remove('notice__form--disabled');
  for (var j = 0; j < formFieldset.length; j++) {
    formFieldset[j].removeAttribute('disabled', 'disabled');
  }
};

var mapPinMain = map.querySelector('.map__pin--main');
// обработчик события на блоке при отпускании кнопки мыши активирует поля и карту
mapPinMain.addEventListener('mouseup', getActivateMapAndForms);

// обработчик события на блоке при нажатии ENTER
mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    getActivateMapAndForms();
  }
});

// обработчик события закрытия попапа и убирает активный класса при ESC
document.addEventListener('keydown', onPopupEscPress);

// ============ Валидациия формы ============ //

var checkIn = noticeForm.querySelector('#timein');
var checkOut = noticeForm.querySelector('#timeout');

// если поля заполнены неверно, то выделяются неверные поля красной рамкой
var getBorderColor = function (elem) {
  elem.style.borderWidth = '2px';
  elem.style.borderColor = 'green';
};
// getBorderColor(noticeForm);


// Событие изменения времени выезда
checkIn.addEventListener('change', function () {
  checkOut.selectedIndex = checkIn.selectedIndex; // изменяется порядковый номер выбранного элемента
});

// Событие изменения времени въезда
checkOut.addEventListener('change', function () {
  checkIn.selectedIndex = checkOut.selectedIndex;
});
