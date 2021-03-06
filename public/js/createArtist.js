'use strict';

if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
};

var firestore = firebase.firestore();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var imageArtist = urlParams.get("imageArtist")
// var imageCollection = urlParams.get("imageCollection")
// var imageLength = urlParams.get("imageLength")

getImageArtist();

function getImageArtist() {
    const db = firestore.collection('artists').doc(imageArtist);

    db.get().then(function (doc) {

        var dd = doc.data();

        for (var i = 0; i < dd.imageLength; i++) {

            createLastPageImages(dd[i + 'url'], 'artists', i + 'url');
        }
        createLastPageDescription(dd.artist, dd.country, dd.description);

    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

// creates the images to the right of the last page
function createLastPageImages(Url, Collection, indexUrl) {

    var div = document.createElement('div');
    div.setAttribute('class', `column-photo show`);

    var newDiv = `
    
        <div class="content">
        <button class="content-text" id="productBtn" onClick="getImageSrc('${Url}','${Collection}')">
        <a href="Image.html" style="text-decoration: none; color: black;">
            <img src="${Url}" id="${indexUrl}"
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
function createLastPageDescription(Artist, Country, Description) {

    var div = document.createElement('div');
    div.setAttribute('class', `content-text text`);

    var newDiv = `
        <div class="artwork-create-div">
            <h2>藝術家 Artist：${Artist} </h2>
            <p>地區 Region：<span>${Country}</span> </p>
        </div>
        <br>
        <p>
            ${Description}
        </p>
    
    `

    div.innerHTML = newDiv;
    document.getElementById('last-page-description').prepend(div);

}