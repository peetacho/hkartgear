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
        getImageExhibitions();
        break;
    case 'Venue':
        console.log('Venue');
        uploadTheMainType = 'Venue';
        getImageExhibitions();
        break;
    case 'OpenCeremony':
        console.log('OpenCeremony');
        uploadTheMainType = 'OpenCeremony';
        getImageExhibitions();
        break;
    case 'Exhibitions':
        console.log('Exhibitions');
        uploadTheMainType = 'Exhibitions';
        getImageExhibitions();
        break;
}


function getImageExhibitions() {
    const db = firestore.collection(uploadTheMainType).doc(imageTitle);

    db.get().then(function (doc) {

        var dd = doc.data();

        for (var i = 0; i < dd.imageLength; i++) {

            if (i == 0) {
                // type is either
                createImageExhibitions(dd.title, dd.year, dd.description, dd.text);

            };
            createExhibitionsPictures(dd[i + 'url']);
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

function createImageExhibitions(Title, Year, Description, Text) {
    var div = document.createElement('div');

    var newDiv =
        `
                <div class="about-section">
                    <div class="inner-width" style = "max-width:unset;">
                        <div class="row">
                            <div class="column about-text" style="text-align: left;flex: 2;">
                                <h1 style="padding-top: 23px; text-align: left; margin:0; ">
                                    ${Title}
                                </h1>
                                <h5 style = "font-weight:lighter; margin:0;">${Year}</h5>
                                <p style="text-align: left; margin:0;">
                                    ${Description}
                                </p>
                                <br>
                                <p style="text-align: left; margin:0;">
                                    ${Text}
                                </p>
                            </div>
                            <div class="column about-image" id="insertPIC">
                                <div id="gallery">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

    div.innerHTML = newDiv;
    document.getElementById('imagePost').prepend(div);
}

var counter = 1;

function createExhibitionsPictures(Url) {
    var div = document.createElement('div');

    var displayToNone = "";
    if (counter != 1) {

        displayToNone = ' none'
    }

    var newDiv =
        `
                <div id="pic${counter}" class = "pic${displayToNone}" >
                    <button class="left" onClick="left()">&lt;</button>
                    <button class="right" onClick="right()">&gt;</button>
                    <img src="${Url}" height="90%" width="90%">
                </div>
            `;

    var pdfDiv =
        `
                <div id="pic${counter}" class = "pic${displayToNone}" >
                    <button class="left" onClick="left()">&lt;</button>
                    <button class="right" onClick="right()">&gt;</button>
                    <embed src="${Url}" height="650px" width="800px"></embed>
            `;

    var vidDiv =
        `
                <div id="pic${counter}" class = "pic${displayToNone}" >
                    <button class="left" onClick="left()">&lt;</button>
                    <button class="right" onClick="right()">&gt;</button>
                    <iframe src="${Url}" height="500px" width="800px" frameborder="0" allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>
                </div>
            `;

    counter++;

    if (Url.includes("pdf")) {
        console.log('url is pdf');
        div.innerHTML = pdfDiv;
    } else if (Url.includes("mp4")) {
        console.log('url is vid');
        div.innerHTML = vidDiv;
    } else {
        div.innerHTML = newDiv;
    }


    document.getElementById('gallery').append(div);
}



function getImageGallery() {
    const db = firestore.collection(imageCollection).doc(imageTitle);

    db.get().then(function (doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            var dd = doc.data();
            // type is either 'sculpture' or 'painting'
            createImageGallery(dd.title, dd.year, dd.description, dd.text, dd.url);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}


function createImageGallery(Title, Year, Description, Text, Url) {
    var div = document.createElement('div');

    var newDiv =
        `
                <div class="about-section">
                    <div class="inner-width" style = "max-width:unset;">
                        <div class="row">
                            <div class="column about-text" style="text-align: left;flex: 3;">
                                <h1 style="padding-top: 23px; text-align: left; margin:0; ">
                                    ${Title}
                                </h1>
                                <h5 style = "font-weight:lighter; margin:0;">${Year}</h5>
                                <p style="text-align: left; margin:0;">
                                    ${Description}
                                </p>
                                <br>
                                <p style="text-align: left; margin:0;">
                                    ${Text}
                                </p>
                            </div>
                            <div class="column about-image">
                                <img src="${Url}" width="100%" height="100%">
                            </div>
                        </div>
                    </div>
                </div>
            `;

    div.innerHTML = newDiv;
    document.getElementById('imagePost').prepend(div);
}