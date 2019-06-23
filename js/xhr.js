'use strict';

(function () {
  var GET_PINS_RESOURCE = 'https://js.dump.academy/keksobooking/data';

  window.xhr = {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.open('GET', GET_PINS_RESOURCE);

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            return onLoad(xhr.response);
          default:
            return onError();
        }
      });

      xhr.send();
    }
  };
})();
