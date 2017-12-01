'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['flat', 'house', 'bungalo'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
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

// функция рандома
var getRandomNumber = function (min, max) {
  var randomNumber = Math.floor(Math.random() * (max - min)) + min;
  return randomNumber;
};

// создаю массив, состоящий из 8 сгенерированных JS объектов, которые будут описывать похожие объявления
var generateCards = function () {
  for (var i = 0; i < pinsAmount; i++) { /* ? */
    var locationX = getRandomNumber(locationXY.minX, locationXY.maxX);
    var locationY = getRandomNumber(locationXY.minY, locationXY.maxY);

    cards[i] = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: TITLES[getRandomNumber(0, 8)],
        address: locationX + ', ' + locationY,
        price: getRandomNumber(1000, 1000000),
        type: getAppartmentTypes(), /* ? */
        rooms: getRandomNumber(1, 6),
        guests: getRandomNumber(1, 10),
        checkin: CHECKIN[getRandomNumber(0, 3)],
        checkout: CHECKIN[getRandomNumber(0, 3)],
        features: FEATURES,
        description: '',
        photos: []
      },
      'location': {
        'x': locationX,
        'y': locationY
      }
    };
  }
  return cards;
};

var map = document.querySelector('.map');
map.classList.remove('map--faded'); //  показываем окно настроек пользователя

var mapPins = map.querySelector('.map__pins'); // находим элемент/карту в которую отрисовываем сгенерированные DOM-элементы
var MapPinTemplate = document.querySelector('template').content.querySelector('.map__pin'); // Находим шаблон-кнопки в template, который будем копировать
var MapCardTemplate = document.querySelector('template').content.querySelector('.map__card'); // Находим шаблон-описания в template, которы будем копировать
var mapPinImage = document.querySelector('template').querySelector('img'); // Находим img в шаблоне-кнопке в template

// Создает DOM элемент button на основе шаблона и данных объявления
var renderPin = function (ad) {
  var pinElement = mapPinTemplate.cloneNode(true);
  pinElement.style.left = (ad.location.x - (mapPinImage.getAttribute('width') / 2)) + 'px'; // учитывает ширину картинки, смещается влево на пол-ширину
  pinElement.style.top = (+mapPinImage.getAttribute('height') + ad.location.y + 22) + 'px'; // учитывает высоту метки с острым концом =22px и высоту картинки
  pinElement.querySelector('img').src = ad.author.avatar;
  return pinElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < wizards.length; i++) {
  fragment.appendChild(renderWizard(wizards[i])); /* ? */
}
mapPins.appendChild(fragment); // вставляем склонированного шаблон в нужное поле


/*
var wizards = [ // Массив магов с именами и цветами
  {
    name: getRandom(WIZARD_NAMES) + ' ' + getRandom(WIZARD_SURNAMES),
    coatColor: getRandom(WIZARD_COAT_COLOR),
    eyesColor: getRandom(WIZARD_EYES_COLOR)
  }
];

var renderMapPin = function (wizard) { // Отрисуем шаблон-мага - функция создания DOM-элемента на основе JS-объекта
  var wizardElement = similarWizardTemplate.cloneNode(true); // клонируем содержимое шаблон-мага

  wizardElement.querySelector('.setup-similar-label').textContent = wizard.name; // добавляем имя в шаблон-мага
  wizardElement.querySelector('.wizard-coat').style.fill = wizard.coatColor; // добавляем цвет плаща в шаблон-мага
  return wizardElement;
};

document.querySelector('.setup-similar').classList.remove('hidden'); // показываем блок с похожими персонажами
*/
