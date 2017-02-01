
//FIREBASE UI
//check if user is signed in or not
$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log('user is signed in', user)
        } else {
            // No user is signed in.
            console.log('no one is signed in')
        }
    });
});

//get user profile info
var user = firebase.auth().currentUser;

function user_info() {
    var name, email, photoUrl, uid, emailVerified;

    if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                         // this value to authenticate with your backend server.
                         // Use User.getToken() instead.
    }
}

//get provider specific user info
function provider_info() {
    if (user != null) {
        user.providerData.forEach(function (profile) {
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);
        });
    }
}

//update existing user info
function update_profile () {
    user.updateProfile({
        displayName: user.displayName,
        photoURL: user.photoURL
    }).then(function () {
        // Update successful.
        console.log('update successful')
    }, function (error) {
        // An error happened.
        console.log('update ERROR')
    });
}

//set user email
function set_email () {
    user.updateEmail("user@example.com").then(function () {
        // email setup successful
        console.log('email setup successful')
    }, function (error) {
        // An error occured.
        console.log('email setup ERROR')
    });
}

//verify through email
function verify_email() {
    user.sendEmailVerification().then(function () {
        // Email sent.
        console.log('verification sent')
    }, function (error) {
        // An error occured.
        console.log('verification ERROR')
    });
}

// set user password
function set_password() {
    var newPassword = getASecureRandomPassword();

    user.updatePassword(newPassword).then(function () {
        // password was set.
        console.log('new password set')
    }, function (error) {
        // An error occured.
        console.log('password not set ERROR')
    });
}

//password reset through email
function reset_password() {
    var auth = firebase.auth();
    var emailAddress = "user@example.com";

    auth.sendPasswordResetEmail(emailAddress).then(function () {
        // rest email sent.
        console.log('reset email sent')
    }, function (error) {
        // An error occured.
        console.log('ERROR no email was sent')
    });
}

//delete a user
function delete_user() {
    user.delete().then(function () {
        // User deleted.
        console.log('user was successfuly deleted')
    }, function (error) {
        // An error occured.
        console.log('ERROR user was not deleted')
    });
}
//FIREBASE UI

//FIREBASE WITH GOOGLE





//FIREBASE WITH GOOGLE

