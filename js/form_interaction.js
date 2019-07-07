'use strict';

(function () {
  // Initialize
  var CAPACITY_FOR_ROOM_MATCHER = {
    '1 комната': ['для 1 гостя'],
    '2 комнаты': ['для 2 гостей', 'для 1 гостя'],
    '3 комнаты': ['для 3 гостей', 'для 2 гостей', 'для 1 гостя'],
    '100 комнат': ['не для гостей']
  };

  var CAPACITY_FOR_ROOM_ERROR_MESSAGE = 'Выбраное количество гостей не соответствует количеству комнат. ' +
  'Пожалуйста, выберите подходящее количество гостей:' +
  '1 комната - 1 гость, 2 комнаты - 1 или 2 гостя, 3 комнаты - 1, 2 или 3 гостя, 100 комнат - не для гостей';

  // Selected DOM elements
  var adForm = document.querySelector('.ad-form');
  var mapFiltersForm = document.querySelector('.map__filters');
  var appartmentType = adForm.querySelector('select[name="type"]');
  var timeIn = adForm.querySelector('select[name="timein"]');
  var timeOut = adForm.querySelector('select[name="timeout"]');
  var minPrice = adForm.querySelector('input[name="price"]');
  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');
  var FORMS = [adForm, mapFiltersForm];
  var roomNumbers = adForm.querySelector('select[name="rooms"');
  var capacity = adForm.querySelector('select[name="capacity"');

  // Initial data
  var PRICE_BY_TYPE = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };
  var SELECTORS_TO_TOGGLE = ['select', 'fieldset'];
  var TOP_MAIN_PIN_COORDINATES = mainPin.offsetTop + Math.floor(mainPin.offsetHeight / 2);
  var LEFT_MAIN_PIN_COORDINATES = mainPin.offsetLeft + Math.floor(mainPin.offsetWidth / 2);
  var MAIN_PIN_LENGTH = 22;

  // Class names
  var FADING_MAP_FORM_CLASS = 'map--faded';
  var FADING_AD_FORM_CLASS = 'ad-form--disabled';

  // Support
  var calculateInitialMainPinCoordinates = function () {
    return LEFT_MAIN_PIN_COORDINATES + ', ' + TOP_MAIN_PIN_COORDINATES;
  };

  var validateCapacityPerRoomCount = function (selectedRoomNumbers, selectedCapacity) {
    if (!CAPACITY_FOR_ROOM_MATCHER[selectedRoomNumbers.innerText].includes(selectedCapacity.innerText)) {
      capacity.setCustomValidity(CAPACITY_FOR_ROOM_ERROR_MESSAGE);
    } else {
      capacity.setCustomValidity('');
    }
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

  // Event handler functions
  var onAppartmentTypeChange = function () {
    changeMinPrice();
  };

  var onTimeInChange = function () {
    changeTimeOutTime();
  };

  var onTimeOutChange = function () {
    changeTimInTime();
  };

  var onRoomsOrCapacityChange = function () {
    var selectedCapacity = capacity[capacity.selectedIndex];
    var selectedRoomNumbers = roomNumbers[roomNumbers.selectedIndex];

    validateCapacityPerRoomCount(selectedRoomNumbers, selectedCapacity);
  };

  var onMainPinMouseup = function () {
    fillAddressElement(adForm, 'input[name="address"]', calculateMainPinCoordinates());
  };

  var onMainPinMousedown = function () {
    enableForms(FORMS);
    disableMapFade(map);
    activateAdForm(adForm);

    mainPin.removeEventListener('mousedown', onMainPinMousedown);
  };

  // DOM manipulation
  var disableMapFade = function (fadedMap) {
    fadedMap.classList.remove(FADING_MAP_FORM_CLASS);
  };

  var activateAdForm = function (fadedForm) {
    fadedForm.classList.remove(FADING_AD_FORM_CLASS);
  };

  var enableForms = function (forms) {
    forms.forEach(function (form) {
      toggleFormSelectors(form, false);
    });
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

  var fillAddressElement = function (form, element, value) {
    form.querySelector(element).value = value;
  };

  // Runtime
  disableForms([mapFiltersForm, adForm]);
  fillAddressElement(adForm, 'input[name="address"]', calculateInitialMainPinCoordinates());
  validateCapacityPerRoomCount(roomNumbers[roomNumbers.selectedIndex], capacity[capacity.selectedIndex]);

  var applyEventHandlers = function () {
    mainPin.addEventListener('mouseup', onMainPinMouseup);
    appartmentType.addEventListener('change', onAppartmentTypeChange);
    timeIn.addEventListener('change', onTimeInChange);
    timeOut.addEventListener('change', onTimeOutChange);
    roomNumbers.addEventListener('change', onRoomsOrCapacityChange);
    capacity.addEventListener('change', onRoomsOrCapacityChange);
    mainPin.addEventListener('mousedown', onMainPinMousedown);
  };

  applyEventHandlers();
})();
