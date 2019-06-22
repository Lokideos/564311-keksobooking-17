'use strict';

// Initialize
// Selected DOM Elements
var adForm = document.querySelector('.ad-form');
var mapFiltersForm = document.querySelector('.map__filters');
var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var appartmentType = adForm.querySelector('select[name="type"]');
var minPrice = adForm.querySelector('input[name="price"]');
var timeIn = adForm.querySelector('select[name="timein"');
var timeOut = adForm.querySelector('select[name="timeout"');
var FORMS = [adForm, mapFiltersForm];

// Initial Data
var MAIN_PIN_LENGTH = 22;
var MAP_PIN_MAX_Y = 630;
var MAP_PIN_MIN_Y = 130;
var MAP_PIN_MAX_X = 1120;
var MAP_PIN_MIN_X = 10;
var SAFE_VERTICAL_GAP = 15;
var TOP_MAIN_PIN_COORDINATES = mainPin.offsetTop + Math.floor(mainPin.offsetHeight / 2);
var LEFT_MAIN_PIN_COORDINATES = mainPin.offsetLeft + Math.floor(mainPin.offsetWidth / 2);
var PRICE_BY_TYPE = {
  'bungalo': '0',
  'flat': '1000',
  'house': '5000',
  'palace': '10000'
};

var SELECTORS_TO_TOGGLE = ['select', 'fieldset'];

// Class names
var FADING_MAP_FORM_CLASS = 'map--faded';
var FADING_AD_FORM_CLASS = 'ad-form--disabled';

// Event Handlers Functions
var onMainPinMousedown = function (evt) {
  enableForms(FORMS);
  disableMapFade(map);
  activateAdForm(adForm);

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

var onMainPinMouseup = function () {
  fillAddressElement(adForm, 'input[name="address"]', calculateMainPinCoordinates());
};

var onAppartmentTypeChange = function () {
  changeMinPrice();
};

var onTimeInChange = function () {
  changeTimeOutTime();
};

var onTimeOutChange = function () {
  changeTimInTime();
};

// Support
var calculateInitialMainPinCoordinates = function () {
  return LEFT_MAIN_PIN_COORDINATES + ', ' + TOP_MAIN_PIN_COORDINATES;
};

var calculateMainPinCoordinates = function () {
  return getXCoordinates(mainPin) + ', ' + getYCoordinates(mainPin);
};

var getXCoordinates = function (pin) {
  return pin.offsetLeft + Math.floor(pin.offsetWidth / 2);
};

var getYCoordinates = function (pin) {
  return pin.offsetTop + pin.offsetHeight + MAIN_PIN_LENGTH;
};

// DOM manipulation
var disableMapFade = function (fadedMap) {
  fadedMap.classList.remove(FADING_MAP_FORM_CLASS);
};

var activateAdForm = function (fadedForm) {
  fadedForm.classList.remove(FADING_AD_FORM_CLASS);
};

var toggleFormSelectors = function (form, toggleValue) {
  SELECTORS_TO_TOGGLE.forEach(function (selector) {
    form.querySelectorAll(selector).forEach(function (chosenSelector) {
      chosenSelector.disabled = toggleValue;
    });
  });
};

var disableForms = function (forms) {
  forms.forEach(function (form) {
    toggleFormSelectors(form, true);
  });
};

var enableForms = function (forms) {
  forms.forEach(function (form) {
    toggleFormSelectors(form, false);
  });
};

var fillAddressElement = function (form, element, value) {
  form.querySelector(element).value = value;
};

var changeMinPrice = function () {
  var type = appartmentType.options[appartmentType.selectedIndex].value;
  minPrice.placeholder = PRICE_BY_TYPE[type];
  minPrice.min = PRICE_BY_TYPE[type];
};

var changeTimeOutTime = function () {
  timeOut.selectedIndex = timeIn.selectedIndex;
};

var changeTimInTime = function () {
  timeIn.selectedIndex = timeOut.selectedIndex;
};

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

// Generators
// Mock helpers




// Runtime


disableForms([mapFiltersForm, adForm]);
fillAddressElement(adForm, 'input[name="address"]', calculateInitialMainPinCoordinates());

var applyEventHandlers = function () {
  mainPin.addEventListener('mousedown', onMainPinMousedown);
  mainPin.addEventListener('mouseup', onMainPinMouseup);
  appartmentType.addEventListener('change', onAppartmentTypeChange);
  timeIn.addEventListener('change', onTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);
};

applyEventHandlers();
