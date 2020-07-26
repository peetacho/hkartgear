if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
};

var firestore = firebase.firestore();

var imageTitle = localStorage.getItem("imageTitle");
var imageYear = localStorage.getItem("imageYear");


var uploadTheMainType = 'OpenCeremony';

collectCeremonyGallery()

// gets gallery of the specified open ceremony type
function collectCeremonyGallery() {
    const db = firestore.collection(uploadTheMainType);

    db.doc(imageYear + " " + imageTitle).get().then(function (doc) {
        if (doc.exists) {
            var dd = doc.data();

            if (dd.linkVid) {

                createCeremonyVideoDiv(getEmbedLink(dd.linkVid));
            }

            for (var i = 0; i < dd.imageLength; i++) {

                createCeremonyGalDiv(dd.year, dd[i + 'url'], uploadTheMainType);
            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
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

function createCeremonyVideoDiv(linkVid) {
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

function createCeremonyGalDiv(Year, Url, CollectionName) {
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
                </a>
            </button>
        </p>

            `;

    div.innerHTML = newDiv;
    document.getElementById('row-photo').prepend(div);

}