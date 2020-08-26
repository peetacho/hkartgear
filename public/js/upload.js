function login() {
    var email = document.querySelector('#uploadEmail').value;
    var password = document.querySelector('#uploadPassword').value;
    console.log(email, password);

    if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().signInWithEmailAndPassword(email, password).then(cred => {
            console.log(cred.user);
            var uploads = document.getElementsByClassName('uploads');

            for (var i = 0; i < uploads.length; i++) {
                uploads[i].className = uploads[i].className.replace(" none", "");
            }
            console.log('User is logged in!');
        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log('Error on log in:', error);
        });
}

function uploadArtworkSale() {
    indexUploaded = 0;

    //Listen for file selection
    var image = document.getElementById('uploadArtFile').files;
    let mainImage = document.getElementById('uploadArtMainFile').files;
    // console.log(image);

    let uploadArtArtist = document.querySelector('#uploadArtArtist').value;
    let uploadArtCountry = document.querySelector('#uploadArtCountry').value;
    let uploadArtArtistLink = document.querySelector('#uploadArtArtistLink').value;
    let uploadArtTitle = document.querySelector('#uploadArtTitle').value;
    let uploadArtMedia = document.querySelector('#uploadArtMedia').value;
    let uploadArtType = document.querySelector('#uploadArtType').value;
    let uploadArtPrice = document.querySelector('#uploadArtPrice').value;

    let uploadArtDescription = document.querySelector('#uploadArtDescription').value;

    let uploadArtPremiumType = document.querySelector('#uploadArtPremiumType').value;

    for (var i = 0; i < image.length; i++) {
        var imageFile = image[i];
        var mainFile = mainImage[0];
        uploadImageAsPromiseArtworkSales(mainFile, imageFile, image.length, i, uploadArtArtist, uploadArtCountry, uploadArtArtistLink, uploadArtTitle, uploadArtMedia, uploadArtType, uploadArtDescription, uploadArtPremiumType, uploadArtPrice)
    }
}

function uploadImageAsPromiseArtworkSales(mainFile, imageFile, imageLength, index, uploadArtArtist, uploadArtCountry, uploadArtArtistLink, uploadArtTitle, uploadArtMedia, uploadArtType, uploadArtDescription, uploadArtPremiumType, uploadArtPrice) {
    return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref(uploadArtPremiumType.toLowerCase() + '/' + imageFile.name);

        // initialize firestore
        var firestore = firebase.firestore();
        const db = firestore.collection(uploadArtPremiumType);
        var task;

        if (index == 0) {
            //Upload file
            task = storageRef.put(mainFile);
        } else {
            task = storageRef.put(imageFile);
        }

        //Update progress bar
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                // console.log('Multiple upload is ' + percentage + '% done');

                var div = document.getElementsByClassName('uploadMultipleF')[0];

                div.style.width = percentage + '%';

            },
            function error(err) {
                console.log(err);
            },
            function () {
                task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    // console.log('File available at', downloadURL);

                    if (index == 0) {
                        db.doc(uploadArtArtist + " " + uploadArtTitle).set({
                                mainUrl: downloadURL,
                                imageLength: imageLength,
                                artist: uploadArtArtist,
                                country: uploadArtCountry,
                                artistLink: uploadArtArtistLink,
                                title: uploadArtTitle,
                                media: uploadArtMedia,
                                description: uploadArtDescription,
                                type: uploadArtType,
                                price: uploadArtPrice
                            }, {
                                merge: true
                            })
                            .then(function () {
                                console.log("Data Saved");
                                indexUploaded++;
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }

                    //Access Database
                    db.doc(uploadArtArtist + " " + uploadArtTitle).set({
                            [index + 'url']: downloadURL
                        }, {
                            merge: true
                        })
                        .then(function () {
                            console.log("Data Saved");
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                });
            }
        );
    });
}


function uploadMultiple() {
    indexUploaded = 0;

    //Listen for file selection
    var image = document.getElementById('multipleFile').files;
    let mainImage = document.getElementById('mainFile').files;
    // console.log(image);

    let uploadMultipleTitle = document.querySelector('#uploadMultipleTitle').value;
    let uploadMultipleYear = document.querySelector('#uploadMultipleYear').value;
    let uploadMultipleVideoLink = document.querySelector('#uploadMultipleVideoLink').value;

    // let uploadMultipleType = document.querySelector('#uploadMultipleType').value;
    // let uploadMultipleDescription = document.querySelector('#uploadMultipleDescription').value;
    // let uploadMultipleText = document.querySelector('#uploadMultipleText').value;

    let uploadMultipleMainType = document.querySelector('#uploadMultipleMainType').value;

    for (var i = 0; i < image.length; i++) {
        var imageFile = image[i];

        switch (uploadMultipleMainType) {
            case 'OpenCeremony':
                var mainFile = mainImage[0];
                console.log('OpenCeremony');
                uploadTheMainType = 'OpenCeremony';
                uploadImageAsPromise(mainFile, imageFile, i, uploadMultipleTitle, uploadMultipleYear, image.length, uploadMultipleVideoLink, uploadMultipleMainType);
                break;
            case 'Exhibitions':
                console.log('Exhibitions')
                uploadTheMainType = 'Exhibitions';
                uploadImageAsPromiseExhibitions(imageFile, uploadMultipleYear, uploadMultipleMainType);
                break;
            case 'Events':
                console.log('Events')
                uploadTheMainType = 'Events';
                uploadImageAsPromiseEvents(uploadMultipleTitle, imageFile, i, image.length, uploadMultipleMainType);
                break;
        }
    }
}

