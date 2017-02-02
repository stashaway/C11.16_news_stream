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
/*
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
}*/

var embedPreview = new Preview();
var preview = null;
var previewContent = null;
var timer = null;
var expandBtn = null;
var contractBtn = null;
var closeBtn = null;

function update_preview(parent){
    //console.log(parent);
    //var current_preview_obj = determine_info(parent);
    //console.log(current_preview_obj);
    //$('#preview').show(500).css('overflow', 'visible');
    //$('#preview_thumb').attr("src",current_preview_obj.thumbnail);
    //$('#preview_thumb').on("click", open_modal.bind(parent));
    //$('#preview_category').text(current_preview_obj.category);
    //$('#preview_viewers').text(current_preview_obj.viewers);
    //$('#preview_title').text(current_preview_obj.title.substring(0,35));
    var index = $(parent).attr('data-index');
    var item = main_array[index];
    //embedPreview.stop();
    preview.show();
    embedPreview.play(item);
}

function open_modal(){
    // var current_preview_obj = determine_info(this);
    // $(".live_video").attr("src",current_preview_obj.video);
    // $(".live_chat").attr("src",current_preview_obj.chat);
    // $(".loading").hide();
    // $('.full_screen_header').text(current_preview_obj.title);
    // update_preview(this);
    //var index = $(item).attr('data-index');

    //var top  = window.pageYOffset || document.documentElement.scrollTop;
    //fullscreen.css("top",top);

    // embedFullVideo.play(item,fullscreen,"left");
    // embedFullChat.play(item,fullscreen,"right");
    //fullscreen.show();
    //embedPreview.stop();
    //$('#preview').hide();
}

function close_modal(){
    // var current_preview_obj = determine_info(this);
    // $(".live_video").attr("src",current_preview_obj.video);
    // $(".live_chat").attr("src",current_preview_obj.chat);
    // $(".loading").hide();
    // $('.full_screen_header').text(current_preview_obj.title);
    // update_preview(this);
    //var index = $(item).attr('data-index');
    //embedPreview.stop();
    // embedFullVideo.stop();
    // embedFullChat.stop();
    //fullscreen.hide();
}

