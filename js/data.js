'use strict';

(function () {
  // Initialize
  var advertisments = [];
  var MAX_RENDERED_PINS = 5;
  // DOM Elements
  var main = document.querySelector('main');

  // Selectors
  var errorTemplateSelector = '#error';
  var errorFragmentSelector = '.error';
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

  var getPinsQuantity = function (pinsCount) {
    if (pinsCount < MAX_RENDERED_PINS) {
      return pinsCount;
    }
    return MAX_RENDERED_PINS;
  };

  var getRating = function (ad) {
    var rating = 0;
    var housingType = window.data.getHousingType();

    if (ad.offer.type === housingType) {
      rating += 1;
    }

    return rating;
  };

  var sortAds = function (ads) {
    return ads.slice().sort(function (leftAd, rightAd) {
      var leftRating = getRating(leftAd);
      var rightRating = getRating(rightAd);
      if (leftRating < rightRating) {
        return 1;
      }
      if (leftRating > rightRating) {
        return -1;
      }
      return 0;
    });
  };

  var getAdsOfType = function (ads) {
    var housingType = window.data.getHousingType();
    return ads.filter(function (ad) {
      if (ad.offer.type === housingType) {
        return ad;
      }
      return null;
    });
  };

  // Data generation
  var generateAd = function (ad) {
    return {
      'author': {
        'avatar': ad.author.avatar
      },
      'offer': {
        'title': ad.offer.title,
        'address': ad.offer.address,
        'price': ad.offer.price,
        'type': ad.offer.type,
        'rooms': ad.offer.rooms,
        'guests': ad.offer.guests,
        'checkin': ad.offer.checkin,
        'checkout': ad.offer.checkout,
        'features': ad.offer.features,
        'description': ad.offer.description,
        'photos': ad.offer.photos
      },
      'location': {
        'x': ad.location.x,
        'y': ad.location.y
      }
    };
  };

  var generateAdsArray = function (adsData) {
    return adsData.map(function (ad) {
      return generateAd(ad);
    });
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

  // Event handlers functions
  var onSuccessHandler = function (data) {
    advertisments = generateAdsArray(data);
    var pinsData = generatePinsArray(advertisments.slice(0, MAX_RENDERED_PINS));
    var fragment = document.createDocumentFragment();
    renderPins(pinsPlacementSelector, pinsData, fragment);
  };

  var onErrorHandler = function () {
    var error = getTemplateFragment(errorTemplateSelector, errorFragmentSelector).cloneNode(true);
    var fragment = document.createDocumentFragment();
    main.appendChild(fragment.appendChild(error));
  };

  // Global functions
  window.rendering = {
    reRenderPins: function () {
      var adsToRender = getAdsOfType(sortAds(advertisments));

      var pinsData = generatePinsArray(adsToRender.slice(0, getPinsQuantity(adsToRender.length)));
      var fragment = document.createDocumentFragment();
      var oldPinsArray = document.querySelector('.map__pins').querySelectorAll('.map__pin');

      oldPinsArray.forEach(function (pin) {
        if (!pin.classList.contains('map__pin--main')) {
          pin.remove();
        }
      });

      renderPins(pinsPlacementSelector, pinsData, fragment);
    }
  };

  // Runtime
  window.xhr.load(onSuccessHandler, onErrorHandler);
})();
