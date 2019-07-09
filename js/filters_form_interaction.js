'use strict';

(function () {
  // Initialize
  var housingTypes = {
    'Дворец': 'palace',
    'Квартира': 'flat',
    'Дом': 'house',
    'Бунгало': 'bungalo'
  };

  var roomsQuantity = {
    'Любое число комнат': 0,
    'Одна комната': 1,
    'Две комнаты': 2,
    'Три комнаты': 3
  };

  // Selected DOM elements
  var mapFiltersForm = document.querySelector('.map__filters');
  var housingFilter = mapFiltersForm.querySelector('select[name=housing-type]');
  var priceFilter = mapFiltersForm.querySelector('select[name=housing-price]');
  var roomsFilter = mapFiltersForm.querySelector('select[name=housing-rooms]');

  // Global functions
  window.data = {
    getHousingType: function () {
      return housingTypes[housingFilter[housingFilter.selectedIndex].innerText];
    },
    getPrice: function () {
      return priceFilter.selectedIndex;
    },
    getRooms: function () {
      return roomsQuantity[roomsFilter[roomsFilter.selectedIndex].innerText];
    }
  };

  // Event handler functions
  var onFilterFormChange = function () {
    window.rendering.reRenderPins();
  };

  // Runtime
  var applyEventHandlers = function () {
    housingFilter.addEventListener('change', onFilterFormChange);
    priceFilter.addEventListener('change', onFilterFormChange);
    roomsFilter.addEventListener('change', onFilterFormChange);
  };

  applyEventHandlers();
})();