function close_preview(){
    embedPreview.stop();
    $('#preview').hide();
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

$(document).ready(function() {
    fullscreen = $("#full-screen");
    // $("#open_full").on("click",function () {
    //     open_modal();
    // });
    // $("#close_full").on("click",function () {
    //     close_modal();
    // });

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

    preview = $('#preview');
    previewContent = $("#preview_content");
    expandBtn = $("#open_full");
    contractBtn = $("#close_full");
    closeBtn = $("#close_preview");

    preview.on('click','#close_preview',close_preview);
    preview.on('click','#open_full',embedPreview.expand.bind(embedPreview));
    preview.on('click','#close_full',embedPreview.contract.bind(embedPreview));
    $("body").on('click','.grid-item',(function(){
        update_preview(this);
    }));

    $("body").on('click','.grid-item-f',(function(){
        update_preview(this);
    }));

    $(window).resize(function () {
        onResize(500,updateFullScreen);
    });

    embedPreview.init();
});
//TODO: account for window resizing
function updateFullScreen() {

}

function onResize(time, callback) {
    //console.log("Resized setting timer");
    if (timer != null) {
        clearTimeout(timer);
    }

    timer = setTimeout(callback,time);
}

function Preview() {
    this.data = null;
    this.iframeVideoElement = null;
    this.iframeChatElement = null;
    this.videoSrc = "";
    this.chatSrc = "";
    this.animationTime = 250;
    this.defaultWidth = 0;
    this.defaultHeight = 0;
    this.expandedBtnGutter = 40;
    this.expanded = false;
}

Preview.prototype.expand = function () {
    //get buttons and hide them
    contractBtn.hide();
    expandBtn.hide();
    closeBtn.hide();
    this.expanded = true;//save state

    //animate position
    this.position(true, function () {
        //show appropriate buttons
        closeBtn.css({transform:"none"});
        contractBtn.show();
        closeBtn.show();
    });
};

Preview.prototype.contract = function () {
    //get buttons and hide them
    contractBtn.hide();
    expandBtn.hide();
    closeBtn.hide();
    this.expanded = false;//save state

    //animate position
    this.position(false, function () {
        //show appropriate buttons
        closeBtn.css({transform:"translate(-50%,-50%)"});
        expandBtn.show();
        closeBtn.show();
    });
};

Preview.prototype.init = function () {
    //get initial size
    this.defaultWidth = preview.width();
    this.defaultHeight = preview.height();
};

Preview.prototype.position = function (full,callback) {
    //get main div and content div and sizes
    var prevWidth = this.defaultWidth, prevHeight = this.defaultHeight;
    var contentWidth = prevWidth, contentHeight = prevHeight, contentLeft = 0;

    if (full) {
        //if fullscreen changes sizes to fullscreen layout
        prevWidth = $(window).width();
        prevHeight = $(window).height();
        contentWidth = prevWidth - this.expandedBtnGutter;
        contentHeight = prevHeight;
        contentLeft = this.expandedBtnGutter;
    }
    //Animate to sizes
    preview.animate({width:prevWidth,height:prevHeight},this.animationTime);
    previewContent.animate({width:contentWidth,height:contentHeight,left:contentLeft},this.animationTime,callback);

    //set up sizes for video and chat and position for chat
    var vWidth = contentWidth,  cWidth = vWidth;
    var vHeight = contentHeight, cHeight = vHeight;
    var top = 0, left = 0;

    if (full) {
        //If fullscreen account for if screen is taller than wide - otherwise use default sizes with chat hidden
        if (contentHeight > contentWidth) {
            //Make video full width at appropriate aspect ratio with chat filling below
            vHeight = vWidth * 0.5625;
            top = vHeight;
            cHeight = contentHeight - top;
        } else {
            //Make video and chat side by side
            vWidth = contentWidth * 0.75;
            left = vWidth;
            cWidth = contentWidth - left;
        }
    }
    //Animate to sizes
    this.iframeVideoElement.animate({width:vWidth,height:vHeight},this.animationTime);
    this.iframeChatElement.animate({width:cWidth,height:cHeight,left:left,top:top},this.animationTime);
};

Preview.prototype.play = function (data) {
    this.stop();

    //Get embed data
    this.data = data;
    this.videoSrc = this.data.source==="twitch" ? this.data.embedVideo :
        this.data.embedVideo+"?&autoplay=1&fs=0&modestbranding=1&playsinline=1&rel=0";
    this.chatSrc = this.data.embedChat;

    //Create iframes - used until preview is close
    this.iframeChatElement = $("<iframe>",
        {frameborder:"0",scrolling:"no",width:this.defaultWidth+"px",height:this.defaultHeight+"px",src:this.chatSrc})
        .css({position: "absolute",display:"inline-block",left:"0",top:"0"});
    previewContent.append(this.iframeChatElement);

    this.iframeVideoElement = $("<iframe>",
        {frameborder:"0",scrolling:"no",width:this.defaultWidth+"px",height:this.defaultHeight+"px",src:this.videoSrc})
        .css({position: "absolute",display:"inline-block",left:"0",top:"0"});
    previewContent.append(this.iframeVideoElement);
};

Preview.prototype.stop = function () {
    //kill iframes to kill videos
    if (this.iframeVideoElement) {
        $(this.iframeVideoElement).remove();
        this.iframeVideoElement = null;
    }
    if (this.iframeChatElement) {
        $(this.iframeChatElement).remove();
        this.iframeChatElement = null;
    }
    //reset to initial state
    this.reset();
};

Preview.prototype.reset = function () {
    //reset divs and buttons
    previewContent.css({width:this.defaultWidth,height:this.defaultHeight,left:"0",top:"0"});
    preview.css({width:this.defaultWidth,height:this.defaultHeight});
    expandBtn.show().css({transform:"translate(-50%,50%"});
    contractBtn.hide();
    closeBtn.show().css({transform:"translate(-50%,-50%)"});
};