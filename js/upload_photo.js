'use strict';

(function () {
  // Initialize
  var FILE_TYPES = ['jpg', 'jpeg', 'png', 'webp'];

  // Selected DOM elements
  var form = document.querySelector('.ad-form');
  var photoUploader = form.querySelector('.ad-form-header__upload .ad-form__field input[type=file]');
  var preview = form.querySelector('.ad-form-header__preview img');
  var photoLink = preview.src;

  photoUploader.addEventListener('change', function () {
    var photo = photoUploader.files[0];
    var fileName = photo.name.toLowerCase();

    var hasCorrectExtension = FILE_TYPES.some(function (extension) {
      return fileName.endsWith(extension);
    });

    if (hasCorrectExtension) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        photoLink = reader.result;
        preview.src = photoLink;
      });

      reader.readAsDataURL(photo);
    }
  });
})();
