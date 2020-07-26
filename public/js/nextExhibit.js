
var exCounter = 1;
var imageLength = localStorage.getItem('imageLength');

function left() {
    if(exCounter <= imageLength && exCounter != 1 ){
        var btns = document.querySelector("#pic" + exCounter.toString());
        var picID = 'pic' + exCounter.toString();

        console.log('picID: ' + picID);
        console.log('exCounter: ' + exCounter);

        exCounter--;

        newPicID = 'pic' + exCounter;
        console.log('newPicID: ' + newPicID);


        var otherPic = document.getElementById(newPicID);
        otherPic.className = otherPic.className.replace(" none", "");
        btns.className += " none";
    }
}

function right() {

    console.log("imageLength: " + imageLength);

    if(exCounter < imageLength ){
        var btns = document.querySelector("#pic" + exCounter.toString());
        var picID = 'pic' + exCounter.toString();

        console.log('picID: ' + picID);
        console.log('exCounter: ' + exCounter);

        exCounter++;

        newPicID = 'pic' + exCounter;
        console.log('newPicID: ' + newPicID);


        var otherPic = document.getElementById(newPicID);
        otherPic.className = otherPic.className.replace(" none", "");
        btns.className += " none";
    }
}