var indexUploaded;

//Handle waiting to upload each file using promise
function uploadImageAsPromise(mainFile, imageFile, index, uploadMultipleTitle, uploadMultipleYear, imageLength, uploadMultipleVideoLink, uploadMultipleMainType) {
    return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref(uploadMultipleMainType.toLowerCase() + '/' + imageFile.name);

        // initialize firestore
        var firestore = firebase.firestore();
        const db = firestore.collection(uploadMultipleMainType);
        var task;

        if (index == 0) {
            //Upload file
            task = storageRef.put(mainFile);
        } else {
            task = storageRef.put(imageFile);
        }

        //Update progress bar
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                // console.log('Multiple upload is ' + percentage + '% done');

                var div = document.getElementsByClassName('uploadMultipleF')[0];

                div.style.width = percentage + '%';

            },
            function error(err) {
                console.log(err);
            },
            function () {
                task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    // console.log('File available at', downloadURL);

                    if (index == 0) {
                        db.doc(uploadMultipleYear + " " + uploadMultipleTitle).set({
                                title: uploadMultipleTitle,
                                year: uploadMultipleYear,
                                mainUrl: downloadURL,
                                linkVid: uploadMultipleVideoLink,
                                imageLength: imageLength
                            }, {
                                merge: true
                            })
                            .then(function () {
                                console.log("Data Saved");
                                indexUploaded++;
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }

                    //Access Database
                    db.doc(uploadMultipleYear + " " + uploadMultipleTitle).set({
                            [index + 'url']: downloadURL
                        }, {
                            merge: true
                        })
                        .then(function () {
                            console.log("Data Saved");
                            indexUploaded++;

                            var div = document.createElement('div');

                            console.log("indexUploaded: " + indexUploaded);
                            console.log("imageLength: " + imageLength);
                            var progressSaved = ((indexUploaded - 1) / (imageLength)) * 100;
                            console.log("progressSaved: " + progressSaved);

                            var newDiv =
                                `
                                <p> ${progressSaved}% DONE! </p
                        
                                    `;

                            div.innerHTML = newDiv;
                            document.getElementById('uploadTextNotice').prepend(div);
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                });
            }
        );
    });
}

//Handle waiting to upload each file using promise
function uploadImageAsPromiseEvents(uploadMultipleTitle, imageFile, index, imageLength, uploadMultipleMainType) {
    return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref(uploadMultipleMainType.toLowerCase() + '/' + imageFile.name);

        // initialize firestore
        var firestore = firebase.firestore();
        const db = firestore.collection(uploadMultipleMainType);
        var task = storageRef.put(imageFile);

        //Update progress bar
        task.on('state_changed',
            function progress(snapshot) {

            },
            function error(err) {
                console.log(err);
            },
            function () {
                task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    // console.log('File available at', downloadURL);

                    //Access Database
                    db.doc(uploadMultipleTitle).set({
                            [index + 'url']: downloadURL,
                            imageLength: imageLength
                        }, {
                            merge: true
                        })
                        .then(function () {
                            console.log("Data Saved");
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                });
            }
        );
    });
}


function uploadImageAsPromiseExhibitions(imageFile, uploadMultipleYear, uploadMultipleMainType) {
    return new Promise(function (resolve, reject) {
        var storageRef = firebase.storage().ref('exhibitions/' + imageFile.name);

        // initialize firestore
        var firestore = firebase.firestore();
        const db = firestore.collection(uploadMultipleMainType);

        var task = storageRef.put(imageFile);

        //Update progress bar
        task.on('state_changed',
            function progress(snapshot) {
                var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                // console.log('Multiple upload is ' + percentage + '% done');

                var div = document.getElementsByClassName('uploadMultipleF')[0];

                div.style.width = percentage + '%';

            },
            function error(err) {
                console.log(err);
            },
            function () {
                task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    // console.log('File available at', downloadURL);
                    db.doc().set({
                            year: uploadMultipleYear,
                            url: downloadURL,
                            description: "",
                        }, {
                            merge: true
                        })
                        .then(function () {
                            console.log("Data Saved");
                        })
                        .catch(function (error) {
                            console.log(error);
                        });


                });
            }
        );
    });
}