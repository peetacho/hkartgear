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
            createArtworkDiv(dd.artist, dd.title, dd.media, dd.type, dd.description, dd.mainUrl, uploadTheMainType, dd.imageLength, dd.price, dd.artistLink);
        });
    });

}

// gets open ceremony pictures from firebase documents and creates a div element
function collectCeremony() {
    const db = firestore.collection(uploadTheMainType);

    db.orderBy("year", "asc").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            var dd = doc.data();

            // type is year
            createCerDiv(dd.title, dd.year, dd.mainUrl, uploadTheMainType, dd.imageLength);
        });
    });

}

function createEventsDiv(Year, Description, Url, CollectionName) {
    var div = document.createElement('div');
    div.setAttribute('class', `column-photo ${Year} show`);

    var newDiv =
        `

        <div class="content">
            <button class="content-text" id="productBtn"
                onclick="getImageSrc('${Url}','${CollectionName}')">
                <a href="Image.html" style="text-decoration: none; color: black;">
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

function createArtworkDiv(Artist, Title, Media, Type, Description, MainUrl, UploadTheMainType, ImageLength, Price, ArtistLink) {
    var div = document.createElement('div');
    div.setAttribute('class', `column-photo ${Type} show`);

    var newDiv =
        `
            <div class="content">
            <button class="content-text" id="productBtn" onClick="getTitle('${Title}','${Artist}','${UploadTheMainType}','${ImageLength}')">
            <a href="ImageArtworkSales.html" style="text-decoration: none; color: black;">
                <img src="${MainUrl}" 
                style="width: 100% !important;    
                height: auto !important; ">
                <div class="content-text text">
                    <h2>藝術家：${Artist}</h2>
                    <h4 style="text-align: left;">題目： ${Title}</h4>
                    <p>
                        ${Media}
                    </p>
                    <h4 style="font-weight:bold; text-align: left;">賣價 Price: ${Price}</h4>
                </div>
            </a>
            </button>
            </div>
            `;

    div.innerHTML = newDiv;
    document.getElementById('row-photo').prepend(div);

}

function getTitle(Title, Artist, CollectionName, ImageLength) {
    var imageTitle = Title;
    var imageArtist = Artist;
    var imageCollection = CollectionName;
    var imageLength = ImageLength;

    localStorage.setItem("imageTitle", imageTitle);
    localStorage.setItem("imageArtist", imageArtist);
    localStorage.setItem("imageCollection", imageCollection);
    localStorage.setItem("imageLength", imageLength);

    console.log('Image Title is set to: ', imageTitle);
    console.log('Image Artist is set to: ', imageArtist);
    console.log('Image Collection is set to: ', imageCollection);
    console.log('Image length is set to: ', imageLength);
}

function createCerDiv(Title, Year, MainUrl, CollectionName, ImageLength) {
    // create a div element
    var div = document.createElement('div');
    div.setAttribute('class', `column-photo ${Year} show`);

    var linkName = '';

    var newDiv =
        `
            <div class="ceremony-link-vid">
                <button id="productBtn" onclick="getCerTitle('${Title}','${Year}','${CollectionName}','${ImageLength}')">
                    <div style="color: black; float: left;
                        display: flex;
                        flex-direction: row;
                        background-color: white !important;">

                        <div class="text">
                            <h2>${Year} 開幕式</h2>
                            <p>${Title}</p>
                        </div>

                        <div class="content-img" style="width: 100%;">
                            <img src="${MainUrl}"
                                style=" width: 100% !important;    
                            height: auto !important; ">
                        </div>
                        
                    </div>
                </button>
            </div>
            `;

    div.innerHTML = newDiv;
    document.getElementById('row-photo').prepend(div);

}

function getCerTitle(Title, Year, CollectionName, ImageLength) {
    var imageTitle = Title;
    var imageYear = Year;
    var imageCollection = CollectionName;
    var imageLength = ImageLength;

    localStorage.setItem("imageTitle", imageTitle);
    localStorage.setItem("imageYear", imageYear);
    localStorage.setItem("imageCollection", imageCollection);
    localStorage.setItem("imageLength", imageLength);

    console.log('Image Title is set to: ', imageTitle);
    console.log('Image Year is set to: ', imageYear);
    console.log('Image Collection is set to: ', imageCollection);
    console.log('Image length is set to: ', imageLength);

    window.location.href = "ImageOpenCer.html";
}