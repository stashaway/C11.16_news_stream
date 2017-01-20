function openNav() {
    $("#side_nav").toggleClass("open_nav");
}
$('.modal').modal();
function openRightNav() {
    $("#right_side_nav").toggleClass("open_right_nav");
}
var auth2 = null;
function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    auth2 = gapi.auth2.init();
    if (isUserLoggedIn()) {
        var profile = auth2.currentUser.get().getBasicProfile();
        console.log('ID: ' + profile.getId());
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        $('.profile').attr('src', profile.getImageUrl());
    }
    displayLogginState();
}
function onFailure(error) {
    console.log(error);
}
function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}
function signOut() {
    auth2.signOut().then(function () {
        console.log('User signed out.')
    });
    $('#sign_out').toggle();
    $('#my-signin2').toggle();
}
function isUserLoggedIn(){
    if(auth2){
        return auth2.isSignedIn.get()!=false;
    }
    return false;
}
function displayLogginState(){
    if (isUserLoggedIn()) {
        $('#sign_out').show();
        $('#my-signin2').hide();
    } else {
        $('#sign_out').hide();
        $('#my-signin2').show();
    }
}
$(document).ready(function() {
    if(isUserLoggedIn()){
        $('#sign_out').click(signOut).hide();
    }else{
        renderButton();
        $('#sign_out').click(signOut).show();

    }
});