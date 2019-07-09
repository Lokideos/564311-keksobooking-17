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
    'Любое число комнат': 'any',
    'Одна комната': 1,
    'Две комнаты': 2,
    'Три комнаты': 3
  };

  var guestsQuantity = {
    'Любое число гостей': 'any',
    'Два гостя': 2,
    'Один гость': 1,
    'Не для гостей': 'not_for_guests'
  };

  // Selected DOM elements
  var mapFiltersForm = document.querySelector('.map__filters');
  var housingFilter = mapFiltersForm.querySelector('select[name=housing-type]');
  var priceFilter = mapFiltersForm.querySelector('select[name=housing-price]');
  var roomsFilter = mapFiltersForm.querySelector('select[name=housing-rooms]');
  var guestsFilter = mapFiltersForm.querySelector('select[name=housing-guests]');

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
    },
    getGuests: function () {
      return guestsQuantity[guestsFilter[guestsFilter.selectedIndex].innerText];
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
    guestsFilter.addEventListener('change', onFilterFormChange);
  };

  applyEventHandlers();
})();
