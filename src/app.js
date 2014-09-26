require('firebase');

var db = new Firebase('https://visual-identity.firebaseio.com/');

var gallery = document.querySelector('div.gallery');

db.child('images').on('child_added', function(newImage) {

    var img = newImage.val();

    var cont = document.createElement('div');
    cont.classList.add('item');

    var imgEl = document.createElement('img');
    imgEl.src = img.dataURI;

    var pEl = document.createElement('p');
    pEl.innerHTML = img.date || "";

    cont.appendChild(imgEl);
    cont.appendChild(pEl);

    gallery.insertBefore(cont, gallery.firstChild);

});