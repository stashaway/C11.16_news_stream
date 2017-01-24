// Initialize Firebase
var config = {
    apiKey: "AIzaSyCkUkWgpUJC7FeS2_w1ueRcLMhSz75Rh9Q",
    authDomain: "streamism-cccb0.firebaseapp.com",
    databaseURL: "https://streamism-cccb0.firebaseio.com",
    storageBucket: "streamism-cccb0.appspot.com",
    messagingSenderId: "582125369559"
};
firebase.initializeApp(config);
var fb_ref = firebase.database();
var new_data={
    "id": "qOjsZ0kp6Fo",
    "title": "ELEAGUE Major CS:GO - LIVE Day 2 // OpTic vs. Astralis",
    "channel": "ELEAGUE",
    "thumbnail": "https://i.ytimg.com/vi/qOjsZ0kp6Fo/hqdefault_live.jpg",
    "viewers": 12168,
    "link": "http://youtube.com/watch/v=qOjsZ0kp6Fo",
    "startTime": "2017-01-23T15:02:00.011Z",
    "category": "gaming"
};
fb_ref.('streams/streams').push(new_data);

fb_ref.ref('streams/streams').on('value', function(snapshot){
    updateDom(snapshot.val());
});
//function to populate DOM
function updateDom(){

};
