$(document).ready(function() {
    first_load = true;
    var config = {
        apiKey: "AIzaSyCkUkWgpUJC7FeS2_w1ueRcLMhSz75Rh9Q",
        authDomain: "streamism-cccb0.firebaseapp.com",
        databaseURL: "https://streamism-cccb0.firebaseio.com",
        storageBucket: "streamism-cccb0.appspot.com",
        messagingSenderId: "582125369559"
    };
    firebase.initializeApp(config);
    var fb_ref = firebase.database();
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    firebase.auth().onAuthStateChanged(function(user) {
        console.log('Prefs at state change: ', preferences);
        if(user){
            $(".firebaseui-container").hide();
            $('.dropdown-button').dropdown('close');
            console.log("User is signed in" , user);
            uid = user.uid;
            fb_ref.ref('users/' + uid).once('value', function(ss){
                var snap = ss.val();
                console.log('Snapshot: ', snap);
                if(!snap){
                    fb_ref.ref('users/' + uid + '/categories').update(preferences);

                } else{
                    preferences = snap.categories;
                    for(var category in preferences){
                        var currentSelector = $("#" + category);
                        if(preferences[category] == false){
                            currentSelector.removeAttr('checked');
                        } else{
                            currentSelector.attr('checked');
                        }
                        currentSelector.change();
                    }
                }
            });
            user.getToken().then(function(accessToken) {
                $("#firebaseui-auth-container").hide();
                $("#sign-out").hide();
                $(".login_status").hide();
                $(".welcome_text").show();
                $(".profile-pic").show();
                $(".welcome_text").text("Welcome " + user.displayName);

                $(".profile-pic").attr("src", user.photoURL).on("click",function(){
                    $("#sign-out").toggle().on("click",function(){
                        firebase.auth().signOut().then(function() {
                            console.log("signed out");
                            uid = null;
                        });
                    });
                })
            });
        } else {
            $(".login_status").show();
            $("#firebaseui-auth-container").hide();
            $("#sign-out").hide();
            $(".welcome_text").hide();
            $(".profile-pic").hide();
            $(".login_status").text("Log In").on("click", function(){
                $("#firebaseui-auth-container").toggle();
            });
            console.log("User is not logged in");
            //firebase config
            var uiConfig = {
                signInFlow: "popup",
                signInSuccessUrl: '#',
                signInOptions: [
                    // Leave the lines as is for the providers you want to offer your users.
                    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    firebase.auth.EmailAuthProvider.PROVIDER_ID
                ]
            };
            // The start method will wait until the DOM is loaded.
            ui.start('#firebaseui-auth-container', uiConfig);
            //end firebase ui
        }
    });
    fb_ref.ref("-KbHuqtKNuu96svHRgjz").on('value', function(snapshot) {
        console.log('on triggered');
        if (first_load === true){
            master_list = snapshot.val();
            buildThumbnails(master_list);
            $grid = $('.grid').imagesLoaded().always( function() {
                setTimeout(function(){
                    $grid.isotope({
                        itemSelector: '.grid-item',
                        masonry: { columnWidth: '.grid-sizer'},
                        stagger: 5,
                        percentPosition: true
                    });
                    $gridFixed.isotope({
                        itemSelector: '.grid-item-f',
                        masonry: { columnWidth: '.grid-sizer-f'},
                        stagger: 5,
                        percentPosition: true
                    });


                },1500);
            $gridFixed = $('.grid-f').imagesLoaded().always( function() {
                setTimeout(function(){
                    // $gridFixed.isotope({
                    //     itemSelector: '.grid-item-f',
                    //     masonry: { columnWidth: '.grid-sizer-f'},
                    //     stagger: 5,
                    //     percentPosition: true
                    // });
                },1500);
            });

            });
            first_load=false;
        } else {
            // alert('update received');
            $('#update_btn').toggle();
            updated_list = snapshot.val();
        }
    });
    applyNavClickHandler(fb_ref);
    $('.large').on('click','.grid-item',(function(){
        update_preview(this);
    }));
    $('#update_btn').click(handleUpdate).toggle();
});

