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
var auth2=null;

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
        $('.circle').attr('src', profile.getImageUrl());
        $('.circle').show();

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
    $('.circle').hide();
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
        $('.circle').show();
        $('#my-signin2').hide();
    } else {
        $('#sign_out').hide();
        $('.circle').hide();
        $('#my-signin2').show();
    }
}

function determine_info (item){
    var current_item=$(item);
    var category_number;
    if (current_item.hasClass('games')){
        category_number = 0;
    } else if (current_item.hasClass('entertainment')){
        category_number = 1;
    } else if (current_item.hasClass('life')){
        category_number = 2;
    } else if (current_item.hasClass('news')) {
        category_number = 3;
    } else if (current_item.hasClass('technology')) {
        category_number = 4;
    } else if (current_item.hasClass('misc')) {
        category_number = 5;
    } else {
        category_number = 0;
    }
    console.log(master_list);
    var index = current_item.attr('data-index');
    var current_item_details = master_list.streams[category_number].streams[index];
    return {
        'index' : index,
        'thumbnail': current_item_details.thumbnail,
        'link' : current_item_details.link,
        'category' : current_item_details.category,
        'channel' : current_item_details.channel,
        'viewers' : current_item_details.viewers,
        'start' : current_item_details.startTime,
        'title' : current_item_details.title,
        'id' : current_item_details.id,
        'chat': current_item_details.embedChat,
        'video': current_item_details.embedVideo,
        'source': current_item.source
    }
}

function update_preview(parent){
    console.log(parent);
    var current_preview_obj = determine_info(parent);
    console.log(current_preview_obj);
    $('#preview').show(500);
    $('#preview_thumb').attr("src",current_preview_obj.thumbnail);
    $('#preview_thumb').on("click", open_modal.bind(parent));
    $('#preview_category').text(current_preview_obj.category);
    $('#preview_viewers').text(current_preview_obj.viewers);
    $('#preview_title').text(current_preview_obj.title.substring(0,35));
}

function open_modal(){
    var current_preview_obj = determine_info(this);
    $(".live_video").attr("src",current_preview_obj.video);
    $(".live_chat").attr("src",current_preview_obj.chat);
    $(".loading").hide();
    $('.full_screen_header').text(current_preview_obj.title);
    update_preview(this);
}

function close_preview(){
    $('#preview').hide(500);
}
function end_video(){
    $(".live_video").attr("src", " ");
}


$(document).ready(function() {
    $(".button-collapse").sideNav();
    $('#modal1').modal();
    $(".dropdown-button").dropdown();
    $('.modal').modal({
            complete: end_video
        }
    );
    $('#modal2').modal();
    $('#preview').hide();
    $('#sign_out').click(signOut);
    $('#sign_out').hide();
    if(isUserLoggedIn() === true){
        $('#sign_out').show();
    }else{
        renderButton();
    }
    $('#preview').on('click','#close_preview',close_preview);
    $('.tooltipped').click(openNav);

});