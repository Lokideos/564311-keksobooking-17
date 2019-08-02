'use strict';

(function () {
  // Initialize
  var ESC_KEYCODE = 27;
  var initialFormState = {};
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
  var avatar = adForm.querySelector('.ad-form-header__preview img');
  var title = adForm.querySelector('input[name="title"]');
  var address = adForm.querySelector('input[name="address"]');
  var description = adForm.querySelector('textarea[name="description"]');
  var features = adForm.querySelectorAll('input[name=features]');
  var main = document.querySelector('main');
  var resetButton = adForm.querySelector('.ad-form__reset');

  // Selectors
  var successMessageTemplateSelector = '#success';
  var successMessageFragmentSelector = '.success';

  // Initial data
  var PRICE_BY_TYPE = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };
  var SELECTORS_TO_TOGGLE = ['select', 'fieldset'];
  var MAIN_PIN_INITIAL_STYLE = 'left: 570px; top: 375px';
  var TOP_MAIN_PIN_COORDINATES = mainPin.offsetTop + Math.floor(mainPin.offsetHeight / 2);
  var LEFT_MAIN_PIN_COORDINATES = mainPin.offsetLeft + Math.floor(mainPin.offsetWidth / 2);
  var MAIN_PIN_LENGTH = 22;

  // Class names
  var FADING_MAP_FORM_CLASS = 'map--faded';
  var FADING_AD_FORM_CLASS = 'ad-form--disabled';

  // Support
  var getTemplateFragment = function (templateId, templateFragment) {
    return document.querySelector(templateId)
      .content
      .querySelector(templateFragment);
  };

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

  var captureInitialState = function () {
    initialFormState = {
      avatarLink: avatar.src,
      titleText: title.value,
      addressText: calculateInitialMainPinCoordinates(),
      houseTypeIndex: appartmentType.selectedIndex,
      priceText: minPrice.value,
      pricePlaceholder: minPrice.placeholder,
      roomsIndex: roomNumbers.selectedIndex,
      capacityIndex: capacity.selectedIndex,
      timeInIndex: timeIn.selectedIndex,
      timeOutIndex: timeOut.selectedIndex,
      descriptionText: description.value
    };
  };

  var resetAdForm = function () {
    avatar.src = initialFormState.avatarLink;
    title.value = initialFormState.titleText;
    description.value = initialFormState.descriptionText;
    address.value = initialFormState.addressText;
    minPrice.value = initialFormState.priceText;
    minPrice.placeholder = initialFormState.pricePlaceholder;
    appartmentType.selectedIndex = initialFormState.houseTypeIndex;
    timeIn.selectedIndex = initialFormState.timeInIndex;
    timeOut.selectedIndex = initialFormState.timeOutIndex;
    roomNumbers.selectedIndex = initialFormState.roomsIndex;
    capacity.selectedIndex = initialFormState.capacityIndex;
    features.forEach(function (feature) {
      feature.checked = false;
    });
    mainPin.style = MAIN_PIN_INITIAL_STYLE;
  };

  // DOM manipulation
  var renderSuccessMessage = function () {
    var fragment = document.createDocumentFragment();
    var successMessage = getTemplateFragment(successMessageTemplateSelector, successMessageFragmentSelector).cloneNode(true);
    fragment.appendChild(successMessage);

    main.appendChild(fragment);
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', onKeyPressed);
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
    toggleMapFadeEffect(map);
    toggleAdFormFadeEffect(adForm);
    window.xhr.load(window.dataLoad.onSuccessHandler, window.xhr.onErrorHandler);

    mainPin.removeEventListener('mousedown', onMainPinMousedown);
  };

  var onDocumentClick = function () {
    main.querySelector('.success').remove();
    document.removeEventListener('click', onDocumentClick);
    document.removeEventListener('keydown', onKeyPressed);
  };

  var onKeyPressed = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      main.querySelector('.success').remove();
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', onKeyPressed);
    }
  };

  var onSuccessHandler = function () {
    resetAdForm();
    renderSuccessMessage();
  };

  var onAdFormSubmit = function (evt) {
    evt.preventDefault();
    window.xhr.save(new FormData(adForm), onSuccessHandler, window.xhr.onErrorHandler);
  };

  var addDisableEffects = function () {
    toggleMapFadeEffect(map);
    toggleAdFormFadeEffect(adForm);
  };

  var onResetButtonClick = function (evt) {
    evt.preventDefault();
    resetAdForm();
    disableForms([mapFiltersForm, adForm]);
    addDisableEffects();
    mainPin.addEventListener('mousedown', onMainPinMousedown);
  };

  // DOM manipulation
  var toggleMapFadeEffect = function (selectedElement) {
    selectedElement.classList.toggle(FADING_MAP_FORM_CLASS);
  };

  var toggleAdFormFadeEffect = function (selectedForm) {
    selectedForm.classList.toggle(FADING_AD_FORM_CLASS);
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
  captureInitialState(initialFormState);
  validateCapacityPerRoomCount(roomNumbers[roomNumbers.selectedIndex], capacity[capacity.selectedIndex]);

  var applyEventHandlers = function () {
    mainPin.addEventListener('mouseup', onMainPinMouseup);
    appartmentType.addEventListener('change', onAppartmentTypeChange);
    timeIn.addEventListener('change', onTimeInChange);
    timeOut.addEventListener('change', onTimeOutChange);
    roomNumbers.addEventListener('change', onRoomsOrCapacityChange);
    capacity.addEventListener('change', onRoomsOrCapacityChange);
    mainPin.addEventListener('mousedown', onMainPinMousedown);
    adForm.addEventListener('submit', onAdFormSubmit);
    resetButton.addEventListener('click', onResetButtonClick);
  };

  applyEventHandlers();
})();
