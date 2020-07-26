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

function uploadFile() {

    if (!firebase.apps.length) {
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }

    ///////////////////////////////////// Storage ////////////////////////////////////
    let uploadType = document.querySelector('#uploadMainType').value;

    var image = document.getElementById('file').files[0];
    var fileName = image.name;
    var storageRef = firebase.storage().ref(uploadType + '/' + fileName);
    var uploadTask = storageRef.put(image);

    ///////////////////////////////////// FIRESTORE ////////////////////////////////////
    var firestore = firebase.firestore();

    // let uploadTitle = document.querySelector('#uploadTitle');
    // let uploadText = document.querySelector('#uploadText');
    // let uploadType = document.querySelector('#uploadType');
    let uploadYear = document.querySelector('#uploadYear');
    let uploadDescription = document.querySelector('#uploadDescription');

    let uploadMainType = document.querySelector('#uploadMainType');

    var uploadTheMainType = '';

    switch (uploadMainType.value) {
        case 'OpenCeremony':
            console.log('OpenCeremony');
            uploadTheMainType = 'OpenCeremony';
            break;
        case 'Exhibitions':
            console.log('Exhibitions')
            uploadTheMainType = 'Exhibitions';
            break;
    }

    const db = firestore.collection(uploadTheMainType);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            var div = document.getElementsByClassName('uploadF')[0];

            div.style.width = progress + '%';
        },
        function (error) {

            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
                case 'storage/unauthorized':
                    // User doesn't have permission to access the object
                    console.log(`User doesn't have permission to access the object`);
                    break;

                case 'storage/canceled':
                    // User canceled the upload
                    console.log(`User canceled the upload`);
                    break;

                case 'storage/unknown':
                    // Unknown error occurred, inspect error.serverResponse
                    console.log(`Unknown error occurred, inspect error.serverResponse`);
                    break;
            }
        },
        function () {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {

                // let galleryUploadTitle = uploadTitle.value;
                // let galleryUploadText = uploadText.value;
                // let galleryUploadType = uploadType.value;
                let galleryYear = uploadYear.value;
                let galleryUploadDescription = uploadDescription.value;

                //Access Database
                db.doc().set({
                        // title: galleryUploadTitle,
                        // text: galleryUploadText,
                        // type: galleryUploadType,
                        year: galleryYear,
                        url: downloadURL,
                        description: galleryUploadDescription
                    })
                    .then(function () {
                        console.log("Data Saved");
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            });
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