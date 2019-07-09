'use strict';

(function () {
  // Initialize
  var housingTypes = {
    'Дворец': 'palace',
    'Квартира': 'flat',
    'Дом': 'house',
    'Бунгало': 'bungalo'
  };

  // Selected DOM elements
  var mapFiltersForm = document.querySelector('.map__filters');
  var housingFilter = mapFiltersForm.querySelector('select[name=housing-type]');
  var priceFilter = mapFiltersForm.querySelector('select[name=housing-price]');

  // Global functions
  window.data = {
    getHousingType: function () {
      return housingTypes[housingFilter[housingFilter.selectedIndex].innerText];
    },
    getPrice: function () {
      return priceFilter.selectedIndex;
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
  };

  applyEventHandlers();
})();
