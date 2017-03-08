/**
 * Global variables
 */
var updated_list = null;
var first_load = true;
var master_list = null;
var uid = null;
var fb_ref;
var $grid;
var $gridFixed;
var clicked = false;
var main_array = [];
var update_sound = new Audio('audio/update_sound.mp3');
var shared_sound = new Audio('audio/shared.mp3');
var update_ready = false;
var urlGetVideo = null;
var preferences = {
    'entertainment': true,
    'gaming': true,
    'people': true,
    'sports': true,
    'news': true,
    'misc': true
};

$(document).ready(function() {

    $('#sunburst_sequence_container').hide();
    $('#change_view').change(change_view);
    $(".cat_menu").on("click",function(){
        $(".logo_container").toggle();
        $(".valign-wrapper").toggle();
        $("#update_btn_small").hide();
        $('.login_status').toggle();
        // update button checker
        if ($('.logo_container').css('display')!='none' && update_ready==true) {
            $('#update_btn_small').show();
        }
        if ($('.profile-pic').css('display')!='none') {
            $('.login_status').hide();
        }
    });
    $('.modal').modal();
    $('.collapsible').collapsible();
    first_load = true;

// Initialize firebase and set listeners
    var config = {
        apiKey: "AIzaSyCkUkWgpUJC7FeS2_w1ueRcLMhSz75Rh9Q",
        authDomain: "streamism-cccb0.firebaseapp.com",
        databaseURL: "https://streamism-cccb0.firebaseio.com",
        storageBucket: "streamism-cccb0.appspot.com",
        messagingSenderId: "582125369559"
    };
    firebase.initializeApp(config);
    fb_ref = firebase.database();
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    firebase.auth().onAuthStateChanged(function(user) {
        // console.log('Prefs at state change: ', preferences);
        if(user){
            $(".firebaseui-container").hide();
            $('.dropdown-button').dropdown('close');
            uid = user.uid;
            fb_ref.ref("users/" + uid).on('value', function(snapshot) {
                userWatchList = snapshot.val().watchList;
                if(userWatchList !== null && main_array.length > 0){
                    find_watched_videos()
                }
            });
            fb_ref.ref('users/' + uid).once('value', function(ss){
                snap = ss.val();
                if(!snap){
                    fb_ref.ref('users/' + uid + '/categories').update(preferences);
                } else{
                    preferences = snap.categories;
                    conformDomElements();
                }
            });
            user.getToken().then(function(accessToken){
                $(".welcome_text").text("Welcome " + user.displayName + "!");
                sign_in_show_element();
                if(user.photoURL !== null){
                    $(".profile-pic").attr("src", user.photoURL);
                }else{
                    $(".profile-pic").attr("src", "images/defaultuser.png");
                }
            })
        } else {
            sign_out_element();
            $(".login_status").text("Log In");
            var uiConfig = {
                signInFlow: "popup",
                signInSuccessUrl: '#',
                signInOptions: [
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID
                ]
            };
            ui.start('#firebaseui-auth-container', uiConfig);
        }
    }, function(error){
            console.log('A Firebase error occured- ',error);
        }
    );
    fb_ref.ref("-KbHuqtKNuu96svHRgjz").on('value', function(snapshot) {
        // console.log('on value triggered');
        $('#spinner').show();
        if (first_load === true){           // First time this is triggered, build the DOM with no prompt
            master_list = snapshot.val();
            createVisualization(master_list);
            buildThumbnails(master_list);
            initializeGrids();
            first_load=false;
            if (urlGetVideo) {
                for (var i=0; i<main_array.length; i++){
                    if (urlGetVideo == main_array[i].id) { //If a shared url was passed in and still exists, play it!
                        var toast_text = "Welcome to Streamism.tv!<br>Here's your shared video.";
                        Materialize.toast(toast_text, 4000, "rounded toasty");
                        shared_sound.play();
                        embedPreview.play(main_array[i], true);

                    }
                }
            }
        } else {                            // Every other time, show update notification and wait
            $('#update_btn').show();
            $('#update_btn_small').show();
            update_sound.play();
            var toast_text = "Click the &nbsp;<i class='fa fa-refresh' aria-hidden='true'></i>&nbsp; button &nbsp;<i class='fa fa-arrow-up'' aria-hidden='true'></i>&nbsp; to update streams";
            Materialize.toast(toast_text, 4000, "rounded toasty");
            updated_list = snapshot.val();
            update_ready = true;
            $('#spinner').hide();
        }
        if(userWatchList.length > 0 && main_array.length > 0){
            find_watched_videos();
        }

    });

    var body = $('body');
    body.on("click touchend",".login_status", function(event){
        stopPropagation(event);
        $("#firebaseui-auth-container").toggle();
    });

    body.on("click touchend", "#sign-out", function(event){
        stopPropagation(event);
        firebase.auth().signOut().then(function() {
            uid = null;
        });
    });

    body.on("click touchend",".profile-pic",function(event) {
        stopPropagation(event);
        $(".login_menu").toggleClass("hide");
    });

    body.on("click touchend","#main",function(event) {
        event.stopPropagation();
        if ($('.login_menu').css('display')!='none'){
            $(".login_menu").addClass("hide");
        }
    });

    applyNavClickHandler(fb_ref);
    $('#update_btn').click(handleUpdate).hide();
    $('#update_btn_small').on('click touchend',handleUpdate).hide();
    urlGetVideo = getUrlVars()['shared'];
});

