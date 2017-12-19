'use strict';

// модуль функций для работаты с сервером данных
(function () {
  var SERVER_URL = 'https://1510.dump.academy/keksobooking/data';

  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () { // обработчик для успешного запроса
      if (xhr.status === 200) {
        onLoad(xhr.response); // функция обратного вызова, которая срабатывает при успешном выполнении запроса
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
    }
  };
})();
