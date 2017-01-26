
function openNav() {
    $("#side_nav").toggleClass("open_nav");
}
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
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
    $('#sign_out').hide();
    $('#my-signin2').show();
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

function determine_info (item){
    var current_item=$(item);
    var category_number;
    if (current_item.hasClass('entertainment')){
        category_number=0;
    } else if (current_item.hasClass('news')){
        category_number=2;
    } else if (current_item.hasClass('misc')){
        category_number=5;
    } else if (current_item.hasClass('games')) {
        category_number=0;
    }
    console.log(master_list);
    var index=current_item.attr('data-index');
    var current_item_details = master_list.streams[category_number].streams[index];
    return {
        'index' : index,
        'thumbnail': current_item_details.thumbnail,
        'link' : current_item_details.link,
        'category' : current_item_details.category,
        'channel' : current_item_details.channel,
        'viewers' : current_item_details.viewers,
        'start' : current_item_details.startTime,
        'title' : current_item_details.title
    }
}

function update_preview(parent){
    console.log(parent);
    var current_preview_obj = determine_info(parent);
    console.log(current_preview_obj);
    $('#preview').show(500);
    $('#preview_thumb').attr("src",current_preview_obj.thumbnail);
    $('#preview_category').text(current_preview_obj.category);
    $('#preview_viewers').text(current_preview_obj.viewers);
    $('#preview_title').text(current_preview_obj.title.substring(0,35));
}

function close_preview(){
    $('#preview').hide(500);
}

$(document).ready(function() {
    $('#preview').hide();
    $('#sign_out').click(signOut);
    $('#sign_out').hide();
    if(isUserLoggedIn()){
        $('#sign_out').show();
    }else{
        renderButton();
    }
    $('#preview').on('click','#close_preview',close_preview);
    $('.tooltipped').click(openNav);

});