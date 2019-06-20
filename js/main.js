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
var TOP_MAIN_PIN_COORDINATES = mainPin.offsetTop + Math.floor(mainPin.offsetHeight / 2);
var LEFT_MAIN_PIN_COORDINATES = mainPin.offsetLeft + Math.floor(mainPin.offsetWidth / 2);
var PRICE_BY_TYPE = {
  'bungalo': '0',
  'flat': '1000',
  'house': '5000',
  'palace': '10000'
};

// Selectors
var overlaySelector = '.map__overlay';
var pinTemplateSelector = '#pin';
var pinFragmentSelector = '.map__pin';
var pinsPlacementSelector = '.map__pins';
var SELECTORS_TO_TOGGLE = ['select', 'fieldset'];

// Class names
var FADING_MAP_FORM_CLASS = 'map--faded';
var FADING_AD_FORM_CLASS = 'ad-form--disabled';

// Mock data
var AVATAR_LINK_TEMPLATE = 'img/avatars/user0';
var AVATAR_EXTENSION = '.png';
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_Y = 130;
var MAX_Y = 630;

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
var pickRandomIndex = function (length) {
  return Math.floor(Math.random() * length);
};

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
var getOverlayWidth = function (overlay) {
  return document.querySelector(overlay).offsetWidth;
};

var getTemplateFragment = function (templateId, templateFragment) {
  return document.querySelector(templateId)
    .content
    .querySelector(templateFragment);
};

var disableMapFade = function (fadedMap) {
  fadedMap.classList.remove(FADING_MAP_FORM_CLASS);
};

var activateAdForm = function (fadedForm) {
  fadedForm.classList.remove(FADING_AD_FORM_CLASS);
};

var renderPins = function (pinsPlacement, pinsData, fragment) {
  var canvas = document.querySelector(pinsPlacement);
  pinsData.forEach(function (pin) {
    fragment.appendChild(pin);
  });

  canvas.appendChild(fragment);
};

var adjustXLocation = function (xCoordinate) {
  return xCoordinate + document.querySelector('.map__pin').offsetWidth / 2;
};

var adjustYLocation = function (yCoordinate) {
  return yCoordinate + document.querySelector('.map__pin').offsetHeight;
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

// Generators
// Mock helpers
var generateX = function () {
  var xCoordinate = Math.floor(Math.random() * getOverlayWidth(overlaySelector));

  if (xCoordinate > 1100) {
    return 1100;
  }

  if (xCoordinate < 100) {
    return 100;
  }

  return xCoordinate;
};

var generateY = function (min, max) {
  var yCoordinate = Math.floor(Math.random() * (max - min) + min);

  if (yCoordinate > 550) {
    return 550;
  }

  return yCoordinate;
};

var generateAvatarId = function (maxId) {
  return Math.floor(Math.random() * maxId + 1);
};

var generateAvatarLink = function () {
  return AVATAR_LINK_TEMPLATE + generateAvatarId(8) + AVATAR_EXTENSION;
};

var generateOfferType = function () {
  return OFFER_TYPES[pickRandomIndex(OFFER_TYPES.length)];
};

var generateLocation = function () {
  return {
    'x': generateX(),
    'y': generateY(MIN_Y, MAX_Y)
  };
};


// Actual data generation
var generateAd = function () {
  return {
    'author': {
      'avatar': generateAvatarLink()
    },
    'offer': {
      'type': generateOfferType()
    },
    'location': generateLocation()
  };
};

var generateAdsArray = function (length) {
  var ads = [];
  for (var i = 0; i < length; i++) {
    ads.push(generateAd());
  }

  return ads;
};

var generatePin = function (ad) {
  var pin = getTemplateFragment(pinTemplateSelector, pinFragmentSelector).cloneNode(true);
  pin.style = 'left: ' + adjustXLocation(ad.location.x) + 'px; top: ' + adjustYLocation(ad.location.y) + 'px;';
  var pinImage = pin.querySelector('img');
  pinImage.src = ad.author.avatar;
  pinImage.alt = ad.offer.type;

  return pin;
};

var generatePinsArray = function (ads) {
  return ads.map(function (ad) {
    return generatePin(ad);
  });
};

// Runtime
var fillApplictationWithMocData = function () {
  var mockAds = generateAdsArray(8);
  var mockPins = generatePinsArray(mockAds);
  disableForms([mapFiltersForm, adForm]);
  fillAddressElement(adForm, 'input[name="address"]', calculateInitialMainPinCoordinates());
  var fragment = document.createDocumentFragment();
  renderPins(pinsPlacementSelector, mockPins, fragment);
};

var applyEventHandlers = function () {
  mainPin.addEventListener('mousedown', onMainPinMousedown);
  mainPin.addEventListener('mouseup', onMainPinMouseup);
  appartmentType.addEventListener('change', onAppartmentTypeChange);
  timeIn.addEventListener('change', onTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);
};

fillApplictationWithMocData();
applyEventHandlers();
