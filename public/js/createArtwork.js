'use strict';

if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
};

var firestore = firebase.firestore();

var imageTitle = localStorage.getItem("imageTitle")
var imageArtist = localStorage.getItem("imageArtist")
var imageCollection = localStorage.getItem("imageCollection")
var imageLength = localStorage.getItem("imageLength")

getImageArtwork();

function getImageArtwork() {
    const db = firestore.collection(imageCollection).doc(imageArtist + " " + imageTitle);

    db.get().then(function (doc) {

        var dd = doc.data();

        for (var i = 0; i < dd.imageLength; i++) {

            createLastPageImages(dd[i + 'url'], imageCollection);
        }
        createLastPageDescription(dd.artist, dd.title, dd.media, dd.description);

    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

// creates the images to the right of the last page
function createLastPageImages(Url, Collection) {

    var div = document.createElement('div');
    div.setAttribute('class', `column-photo show`);

    var newDiv = `
    
        <div class="content">
        <button class="content-text" id="productBtn" onClick="getImageSrc('${Url}','${Collection}')">
        <a href="Image.html" style="text-decoration: none; color: black;">
            <img src="${Url}" 
            style="width: 100% !important;    
            height: auto !important; ">
        </a>
        </button>
        </div>
    
    `

    div.innerHTML = newDiv;
    document.getElementById('last-page-photos').prepend(div);

}

// creates the description to the left of the last page
function createLastPageDescription(Artist, Title, Media, Description) {

    var div = document.createElement('div');
    div.setAttribute('class', `content-text text`);

    var newDiv = `
    
        <h2>藝術家： ${Artist}</h2>
        <h4 style="text-align: left;">題目： ${Title}</h4>
        <p>
            ${Media}
        </p>
        <p>
            ${Description}
        </p>
    
    `

    div.innerHTML = newDiv;
    document.getElementById('last-page-description').prepend(div);

}