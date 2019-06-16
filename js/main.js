'use strict';

// Initialize
// Selected DOM Elements
var adForm = document.querySelector('.ad-form');
var mapFiltersForm = document.querySelector('.map__filters');
var mainPin = document.querySelector('.map__pin--main');
var map = document.querySelector('.map');
var FORMS = [adForm, mapFiltersForm];

// Selectors
var overlaySelector = '.map__overlay';
var pinTemplateSelector = '#pin';
var pinFragmentSelector = '.map__pin';
var pinsPlacementSelector = '.map__pins';

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

var turnOnForms = function () {
  enableForms(FORMS);
  disableMapFade(map);
  activateAdForm(adForm);
};

// Support
var pickRandomIndex = function (length) {
  return Math.floor(Math.random() * length);
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

var disableFormElements = function (form, elements) {
  elements.forEach(function (element) {
    form.querySelectorAll(element).forEach(function (chosenElement) {
      chosenElement.disabled = true;
    });
  });
};

var enableFormElements = function (form, elements) {
  elements.forEach(function (element) {
    form.querySelectorAll(element).forEach(function (chosenElement) {
      chosenElement.disabled = false;
    });
  });
};

var disableForms = function (forms) {
  forms.forEach(function (form) {
    disableFormElements(form, ['select', 'fieldset']);
  });
};

var enableForms = function (forms) {
  forms.forEach(function (form) {
    enableFormElements(form, ['select', 'fieldset']);
  });
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
  var fragment = document.createDocumentFragment();
  renderPins(pinsPlacementSelector, mockPins, fragment);
};

var applyEventHandlers = function () {
  mainPin.addEventListener('click', turnOnForms);
};

fillApplictationWithMocData();
applyEventHandlers();
