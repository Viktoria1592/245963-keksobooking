'use strict';

// модуль функции обратного вызова изменения значения зависимого поля
(function () {
  window.synchronizeFields = function (firstElement, secondElement, valueOfFirstElement, valueOfSecondElement, callback) {
    var indexElement = valueOfSecondElement.indexOf(secondElement.value); // находим индекс эл-та во втором массиве
    callback(firstElement, valueOfFirstElement[indexElement]); // находим элемент с той же позицией в первом массиве
  };
})();
