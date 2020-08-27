'use strict';

if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
};

var firestore = firebase.firestore();

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
// let urlParams = (new Url(document.location)).searchParams;

const imageTitle = urlParams.get("imageTitle")
const imageArtist = urlParams.get("imageArtist")
const imageCollection = urlParams.get("imageCollection")
const imageLength = urlParams.get("imageLength")

console.log(imageTitle)
console.log(imageArtist)
console.log(imageCollection)
console.log(imageLength)

getImageArtist();

function getImageArtist() {
    const db = firestore.collection(imageCollection).doc(imageArtist + " " + imageTitle);

    db.get().then(function (doc) {

        var dd = doc.data();

        for (var i = 0; i < dd.imageLength; i++) {

            createLastPageImages(dd[i + 'url'], imageCollection, i + 'url');
        }
        createLastPageDescription(dd.artist, dd.country, dd.title, dd.media, dd.description, dd.dimension, dd.price);

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
function createLastPageDescription(Artist, Country, Title, Media, Description, Dimension, Price) {

    var div = document.createElement('div');
    div.setAttribute('class', `content-text text`);

    var newDiv = `
        <div class="artwork-create-div">
            <h2>題目 Title：${Title}</h2>
            <h4>藝術家 Artist：<a href="ImageArtists.html?imageArtist=${Artist}">${Artist}</a></h4>
            <h4>地區 Region：<span>${Country}</span> </h4>
            <h4>媒體 Media：<span>${Media}</span></h4>
            <h4>尺碼 Dimensions：<span>${Dimension}</span></h4>
            <h4>賣價 Price: <span>${Price}</span></h4>
        </div>
        <br>
        <p>
            ${Description}
        </p>
    
    `

    div.innerHTML = newDiv;
    document.getElementById('last-page-description').prepend(div);

}