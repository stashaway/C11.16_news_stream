angular.module("streamism",['firebase']);
var config = {
    apiKey: "AIzaSyCkUkWgpUJC7FeS2_w1ueRcLMhSz75Rh9Q",
    authDomain: "streamism-cccb0.firebaseapp.com",
    databaseURL: "https://streamism-cccb0.firebaseio.com",
    storageBucket: "streamism-cccb0.appspot.com",
    messagingSenderId: "582125369559"
};
firebase.initializeApp(config);
firebase.auth().signInAnonymously();