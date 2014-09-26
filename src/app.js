require('firebase');
var $ = require('jquery');
// PFFFFT FUCKING SHIT
window.jQuery = $;
window.$ = $;
require('magnific-popup');

var Spinner = require('spin.js');

var db = new Firebase('https://visual-identity.firebaseio.com/');

var gallery = document.querySelector('div.gallery');

var main = document.querySelector('.main');

var popup = $('#detail-modal');


var opts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};
var target = document.querySelector('.spinhome');
var spinner = new Spinner(opts).spin(target);


db.child('images')
    .on('child_added', function(newImage) {

        spinner.stop();

        var img = newImage.val();

        var cont = document.createElement('div');
        cont.classList.add('item');
        cont.classList.add('details');
        cont.id = newImage.name();

        var imgEl = document.createElement('img');
        imgEl.src = img.dataURI;

        var pEl = document.createElement('p');
        pEl.innerHTML = img.date || "";

        cont.appendChild(imgEl);
        cont.appendChild(pEl);

        cont.onclick = function() {



            var anchor = document.createElement('a');
            anchor.href = img.dataURI;
            anchor.download = cont.id + '.png';

            var imgEl = document.createElement('img');
            imgEl.src = img.dataURI;
            anchor.appendChild(imgEl);

            $('#detail-modal .image').html(anchor);

            $.magnificPopup.open({
                items : {
                    type: 'inline',
                    src: '#detail-modal',
                },
                modal: true
            });

            $(document).on('click', '.popup-modal-dismiss', function (e) {
                e.preventDefault();
                $.magnificPopup.close();
            });

        }



        gallery.insertBefore(cont, main.nextSibling);

    });

db.child('images')
    .on('child_removed', function(removedImage) {
        var el = document.querySelector('div.item#' + removedImage.name());

        if (el) {
            el.parentNode.removeChild(el);
        }
    });

var mainCanvas = document.querySelector('.main canvas');

var ctx = mainCanvas.getContext('2d');





db.child('current').on('value', function(newValue) {
    var frame = newValue.val();

    if (!frame) {
        return;
    }

    var image = document.createElement('img');

    image.onload = function() {
        ctx.drawImage(image, 0, 0);
    }

    image.src = frame.dataURI;

})