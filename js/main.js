'use strict';

var AVATAR_LINK_TEMPLATE = 'img/avatars/user0';
var AVATAR_EXTENSION = '.png';
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_Y = 130;
var MAX_Y = 630;
var overlaySelector = '.map__overlay';
var mapSelector = '.map';
var fadingClassName = 'map--faded';
var pinTemplateSelector = '#pin';
var pinFragmentSelector = '.map__pin';
var pinsPlacementSelector = '.map__pins';


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

var showMap = function (selector, hidingClass) {
  document.querySelector(selector).classList.remove(hidingClass);
};

var renderPins = function (pinsPlacement, pinsData, fragment) {
  var canvas = document.querySelector(pinsPlacement);
  pinsData.forEach(function (pin) {
    fragment.appendChild(pin);
  });

  canvas.appendChild(fragment);
};

// Generators
// Mock helpers
var generateX = function () {
  var x = Math.floor(Math.random() * getOverlayWidth(overlaySelector));

  if (x > 1100) {
    return 1100;
  }

  if (x < 100) {
    return 100;
  }

  // return Math.floor(Math.random() * getOverlayWidth(overlaySelector));
  return x;
};

var generateY = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
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
  pin.style = 'left: ' + ad.location.x + 'px; top: ' + ad.location.y + 'px;';
  var pinImage = pin.querySelector('img');
  pinImage.src = ad.author.avatar;
  pinImage.alt = ad.offer.type;

  return pin;
};

var generatePinsArray = function (ads) {
  var pins = [];
  ads.forEach(function (ad) {
    pins.push(generatePin(ad));
  });

  return pins;
};

// Runtime
var fillApplictationWithMocData = function () {
  var mockAds = generateAdsArray(8);
  var mockPins = generatePinsArray(mockAds);
  showMap(mapSelector, fadingClassName);
  var fragment = document.createDocumentFragment();
  renderPins(pinsPlacementSelector, mockPins, fragment);
};

fillApplictationWithMocData();
