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

      mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
      mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';

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
