'use strict';

(function () {
  // Initialize
  var ESC_KEYCODE = 27;
  var advertisments = [];
  var MAX_RENDERED_PINS = 5;
  var CORRECT_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var APPARTMENT_TYPES = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  // DOM Elements
  var main = document.querySelector('main');
  var map = main.querySelector('.map');

  // Selectors
  var pinTemplateSelector = '#pin';
  var pinFragmentSelector = '.map__pin';
  var pinsPlacementSelector = '.map__pins';

  var cardTemplateSelector = '#card';
  var cardFragmentSelector = '.map__card';
  var filtersSelector = '.map__filters-container';

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
    var housingType = APPARTMENT_TYPES[window.data.getHousingType()];

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
    var housingType = APPARTMENT_TYPES[window.data.getHousingType()];
    var priceFilterIndex = window.data.getPrice();
    var roomsQuantity = window.data.getRooms();
    var guestsQuantity = window.data.getGuests();

    ads = ads.filter(function (ad) {
      switch (priceFilterIndex) {
        case 1:
          if (ad.offer.price >= 10000 && ad.offer.price < 50000) {
            return ad;
          }
          break;
        case 2:
          if (ad.offer.price < 10000) {
            return ad;
          }
          break;
        case 3:
          if (ad.offer.price >= 50000) {
            return ad;
          }
          break;
        default:
          return ad;
      }

      return null;
    });
    ads = ads.filter(function (ad) {
      if (!housingType) {
        return ad;
      }
      if (ad.offer.type === housingType) {
        return ad;
      }
      return null;
    });
    ads = ads.filter(function (ad) {
      if (roomsQuantity === 'any') {
        return ad;
      }
      if (roomsQuantity === ad.offer.rooms) {
        return ad;
      }
      return null;
    });
    return ads.filter(function (ad) {
      if (guestsQuantity === 'any') {
        return ad;
      }
      if (roomsQuantity === ad.offer.guests) {
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
        'type': APPARTMENT_TYPES[ad.offer.type],
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

  var renderPins = function (ads, pinsPlacement) {
    var pinFragment = document.createDocumentFragment();
    var canvas = document.querySelector(pinsPlacement);
    ads.forEach(function (ad) {
      var pin = generatePin(ad);
      pinFragment.appendChild(pin);

      pin.addEventListener('click', function () {
        var currentAd = map.querySelector('.map__card');
        if (currentAd) {
          currentAd.remove();
        }

        renderCard(generateCard(ad));
      });
    });

    canvas.appendChild(pinFragment);
  };

  var generateCard = function (ad) {
    var card = getTemplateFragment(cardTemplateSelector, cardFragmentSelector).cloneNode(true);
    var cardTitle = card.querySelector('.popup__title');
    var cardAddress = card.querySelector('.popup__text--address');
    var cardPrice = card.querySelector('.popup__text--price');
    var cardType = card.querySelector('.popup__type');
    var cardCapacity = card.querySelector('.popup__text--capacity');
    var cardTime = card.querySelector('.popup__text--time');
    var cardFeatures = card.querySelector('.popup__features');
    var cardDescription = card.querySelector('.popup__description');
    var cardPictures = card.querySelector('.popup__photos');
    var cardPictureTemplate = cardPictures.querySelector('.popup__photo');
    var cardAvatar = card.querySelector('.popup__avatar');

    cardTitle.innerText = ad.offer.title;
    cardAddress.innerText = ad.offer.address;
    cardPrice.innerText = ad.offer.price + '₽/ночь';
    cardType.innerText = ad.offer.type;
    cardCapacity.innerText = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    cardTime.innerText = 'Заезд после ' + ad.offer.checkin + ', ' + 'выезд до ' + ad.offer.checkout;
    generateCardFeatures(cardFeatures, ad.offer.features);
    cardDescription.innerText = ad.offer.description;
    generateCardPictures(cardPictures, cardPictureTemplate, ad.offer.photos);
    cardAvatar.src = ad.author.avatar;

    return card;
  };

  var generateCardFeatures = function (parentListElement, features) {
    while (parentListElement.firstChild) {
      parentListElement.removeChild(parentListElement.firstChild);
    }

    CORRECT_FEATURES.forEach(function (feature) {
      if (features.includes(feature)) {
        var listElement = document.createElement('li');
        listElement.classList.add('popup__feature');
        listElement.classList.add('popup__feature--' + feature);
        listElement.innerText = feature;
        parentListElement.appendChild(listElement);
      }
    });
  };

  var generateCardPictures = function (parentListElement, pictureTemplate, pictures) {
    pictures.forEach(function (picture) {
      var template = pictureTemplate.cloneNode(true);
      template.src = picture;
      parentListElement.appendChild(template);
    });

    parentListElement.firstElementChild.remove();
  };

  var renderCard = function (card) {
    card.querySelector('.popup__close').addEventListener('click', function () {
      // eslint-disable-next-line no-invalid-this
      this.closest('.map__card').remove();
    });

    document.addEventListener('keydown', onSetupEscPress);

    map.insertBefore(card, document.querySelector(filtersSelector));
  };

  // Event handlers functions
  var onSetupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      map.querySelector('.map__card').remove();

      document.removeEventListener('keydown', onSetupEscPress);
    }
  };

  var onSuccessHandler = function (data) {
    advertisments = generateAdsArray(data);
    console.log(advertisments);
    renderPins(advertisments.slice(0, MAX_RENDERED_PINS), pinsPlacementSelector);
  };

  // Global functions
  window.rendering = {
    reRenderPins: function () {
      var adsToRender = getAdsOfType(sortAds(advertisments));
      var oldPinsArray = document.querySelectorAll('.map__pins .map__pin');

      oldPinsArray.forEach(function (pin) {
        if (!pin.classList.contains('map__pin--main')) {
          pin.remove();
        }
      });

      renderPins(adsToRender.slice(0, getPinsQuantity(adsToRender.length)), pinsPlacementSelector);
    }
  };

  // Runtime
  window.xhr.load(onSuccessHandler, window.xhr.onErrorHandler);
})();
