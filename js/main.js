'use strict';

var AVATAR_LINK_TEMPLATE = 'img/avatars/user0';
var AVATAR_EXTENSION = '.png';
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_Y = 130;
var MAX_Y = 630;
var overlaySelector = '.map__overlay';
var mapSelector = '.map';
var fadingClassName = 'map--faded';


// Support
var pickRandomIndex = function (length) {
  return Math.floor(Math.random() * length);
};

// DOM manipulation
var getOverlayWidth = function (overlay) {
  return document.querySelector(overlay).offsetWidth;
};

var showMap = function (selector, hidingClass) {
  document.querySelector(selector).classList.remove(hidingClass);
};

// Generators
// Mock helpers
var generateX = function () {
  return Math.floor(Math.random() * getOverlayWidth(overlaySelector));
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

var generateAdArray = function (length) {
  var ads = [];
  for (var i = 0; i < length; i++) {
    ads.push(generateAd());
  }

  return ads;
};

// Runtime
var useMock = function () {
  generateAdArray(8);
  showMap(mapSelector, fadingClassName);
};

useMock();
