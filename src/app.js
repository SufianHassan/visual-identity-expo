require('firebase');
var $ = require('jquery');
// PFFFFT FUCKING SHIT
window.jQuery = $;
window.$ = $;
require('magnific-popup');

var Spinner = require('spin.js');

var db = new Firebase('https://visual-identity.firebaseio.com/');

var imagesRef = db.child('images');



var gallery = document.querySelector('div.gallery');

var main = document.querySelector('.main');

var mainCanvas = document.querySelector('.main canvas');

var ctx = mainCanvas.getContext('2d');

var popup = $('#detail-modal');

// SPINNER
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
var spinTarget = document.querySelector('.spinhome');
var spinner = new Spinner(opts).spin(spinTarget);

var imageStep = 5;

var timesCalled = 0;

var lastKey = null;
var lastDate = new Date().getTime();

var newImageQuery = imagesRef.endAt().limit(12);

newImageQuery
    .on('child_added', handleNewImage);


function renderImage(newImage) {

    var img = newImage.val();

    var timestamp = new Date(img.date).getTime();

    if (timestamp < lastDate) {
        lastDate = timestamp;
        lastKey = newImage.name();
    }

    var cont = document.createElement('div');
    cont.classList.add('item');
    cont.classList.add('details');
    cont.id = newImage.name();

    var imgEl = document.createElement('img');
    imgEl.src = img.dataURI;

    var nameEl = document.createElement('p');
    nameEl.innerHTML = img.title || 'untitled';
    var pEl = document.createElement('p');
    pEl.innerHTML = img.date || "";

    cont.appendChild(imgEl);
    cont.appendChild(nameEl);
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

    return cont;
}


function getMoreImages() {

    console.log(new Date(lastDate), lastKey);

    var moreImagesQuery = imagesRef.endAt(null, lastKey).limit(imageStep);

    moreImagesQuery.on('child_added', handleScrolledImage);
}

// load more images when we reach the bottom
$('.loadMore').click(function() {

    spinner = new Spinner(opts).spin(spinTarget);

    getMoreImages();
});


function handleScrolledImage(newImage) {
    spinner.stop();

    if (newImage.name() === lastKey) {
        console.log('chucking it away');
        return;
    }

    var cont = renderImage(newImage);

    gallery.appendChild(cont);

}


function handleNewImage(newImage) {
    spinner.stop();

    var cont = renderImage(newImage);

    gallery.insertBefore(cont, main.nextSibling);

    $('div.buttons').removeClass('mfp-hide');

}


function handleRemovedImage(removedImage) {
    var el = document.querySelector('div.item#' + removedImage.name());

    if (el) {
        el.parentNode.removeChild(el);
    }
}



db.child('current').on('value', function(newValue) {

    var data = newValue.val();

    if (!data) {
        $(main).hide();
        return;
    }

    if (data.clear) {
        ctx.clearRect(0, 0, data.w, data.h);
        $(main).hide();
        return;
    } else {
        $(main).show();
    }

    if (!data.points) {
        return;
    }

    ctx.rect(0, 0, data.w, data.h);
    ctx.fillStyle = "rgba(255, 255, 255, " + data.bgAlpha + ")";
    ctx.fill();

    ctx.save();
    ctx.translate(data.w/2, data.w/2);
    ctx.beginPath();
    // draw three points
    var p = data.points[0];

    // ctx.moveTo(p[0], p[1]);

    for (var i = 0; i < data.points.length; i++) {
        p = data.points[i];
        ctx.lineTo(p[0], p[1]);
    }

    ctx.closePath();

    ctx.fillStyle = "hsla(" + data.hue + ", 100%, 50%, " + data.inkAlpha + ")";

    ctx.fill();

    ctx.restore();



})

