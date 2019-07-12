'use strict';

(function () {
  // Initialize
  var FILE_TYPES = ['jpg', 'jpeg', 'png', 'webp'];

  // Selected DOM elements
  var form = document.querySelector('.ad-form');
  var photoUploader = form.querySelector('.ad-form__photo-container .ad-form__upload input[type=file]');
  var photoPlaceholder = form.querySelector('.ad-form__photo-container');
  var photoThumbnail = photoPlaceholder.querySelector('.ad-form__photo');

  // Support
  var getTemplateFragment = function (templateId, templateFragment) {
    return document.querySelector(templateId)
      .content
      .querySelector(templateFragment);
  };

  var renderPhoto = function (src) {
    var photo = getTemplateFragment('#gallery-photo', 'img').cloneNode(true);
    photo.src = src;
    photoPlaceholder.insertBefore(photo, photoThumbnail);
  };

  photoUploader.addEventListener('change', function () {
    var photo = photoUploader.files[0];
    var fileName = photo.name.toLowerCase();

    var hasCorrectExtension = FILE_TYPES.some(function (extension) {
      return fileName.endsWith(extension);
    });

    if (hasCorrectExtension) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        renderPhoto(reader.result);
      });

      reader.readAsDataURL(photo);
    }
  });
})();
