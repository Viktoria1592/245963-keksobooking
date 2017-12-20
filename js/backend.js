'use strict';

// модуль функций для работаты с сервером данных
(function () {

  // Функция загрузки данных при успешном результате
  var successHandler = function (adsData) { // в параметре данные из сервера
    window.data.set(adsData);
  };

  // Функция вывода ошибки при отправке
  var errorHandler = function (errorMessage) {
    var nodeDiv = document.createElement('div');
    nodeDiv.style = 'z-index: 100; width: 100px; height: 100px; margin: 0 auto; padding: 15px; text-align: center; border-radius: 50%; background-color: yellow;';
    nodeDiv.style.position = 'absolute';
    nodeDiv.style.border = '2px solid red';
    nodeDiv.style.top = '20%';
    nodeDiv.style.left = 0;
    nodeDiv.style.right = 0;
    nodeDiv.style.fontSize = '24px';
    nodeDiv.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', nodeDiv);
  };

  var SERVER_URL = 'https://1510.dump.academy/keksobooking';

  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () { // обработчик для успешного запроса
      if (xhr.status === 200) {
        onLoad(xhr.response); // функция обратного вызова, которая срабатывает при успешном выполнении запроса, response - Ответ сервера
      } else {
        onError(xhr.response); // функция обратного вызова, которая срабатывает при неуспешном выполнении запроса
      }
    });
    xhr.addEventListener('error', function () { // обработчик для ошибки при запросе
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () { // обработчик для истечения заданного времени
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = 10000; // 10s
    return xhr;
  };

  // функции для глобальной области видимости
  window.backend = {
    save: function (data, onLoad, onError) { // метод для отправки данных форм на сервер
      var xhr = setup(onLoad, onError);
      xhr.open('POST', SERVER_URL);
      xhr.send(data); // объект FormData, содержит данные формы
    },

    load: function (onLoad, onError) { // метод для загрузки данных
      var xhr = setup(onLoad, onError);
      xhr.open('GET', SERVER_URL + '/data');
      xhr.send();
    },

    successHandler: successHandler,
    errorHandler: errorHandler
  };
})();
