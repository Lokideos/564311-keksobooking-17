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

  // Global functions
  window.data = {
    getHousingType: function () {
      return housingTypes[housingFilter[housingFilter.selectedIndex].innerText];
    }
  };

  // Event handler functions
  var onHousingTypeChange = function () {
    window.rendering.reRenderPins();
  };

  // Runtime
  var applyEventHandlers = function () {
    housingFilter.addEventListener('change', onHousingTypeChange);
  };

  applyEventHandlers();
})();
