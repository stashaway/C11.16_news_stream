
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        console.log('user is signed in')
    } else {
        // No user is signed in.
        console.log('user is not signed in')
    }
});

var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;
var provider = new firebase.auth.GoogleAuthProvider();

if (user != null) {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    emailVerified = user.emailVerified;
    uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                     // this value to authenticate with your backend server, if
                     // you have one. Use User.getToken() instead.
}

firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});

firebase.auth().signOut().then(function() {
    // Sign-out successful.
}, function(error) {
    // An error happened.
});