var soundEffect = new Audio('audio/transporter.mp3');
soundEffect.play();

function signOut(){
    firebase.auth().signOut().then(function() {
        console.log("signed out");
        uid = null;
    });
}
function applyNavClickHandler(fb_ref){
    $('.top_nav input:checkbox').change(function() {
        preferences[this.name] = this.checked;
        if (preferences[this.name]===true) {
            $('.'+this.name+':not(.grid-item--large').removeClass('hidden');
        } else {
            $('.'+this.name+':not(.grid-item--large').addClass('hidden');
        }
        $grid.isotope({ filter: '*:not(.hidden)' });
        if(uid){
            console.log('We think user is logged in, so updating prefs on db');
            console.log('UID:', uid);
            console.log('Prefs:', preferences);
            console.log('Prefs after update:', preferences);
            fb_ref.ref("users/" + uid + '/categories').update(preferences);
        }
    });
}
var updated_list = null;
var first_load = true;
var master_list = null;
var preferences = {
    'entertainment': true,
    'gaming': true,
    'life': true,
    'technology': true,
    'news': true,
    'misc': true
};
var uid = null;
var $grid;
var $gridFixed;
function handleUpdate(){
    console.log('update handler called');
    master_list = updated_list;
    $('.large *').remove();
    buildThumbnails(master_list);
    $grid = $('.grid').imagesLoaded().always( function() {
        setTimeout(function(){
            $grid.isotope({
                itemSelector: '.grid-item',
                masonry: { columnWidth: '.grid-sizer'},
                stagger: 5,
                percentPosition: true
            });
        },1500);
    });
    $('#update_btn').toggle();
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function populateArray(cycles, depth) {
    var output_array = [];
    var games_list = master_list['streams'][0]['streams'];
    var entertainment_list = master_list['streams'][1]['streams'];
    var life_list = master_list['streams'][2]['streams'];
    var current_list = master_list['streams'][3]['streams'];
    var tech_list = master_list['streams'][4]['streams'];
    var misc_list = master_list['streams'][5]['streams'];

    for (var i=depth; i<=cycles; i++) {
        var array = [];
        array.push(games_list[i]);
        array.push(entertainment_list[i]);
        array.push(life_list[i]);
        array.push(current_list[i]);
        array.push(tech_list[i]);
        array.push(misc_list[i]);
        shuffle(array);
        output_array = output_array.concat(array);
    }
    // console.log(output_array);
    return output_array.slice()
}

var main_array=[];
function buildThumbnails(){
    main_array = populateArray(36,0);
    // console.log('main array',main_array);
    var featured_object = {
        category: "divider",
        thumbnail: "images/featured.png",
        title: "Featured",
        viewers: null
    };
    // main_array.splice(0,0,featured_object);
    main_array.splice(6,0,featured_object);
    // main_array.splice(53,0,featured_object);
    // main_array.splice(-3);
    // console.log('main array after splice',main_array);
    var new_thumb;
    var new_item;
    var new_img;
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

        if (i<7) {

            new_thumb = main_array[i].thumbnail;
            new_item = $('<div class="grid-item-f grid-item-f--large ' + main_array[i].category + '" data-index=' + i + '>');
            new_img = $('<img src="' + new_thumb + '">');
            new_item.append(new_img);
            $(the_grid).append(new_item);
        }
        else {

            new_thumb = main_array[i].thumbnail;
            new_item = $('<div class="grid-item grid-item--medium ' + main_array[i].category + '" data-index=' + i + '>');
            new_img = $('<img src="' + new_thumb + '">');
            new_item.append(new_img);
            $(the_grid2).append(new_item);
        }

        $('.fixed').append(the_grid);
        $('.medium').append(the_grid2);
    }
    $('.grid').imagesLoaded().always( function() {
        checkImageSize('.grid img');
        checkImageSize('.grid-f img');
    });
    $('#spinner').hide();

}


