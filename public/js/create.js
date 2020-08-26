if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
};

var firestore = firebase.firestore();

var uploadTheMainType = '';

switch (document.title) {
    case 'Artwork Sales':
        console.log('Artwork Sales');
        uploadTheMainType = 'Artwork Sales';
        collectArtwork();
        break;
    case 'About':
        console.log('Venue');
        uploadTheMainType = 'Venue';
        collectExhibitions();
        break;
    case 'Events':
        console.log('Events');
        uploadTheMainType = 'Events';
        collectEvents();
        break;
    case 'Artists':
        console.log('artists');
        uploadTheMainType = 'artists';
        collectArtists();
        break;
}

function collectEvents() {
    const db = firestore.collection(uploadTheMainType);

    db.orderBy("year", "asc").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            var dd = doc.data();
            createEventsDiv(dd.year, dd.description, dd.url, uploadTheMainType);
        });
    });
}

function collectArtwork() {
    const db = firestore.collection(uploadTheMainType);

    db.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            var dd = doc.data();

            // type is year
            createArtworkDiv(dd.artist, dd.country, dd.title, dd.media, dd.dimension, dd.type, dd.description, dd.mainUrl, uploadTheMainType, dd.imageLength, dd.price, dd.artistLink);
        });
    });

}

function createEventsDiv(Year, Description, Url, CollectionName) {
    var div = document.createElement('div');
    div.setAttribute('class', `column-photo ${Year} show`);

    var newDiv =
        `

        <div class="content">
            <button class="content-text" id="productBtn">
                <a href="Image.html?imageSrc=${Url}&collectionName=${CollectionName}" style="text-decoration: none; color: black;">
                    <img src="${Url}" style ="   width: 100% !important;    
                    height: auto !important; ">
                    <div class="content-text text">
                        <h5>${Year}</h5>
                        <p>${Description}</p>
                    </div>
                </a>
            </button>
        </div>

            `;

    div.innerHTML = newDiv;
    document.getElementById('row-photo').prepend(div);

}

function getTitle(Title, CollectionName) {
    var imageTitle = Title;
    var imageCollection = CollectionName;

    localStorage.setItem("imageTitle", imageTitle);
    localStorage.setItem("imageCollection", imageCollection);

    console.log('Image Title is set to: ', imageTitle);
    console.log('Image Collection is set to: ', imageCollection);
}

function createArtworkDiv(Artist, Country, Title, Media, Dimension, Type, Description, MainUrl, UploadTheMainType, ImageLength, Price, ArtistLink) {
    var div = document.createElement('div');
    div.setAttribute('class', `column-photo ${Type} show`);

    var newDiv =
        `
            <div class="content">
            <button class="content-text" id="productBtn">
            <a href="ImageArtworkSales.html?imageTitle=${Title}&imageArtist=${Artist}&imageCollection=${UploadTheMainType}&imageLength=${ImageLength}" style="text-decoration: none; color: black;">
                <img src="${MainUrl}" 
                style="width: 100% !important;    
                height: auto !important; ">
                <div class="content-text text">
                    <div class="artwork-create-div">
                        <h2>題目 Title：${Title}</h2>
                        <h5>藝術家 Artist：<span>${Artist}</span></h5>
                        <h5>地區 Region：<span>${Country}</span> </h5>
                        <h5>媒體 Media：<span>${Media}</span></h5>
                        <h5>尺碼 Dimensions：<span>${Dimension}</span></h5>
                        <h5>賣價 Price: <span>${Price}</span></h5>
                    </div>
                </div>
            </a>
            </button>
            </div>
            `;

    div.innerHTML = newDiv;
    document.getElementById('row-photo').prepend(div);

}

// gets open ceremony pictures from firebase documents and creates a div element
function collectArtists() {
    const db = firestore.collection(uploadTheMainType);

    db.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            var dd = doc.data();

            // type is region
            createArtistsDiv(dd.country, dd.artist, uploadTheMainType, dd.imageLength);
        });
    });
}

function createArtistsDiv(Country, Artist, UploadTheMainType, ImageLength) {
    // create a div element
    var div = document.createElement('div');

    var newDiv =
        `
        <span><a href="ImageArtists.html?imageArtist=${Artist}">${Artist}</a></span>
            `;

    div.innerHTML = newDiv;
    document.getElementById(Country).prepend(div);

}