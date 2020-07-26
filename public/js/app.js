// Initialize Firebase
if (!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}
var firestore = firebase.firestore();
// Start grabbing DOM element

function uploadContact() {
  const submitBtn = document.querySelector("#submitContact");

  let userName = document.querySelector("#name");
  let userEmail = document.querySelector("#email");
  let userMessage = document.querySelector("#message");
  let userSubject = document.querySelector("#subject");
  console.log("got data");

  const db = firestore.collection("contactData");
  let userNameInput = userName.value;
  let userEmailInput = userEmail.value;
  let userMessageInput = userMessage.value;
  let userSubjectInput = userSubject.value;

  //Access Database
  db.doc()
    .set({
      name: userNameInput,
      email: userEmailInput,
      message: userMessageInput,
      subject: userSubjectInput,
    })
    .then(function () {
      console.log("Data Saved");
    })
    .catch(function (error) {
      console.log(error);
    });

  alert("訊息傳送成功，我們會盡快回覆你！");
}