require('firebase');

var db = new Firebase('https://visual-identity.firebaseio.com/');

var gallery = document.querySelector('div.gallery');

var main = document.querySelector('.main');


db.child('images')
    .on('child_added', function(newImage) {

        var img = newImage.val();

        var cont = document.createElement('div');
        cont.classList.add('item');
        cont.id = newImage.name();

        var imgEl = document.createElement('img');
        imgEl.src = img.dataURI;

        var pEl = document.createElement('p');
        pEl.innerHTML = img.date || "";

        cont.appendChild(imgEl);
        cont.appendChild(pEl);

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