/**
 * Replaces YouTube's broken link img with our custom image to maintain aspect ratio.
 * @param selector
 */
function checkImageSize(selector){
    $(selector).each(function() {
        var height = this.naturalHeight;
        var width = this.naturalWidth;
        if (width==120 && height == 90){
            $(this).attr("src","images/noimage.png");
        }
    });
}

/**
 * A helper function to stop propogation of click events for delegated handlers
 * @param e - the event to be affected
 */
function stopPropagation(e){
    e.stopPropagation();
    e.preventDefault();
}

/**
 * Toggles between the thumbnail view and the data view
 */
function change_view(){
    $('#main').toggle();
    $('#sunburst_sequence_container').toggle();
    conformDomElements();
}

/**
 * Returns the query string to determine if a shared video link was passed in
 * @returns {Array}
 */
function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

/**
 *
 */
function sign_in_show_element(){
    $("#firebaseui-auth-container").hide();
    $(".login_status").css("display", "none");
    $(".welcome_text").show();
    $(".profile-pic").show();
}

/**
 *
 */
function sign_out_element(){
    $(".login_status").show();
    $("#firebaseui-auth-container").hide();
    $(".login_menu").addClass("hide");
    $(".welcome_text").hide();
    $(".profile-pic").hide();
}

/**
 * Ensures that the mobile/desktop category checkboxes remain in sync.
 */
function conformDomElements(){
    for(var category in preferences){
        var currentSelector = $("#" + category);
        var smallSelector = $("#" + category + "_sm");
        if(preferences[category] == false){
            currentSelector.removeAttr('checked');
            smallSelector.removeAttr('checked');
        } else{
            currentSelector.attr('checked');
            smallSelector.attr('checked');
        }
        currentSelector.change();
    }
}

/**
 * Version of the shuffle function that doesn't limit results but instead returns every video we have. Can be substituted for
 * populateArray function call in buildThumbnails.
 * @param snapshot
 * @returns {Array}
 */
function fullShuffle(snapshot) {
    var data = [];
    var max = 0;
    var filtered = [];
    for (var i in snapshot.streams) {
        if (snapshot.streams.hasOwnProperty(i)) {
            var cat = snapshot.streams[i];
            data.push(cat);
            if (cat.streams.length > max) max = cat.streams.length;
        }
    }

    for (var j = 0; j < max; j++) {
        var sub = [];

        for (var k = 0; k < data.length; k++) {
            var category = data[k];
            var stream = category.streams[j];
            if (stream) {
                sub.push(stream);
            }
        }

        if (sub.length > 0) {
            sub.sort(function(){return 0.5 - Math.random()});
            filtered = filtered.concat(sub);
        }
    }

    return filtered;
}

/**
 * Takes in an array, shuffles the order and returns it.
 * @param array
 * @returns {*}
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/**
 * Returns the array that will be used to populate the dom. Shuffles each group by viewership. ie: Shuffles the 6 with highest
 * viewership, shuffles the 6 with 2nd highest, etc..
 * @param cycles - How many times to run
 * @param depth - How deep in the array to begin (useful for populating multiple divs with no repetition)
 * @returns {Array.<*>}
 */
function populateArray(cycles, depth) {
    var output_array = [];
    var games_list = master_list['streams'][0]['streams'];
    var entertainment_list = master_list['streams'][1]['streams'];
    var people_list = master_list['streams'][2]['streams'];
    var current_list = master_list['streams'][3]['streams'];
    var tech_list = master_list['streams'][4]['streams'];
    var misc_list = master_list['streams'][5]['streams'];

    for (var i=depth; i<=cycles; i++) {
        var array = [];
        array.push(games_list[i]);
        array.push(entertainment_list[i]);
        array.push(people_list[i]);
        array.push(current_list[i]);
        array.push(tech_list[i]);
        array.push(misc_list[i]);
        shuffle(array);
        output_array = output_array.concat(array);
    }
    return output_array.slice()
}

function setPreferences(pref) {
    for (var key in pref) {
        preferences[key] = pref[key];
        if (preferences[key] === true) {
            $('.medium .' + key).removeClass('hidden');
            $('#' + key + '_sm').prop('checked',true);
            $('#' + key).prop('checked',true);
        } else {
            $('.medium .' + key).addClass('hidden');
            $('#' + key + '_sm').prop('checked',false);
            $('#' + key).prop('checked',false);
        }
    }

    $grid.isotope({ filter: '*:not(.hidden)' });
    $gridFixed.isotope ({ filter: '*' });   // fix to keep fixed div alive if update done while on data view

    if(uid){
        fb_ref.ref("users/" + uid + '/categories').update(preferences);
    }

    createVisualization(master_list);
}

function getPreferences() {
    return preferences;
}

