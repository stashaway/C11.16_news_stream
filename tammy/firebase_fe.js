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

fb_ref.ref('masterList').push(fullData);

fb_ref.ref('streams/streams').on('value', function(snapshot){
    console.log("snapshot: " ,snapshot.val())
    updateDom(snapshot.val());
});
//function to populate DOM
function updateDom(snapshot_obj){
    // buildThumbnails(snapshot_obj)
    // for(var video_obj in snapshot_obj){
    //     var streams_array = video_obj.streams;
    //     for(var i=0; i < streams_array; i++){
    //
    //     }
    // }
};
