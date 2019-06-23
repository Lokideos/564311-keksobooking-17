'use strict';

(function () {
  // Initialize
  // Selectors
  var pinTemplateSelector = '#pin';
  var pinFragmentSelector = '.map__pin';
  var pinsPlacementSelector = '.map__pins';

  // Initial data
  var PIN_PSEUDO_ELEMENT_HEIGHT = 30;

  // DOM manipulation
  var adjustXLocation = function (xCoordinate) {
    return xCoordinate + document.querySelector('.map__pin').offsetWidth / 2;
  };

  var adjustYLocation = function (yCoordinate) {
    return yCoordinate + document.querySelector('.map__pin').offsetHeight - PIN_PSEUDO_ELEMENT_HEIGHT;
  };

  // Support
  var getTemplateFragment = function (templateId, templateFragment) {
    return document.querySelector(templateId)
      .content
      .querySelector(templateFragment);
  };

  // Data generation
  var generateAd = function (ad) {
    return {
      'author': {
        'avatar': ad.author.avatar
      },
      'offer': {
        'type': ad.offer.type
      },
      'location': ad.location
    };
  };

  var generateAdsArray = function (adsData) {
    var ads = [];
    adsData.forEach(function (ad) {
      ads.push(generateAd(ad));
    });

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

  var renderPins = function (pinsPlacement, pinsData, fragment) {
    var canvas = document.querySelector(pinsPlacement);
    pinsData.forEach(function (pin) {
      fragment.appendChild(pin);
    });

    canvas.appendChild(fragment);
  };

  // Runtime
  window.xhr.load(function (data) {
    var ads = generateAdsArray(data);
    var pinsData = generatePinsArray(ads);
    var fragment = document.createDocumentFragment();
    renderPins(pinsPlacementSelector, pinsData, fragment);
  });
})();
