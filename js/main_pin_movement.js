'use strict';

(function () {
  // Initialize
  // Selected DOM Element
  var mainPin = document.querySelector('.map__pin--main');

  // Initial Data
  var MAIN_PIN_LENGTH = 22;
  var MAP_PIN_MAX_Y = 630;
  var MAP_PIN_MIN_Y = 130;
  var MAP_PIN_MAX_X = 1120;
  var MAP_PIN_MIN_X = 10;
  var SAFE_VERTICAL_GAP = 15;
  var POINTER_MAX_Y = 400;
  var POINTER_MIN_Y = 100;
  var POINTER_MAX_X = 1420;
  var POINTER_MIN_X = 250;

  var setMainPinLimitations = function () {
    if (mainPin.offsetTop > MAP_PIN_MAX_Y) {
      mainPin.style.top = MAP_PIN_MAX_Y - MAIN_PIN_LENGTH + 'px';
    }

    if (mainPin.offsetTop < MAP_PIN_MIN_Y) {
      mainPin.style.top = MAP_PIN_MIN_Y - MAIN_PIN_LENGTH + SAFE_VERTICAL_GAP + 'px';
    }

    if (mainPin.offsetLeft > MAP_PIN_MAX_X) {
      mainPin.style.left = MAP_PIN_MAX_X + 'px';
    }

    if (mainPin.offsetLeft < MAP_PIN_MIN_X) {
      mainPin.style.left = MAP_PIN_MIN_X + 'px';
    }
  };


  // Event Handlers Functions
  var onMainPinMousedown = function (evt) {
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      if (moveEvt.clientY < POINTER_MAX_Y && moveEvt.clientY > POINTER_MIN_Y) {
        mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      }

      if (moveEvt.clientX < POINTER_MAX_X && moveEvt.clientX > POINTER_MIN_X) {
        mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
      }

      setMainPinLimitations();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // Runtime
  var applyEventHandlers = function () {
    mainPin.addEventListener('mousedown', onMainPinMousedown);
  };

  applyEventHandlers();
})();
