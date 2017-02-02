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
    // var current_item=$(item);
    // var category_number;
    // if (current_item.hasClass('games')){
    //     category_number = 0;
    // } else if (current_item.hasClass('entertainment')){
    //     category_number = 1;
    // } else if (current_item.hasClass('life')){
    //     category_number = 2;
    // } else if (current_item.hasClass('news')) {
    //     category_number = 3;
    // } else if (current_item.hasClass('technology')) {
    //     category_number = 4;
    // } else if (current_item.hasClass('misc')) {
    //     category_number = 5;
    // } else {
    //     category_number = 0;
    // }
    // console.log(master_list);
    var index = $(item).attr('data-index');
    var current_item_details = master_list[index];
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
        'source': item.source
    }
}
var embedPreview = new Embed();
var embedFullVideo = new Embed();
var embedFullChat = new Embed();
var fullscreen = null;
var item = null;

function update_preview(parent){
    //console.log(parent);
    //var current_preview_obj = determine_info(parent);
    //console.log(current_preview_obj);
    $('#preview').show(500);
    //$('#preview_thumb').attr("src",current_preview_obj.thumbnail);
    //$('#preview_thumb').on("click", open_modal.bind(parent));
    //$('#preview_category').text(current_preview_obj.category);
    //$('#preview_viewers').text(current_preview_obj.viewers);
    //$('#preview_title').text(current_preview_obj.title.substring(0,35));
}

function open_modal(){
    // var current_preview_obj = determine_info(this);
    // $(".live_video").attr("src",current_preview_obj.video);
    // $(".live_chat").attr("src",current_preview_obj.chat);
    // $(".loading").hide();
    // $('.full_screen_header').text(current_preview_obj.title);
    // update_preview(this);
    //var index = $(item).attr('data-index');
    embedPreview.stop();
    embedFullVideo.play(item,fullscreen,"left");
    embedFullChat.play(item,fullscreen,"right");
    fullscreen.show();
    $('#preview').hide();
}

function close_modal(){
    // var current_preview_obj = determine_info(this);
    // $(".live_video").attr("src",current_preview_obj.video);
    // $(".live_chat").attr("src",current_preview_obj.chat);
    // $(".loading").hide();
    // $('.full_screen_header').text(current_preview_obj.title);
    // update_preview(this);
    //var index = $(item).attr('data-index');
    embedPreview.stop();
    embedFullVideo.stop();
    embedFullChat.stop();
    fullscreen.hide();
}

function close_preview(){
    $('#preview').hide(500);
}
function end_video(){
    $(".live_video").attr("src", " ");
}

function checkImageSize(selector){
    $(selector).each(function() {
        var height = this.naturalHeight;
        var width = this.naturalWidth;
        if (width==120 && height == 90){
            $(this).attr("src","images/noimage.png");
        }
    });
}

function change_veiw(){
    $('#main').toggle();
    $('#sunburst_sequence_container').toggle();

}

function path_click(){
    console.log('enbigginate!');
    $('#viewport').toggleClass('bigport');
    $('#viewport').toggleClass('viewport');
    var current_preview_obj = determine_info(this);
    console.log(current_preview_obj);
    $(".live_video").attr("src",current_preview_obj.video);
}

$(document).ready(function() {
// <<<<<<< HEAD
    $('path').click(path_click);
    // $('path').css('color', d.data.category);
    $('#sunburst_sequence_container').hide();
    $('#change_view').click(change_veiw);
// =======
    fullscreen = $("#full-screen");
    $("#open_full").on("click",function () {
        open_modal();
    });
    $("#close_full").on("click",function () {
        close_modal();
    });

    $('#modal1').modal();
    $(".dropdown-button").dropdown({
    });
    $('.modal').modal({
            complete: end_video
        }
    );

    $('#modal2').modal();
    $('#sign_out').click(signOut);
    $('#sign_out').hide();
    if(isUserLoggedIn() === true){
        $('#sign_out').show();
    }else{
        renderButton();
    }

    $('.tooltipped').click(openNav);

    //Get preview - on grid item click in grid -> show preview
    var preview = $('#preview');
    preview.hide();
    preview.on('click','#close_preview',close_preview);
    $(".panel").on('click','.grid-item',(function(){
        //update_preview(this);
        var index = $(this).attr('data-index');
        item = master_list[index];
        embedPreview.play(item, preview);
        preview.show(500);
    }));
});

function Embed() {
    this.data = null;
    this.parentElement = null;
    this.iframeElement = null;
    this.width = 0;
    this.height = 0;
    this.src = "";

    /*
    * category:  "gaming"
     channel:  "Starladder1"
     embedChat: "https://www.twitch.tv/starladder1/chat"
     embedVideo: "http://player.twitch.tv/?channel=starladder1"
     id: "starladder1"
     link:  "https://www.twitch.tv/starladder1"
     source: "twitch"
     startTime:  "2017-01-31T14:29:08Z"
     thumbnail:  "https://static-cdn.jtvnw.net/previews-ttv/live_..."
     title:  "Navi vs Vega Squadron [BO2] | SL I-League StarS..."
     viewers:  93519
     *
    * */
}

Embed.prototype.play = function (data, parent, type) {
    this.stop();

    this.data = data;
    this.parentElement = $(parent);
    var src = this.data.source==="twitch" ? this.data.embedVideo :
        this.data.embedVideo+"?&autoplay=1&fs=0&modestbranding=1&playsinline=1&rel=0";

    var width = this.parentElement.width();
    var height = this.parentElement.height();
    var top = 0;
    var left = 0;

    if (type) {
        if (type=="left") {
            if (this.parentElement.height() > this.parentElement.width()) {
                height = width * 0.5625;
            } else {
                width = this.parentElement.width() *0.75;
            }
        } else if (type=="right") {
            if (this.parentElement.height() > this.parentElement.width()) {
                top = width * 0.5625;
                height = this.parentElement.height() - top;
            } else {
                left = this.parentElement.width() *0.75;
                width = this.parentElement.width() - left;
            }
            src = this.data.embedChat;
        }
    }

    var params = {
        id:"preview_iframe",
        frameborder:"0",
        scrolling:"no",
        width:width,
        height:height,
        src:src
    };

    var style = {
        position: "absolute",
        left: left,
        top: top,
        display:"inline-block"
    };

    this.iframeElement = $("<iframe>",params).css(style);
    $(this.parentElement).append(this.iframeElement);
};

Embed.prototype.stop = function () {
    if (this.iframeElement) {
        $(this.iframeElement).remove();
        this.iframeElement = null;
    }
};