function applyNavClickHandler(fb_ref){
    $('.top_nav input:checkbox').change(function() {
        /*preferences[this.name] = this.checked;
        if (preferences[this.name] === true) {
            $('.medium .' + this.name).removeClass('hidden');
        } else {
            $('.medium .' + this.name).addClass('hidden');
        }
        if(this.checked) {
            $('#' + this.name + '_sm').attr('checked');
            $('#' + this.name).attr('checked');
        }
        else if (!this.checked) {
            $('#' + this.name + '_sm').removeAttr('checked');
            $('#' + this.name).removeAttr('checked');
        }
        createVisualization(master_list);*/
        var obj = {};
        obj[this.name] = this.checked;
        setPreferences(obj);

    });
    applySmallClickHandler();
}

/**
 * Helper function to set up click handlers for mobile version of category filters
 */
function applySmallClickHandler(){
    $('#responsive_nav input:checkbox').change(function(){
        $("#"+ this.name).trigger("click");
    })
}

/**
 * Called when the user chooses to process updates. Rebuilds the main data objects are rebuilds the dom with updated info
 */
function handleUpdate(){
    $('#spinner').show();
    master_list = updated_list;
    $('.panel *').remove();
    buildThumbnails(master_list);
    createVisualization(master_list);
    initializeGrids();
    conformDomElements();
    $('#update_btn').hide();
    $('#update_btn_small').hide();
    update_ready = false;
}

/**
 * Initializes the Isotope/Masonry Grids.
 */
function initializeGrids(){
    $grid = $('.grid');
    $gridFixed = $('.grid-f');
    $grid.imagesLoaded().always( function() {
        $grid.isotope({
            itemSelector: '.grid-item',
            masonry: { columnWidth: '.grid-sizer'},
            stagger: 5,
            percentPosition: true
        });
    });
    $gridFixed.imagesLoaded().always( function() {
        $gridFixed.isotope({
            itemSelector: '.grid-item-f',
            masonry: { columnWidth: '.grid-sizer-f'},
            stagger: 5,
            percentPosition: true
        });
    });
    $('#spinner').hide();
}

/**
 * Populates the DOM.
 */
function buildThumbnails(){
    main_array = populateArray(46,0);             //Curated list
    // main_array = fullShuffle(master_list);  //Full list
    var featured_title;
    var new_thumb;
    var new_item;
    var new_img;
    var new_chip;
    var new_fig;
    var new_title;
    var new_channel;
    var hover_div;
    var view_count;
    var source;
    var source_icon;

    var the_grid = $('<div>',{
        class: 'grid-f'
    });

    var sizer=$('<div>',{
        class: 'grid-sizer-f'
    });

    $(the_grid).append(sizer);

    var the_grid2 = $('<div>',{
        class: 'grid'
    });

    var sizer2=$('<div>',{
        class: 'grid-sizer'
    });

    $(the_grid2).append(sizer2);

    for (var i=0; i<main_array.length; i++){
        new_thumb = main_array[i].thumbnail;
        if(i<6){
            new_item = $('<div class="grid-item-f grid-item-f--large ' + main_array[i].category + '" data-index=' + i + '>');
            featured_title = $("<p class='featured_title hover_effect'>Featured Stream in " + main_array[i].category  + "</p>");
            new_item.append(featured_title);
        } else {
            new_item = $('<div class="grid-item grid-item--medium ' + main_array[i].category + '" data-index=' + i + '>');
        }
        new_img = $('<img src="' + new_thumb + '">');

        hover_div = $('<div class="hover_effect">');
        hover_div.addClass(main_array[i].category);                     // add category for filtering
        new_chip = $('<div class="chip hide-on-med-and-down">');
        new_fig = $('<div class="figcaption">');
        new_title = $('<p>');
        new_channel = $('<p>');
        view_count = $('<p class="view_count">Viewer Count</p>');
        if (main_array[i].source == 'twitch') {
            source_icon = '<i class="fa fa-twitch" aria-hidden="true"></i>';
        } else {
            source_icon = '<i class="fa fa-youtube-play" aria-hidden="true" style="font-size: 1.3em; padding-right: 2px;"></i>';
        }
        source = $('<p class='+(i<6 ? 'source_icon-f' : 'source_icon-m') +'>' + source_icon + '</p>');
        new_chip.html(source_icon + '&nbsp' + main_array[i].viewers);
        new_chip.addClass(main_array[i].category);
        new_title.text(main_array[i].title).addClass("video_title");
        new_channel.text(main_array[i].channel).addClass("channel_title");
        new_fig.append(new_channel);
        new_fig.append(new_title);
        new_fig.append(view_count);
        hover_div.append(new_fig);
        new_item.append(new_chip);
        new_item.append(new_img);
        new_item.append(hover_div);
        if (i<6){                                   // The first 6 items are the features videos, put then in separate div
            $(the_grid).append(new_item);
        } else {
            $(the_grid2).append(new_item);
        }
    }
    $('.fixed').append(the_grid);
    $('.medium').append(the_grid2);

    $('.grid').imagesLoaded().always( function() {
        checkImageSize('.grid img');
        checkImageSize('.grid-f img');
    });

}
