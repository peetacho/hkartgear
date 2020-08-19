'use strict';

if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
};

var firestore = firebase.firestore();

var imageTitle = localStorage.getItem("imageTitle")
var imageCollection = localStorage.getItem("imageCollection")

console.log('Collection: ' + imageCollection + '; Title: ' + imageTitle);

var uploadTheMainType = '';

switch (imageCollection) {
    case 'Gallery':
        console.log('Gallery');
        uploadTheMainType = 'Gallery';
        getImageGallery();
        break;
    case 'Interviews':
        console.log('Interviews');
        uploadTheMainType = 'Interviews';
        getImageEvents();
        break;
    case 'Venue':
        console.log('Venue');
        uploadTheMainType = 'Venue';
        getImageEvents();
        break;
    case 'OpenCeremony':
        console.log('OpenCeremony');
        uploadTheMainType = 'OpenCeremony';
        getImageEvents();
        break;
    case 'Events':
        console.log('Events');
        uploadTheMainType = 'Events';
        getImageEvents();
        break;
}


function getImageEvents() {
    const db = firestore.collection(uploadTheMainType).doc(imageTitle);

    db.get().then(function (doc) {

        var dd = doc.data();

        for (var i = 0; i < dd.vidLength; i++) {
            createEventsVideoDiv(getEmbedLink(dd[i + 'linkVid']));
        }

        for (var i = 0; i < dd.imageLength; i++) {

            createEventsGalDiv(dd[i + 'url'], uploadTheMainType);
        }

    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

function getEmbedLink(linkVid) {
    var _link = String(linkVid).substring(17, linkVid.length);

    var begin = "https://www.youtube.com/embed/";


    var embedLink = begin + _link;
    console.log("embedLink: " + embedLink);
    return embedLink;
}

function createEventsVideoDiv(linkVid) {
    var div = document.createElement('div');
    div.setAttribute('class', `ceremony-link-vid`);

    var newDiv =
        `

        <iframe src="${linkVid}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
width="100%" height="500px"></iframe>

            `;

    div.innerHTML = newDiv;
    document.getElementById('ceremony-video').append(div);
}

function createEventsGalDiv(Url, CollectionName) {
    var div = document.createElement('div');
    div.setAttribute('class', `column-photo show`);

    var newDiv =
        `

        <div class="content">
            <button class="content-text" id="productBtn"
                onclick="getImageSrc('${Url}','${CollectionName}')">
                <a href="Image.html" style="text-decoration: none; color: black;">
                    <img src="${Url}" style ="   width: 100% !important;    
                    height: auto !important; ">
                </a>
            </button>
        </p>

            `;

    div.innerHTML = newDiv;
    document.getElementById('row-photo').prepend(div);

}