'use strict';
// модуль, который работает с формой объявления
(function () {
  var noticeForm = document.querySelector('.notice__form');
  var checkIn = noticeForm.querySelector('#timein');
  var checkOut = noticeForm.querySelector('#timeout');
  var priceForNight = noticeForm.querySelector('#price');
  var typeOfAccommodation = noticeForm.querySelector('#type');
  // мин цена для типов жилья
  var minPriceForTypes = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var roomNumber = noticeForm.querySelector('#room_number');
  var capacity = noticeForm.querySelector('#capacity');
  var сapacityOfRooms = {
    '1': ['1'],
    '2': ['2', '1'],
    '3': ['3', '2', '1'],
    '100': ['0']
  };

  // если поля заполнены неверно, то выделяются неверные поля красной рамкой
  var getBorderColor = function (elem) {
    elem.style.borderWidth = '2px';
    elem.style.borderColor = '#fa9';
  };

  // рамки в обычном состоянии
  var resetBorderColor = function (elem) {
    elem.style.borderWidth = '';
    elem.style.borderColor = '';
  };

  // Событие изменения времени выезда
  checkIn.addEventListener('change', function () {
    checkOut.selectedIndex = checkIn.selectedIndex; // изменяется порядковый номер выбранного элемента
  });

  // Событие изменения времени въезда
  checkOut.addEventListener('change', function () {
    checkIn.selectedIndex = checkOut.selectedIndex;
  });

  // обработчик cобытия изменения мин цены для типов жилья
  typeOfAccommodation.addEventListener('change', function () {
    for (var key in minPriceForTypes) {
      if (key === typeOfAccommodation.value) {
        priceForNight.min = minPriceForTypes[key];
      }
    }
  });

  // обработчиками валидации введенной суммы
  priceForNight.addEventListener('invalid', function () {
    getBorderColor(priceForNight);
    if (priceForNight.validity.rangeUnderflow) {
      priceForNight.setCustomValidity('Цена жилья ниже рекомендованной');
    } else if (priceForNight.validity.rangeOverflow) {
      priceForNight.setCustomValidity('Цена жилья слишком высока');
    } else if (priceForNight.validity.valueMissing) {
      priceForNight.setCustomValidity('Обязательное поле');
    } else {
      priceForNight.setCustomValidity('');
      resetBorderColor(priceForNight);
    }
  });

  // обратобчик события соответствия кол-ва комнат и мест
  roomNumber.addEventListener('change', function () {
    if (capacity.options.length > 0) {
      [].forEach.call(capacity.options, function (item) {
        if (сapacityOfRooms[roomNumber.value][0] === item.value) { // пример: сapacityOfRooms[2][0] = '3', - третему и второму и первому дочерн эл-тов capacity.options
          item.selected = true;
        } else {
          item.selected = false; // остальные не выбраны
        }
        if (сapacityOfRooms[roomNumber.value].indexOf(item.value) >= 0) { // пример: сapacityOfRooms[2].indexOf(все значения option перебираются)
          item.hidden = false;
        } else {
          item.hidden = true; // если какого значения option нет в значении ключа сapacityOfRooms - оно скрывается
        }
      });
    }
  });
})();
