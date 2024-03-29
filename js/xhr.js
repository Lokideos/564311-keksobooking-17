'use strict';

(function () {
  // Initialize
  var ESC_KEYCODE = 27;
  var GET_PINS_RESOURCE = 'https://js.dump.academy/keksobooking/data';
  var DATA_UPLOAD_RESOURCE = 'https://js.dump.academy/keksobooking';
  var errorTemplateSelector = '#error';
  var errorFragmentSelector = '.error';

  // Selected DOM elements
  var main = document.querySelector('main');
  // Support
  var getTemplateFragment = function (templateId, templateFragment) {
    return document.querySelector(templateId)
      .content
      .querySelector(templateFragment);
  };

  // Event handlers functions
  var onErrorButtonClick = function () {
    main.querySelector('.error').remove();
    document.removeEventListener('keydown', onEscKeyPressed);
  };

  var onEscKeyPressed = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      main.querySelector('.error').remove();
      document.removeEventListener('keydown', onEscKeyPressed);
      document.removeEventListener('click', onDocumentClick);
    }
  };

  var onDocumentClick = function () {
    if (main.querySelector('.error')) {
      main.querySelector('.error').remove();
      document.removeEventListener('keydown', onEscKeyPressed);
      document.removeEventListener('click', onDocumentClick);
    }
  };

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
    },
    save: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.open('POST', DATA_UPLOAD_RESOURCE);

      xhr.addEventListener('load', function () {
        switch (xhr.status) {
          case 200:
            return onLoad(xhr.response);
          default:
            return onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.send(data);
    },
    onErrorHandler: function () {
      var error = getTemplateFragment(errorTemplateSelector, errorFragmentSelector).cloneNode(true);
      var fragment = document.createDocumentFragment();
      main.appendChild(fragment.appendChild(error));

      main.querySelector('.error .error__button').addEventListener('click', onErrorButtonClick);
      document.addEventListener('keydown', onEscKeyPressed);
      document.addEventListener('click', onDocumentClick);
    }
  };
})();
