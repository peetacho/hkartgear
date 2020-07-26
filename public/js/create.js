if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
};

var firestore = firebase.firestore();

var uploadTheMainType = '';

switch (document.title) {
    case 'About':
        console.log('Venue');
        uploadTheMainType = 'Venue';
        collectExhibitions();
        break;
    case 'OpenCeremony':
        console.log('OpenCeremony');
        uploadTheMainType = 'OpenCeremony';
        collectCeremony();
        //collectGallery();
        break;
    case 'Exhibitions':
        console.log('Exhibitions');
        uploadTheMainType = 'Exhibitions';
        collectGallery();
        break;
}

function collectGallery() {
    const db = firestore.collection(uploadTheMainType);

    db.orderBy("year", "asc").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            var dd = doc.data();
            createGalDiv(dd.year, dd.description, dd.url, uploadTheMainType);
        });
    });
}

function collectExhibitions() {
    const db = firestore.collection(uploadTheMainType);

    db.orderBy("year", "asc").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            var dd = doc.data();

            // type is year
            createExhDiv(dd.title, dd.year, dd.type, dd.description, dd['0url'], uploadTheMainType, dd.imageLength);
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

function createGalDiv(Year, Description, Url, CollectionName) {
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

function createExhDiv(Title, Year, Type, Description, Url, CollectionName, ImageLength) {
    var div = document.createElement('div');
    div.setAttribute('class', `column-photo ${Type} show`);

    var newDiv =
        `
            <div class="content">
            <button class="content-text" id="productBtn" onClick="getTitle('${Title}','${CollectionName}','${ImageLength}')">
            <a href="ImageExhibitions.html" style="text-decoration: none; color: black;">
                <img src="${Url}">
                <div class="content-text text">
                    <h2>${Title}</h2>
                    <h5>${Year}</h5>
                    <p>
                        ${Description}
                    </p>
                </div>
            </a>
            </button>
            </div>
            `;

    div.innerHTML = newDiv;
    document.getElementById('row-photo').prepend(div);

}

function getTitle(Title, CollectionName, ImageLength) {
    var imageTitle = Title;
    var imageCollection = CollectionName;
    var imageLength = ImageLength;

    localStorage.setItem("imageTitle", imageTitle);
    localStorage.setItem("imageCollection", imageCollection);
    localStorage.setItem("imageLength", imageLength);

    console.log('Image Title is set to: ', imageTitle);
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