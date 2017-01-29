$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyCkUkWgpUJC7FeS2_w1ueRcLMhSz75Rh9Q",
        authDomain: "streamism-cccb0.firebaseapp.com",
        databaseURL: "https://streamism-cccb0.firebaseio.com",
        storageBucket: "streamism-cccb0.appspot.com",
        messagingSenderId: "582125369559"
    };
    firebase.initializeApp(config);
    firebase.auth().signInAnonymously();
    var fb_ref = firebase.database();
    fb_ref.ref("-KbHuqtKNuu96svHRgjz").on('value', function(snapshot) {
        var snapshot_obj = snapshot.val();
        //for (var data_obj in snapshot_obj) {
            master_list=snapshot_obj;//[data_obj];
            buildThumbnails(master_list);

            $grid = $('.grid').imagesLoaded( function() {
                checkImageSize('.grid img');
                $grid.isotope({
                    itemSelector: '.grid-item',
                    masonry: { columnWidth: '.grid-sizer'},
                    stagger: 30,
                    percentPosition: true
                });
            });
            $('.top_nav input:checkbox').change(function() {
                // this will contain a reference to the checkbox
                console.log(this.name);
                // $grid1.isotope('hideItemElements', $('.'+this.name));

                $('.'+this.name).toggleClass('hidden');
                $grid.isotope({ filter: '*:not(.hidden)' });
            });
        //}
    });
    $('.large').on('click','.grid-item-l',(function(){
        update_preview(this);
    }));

    $('.medium').on('click','.grid-item-m',(function(){
        update_preview(this);
    }));

    $('.small').on('click','.grid-item-s',(function(){
        update_preview(this);
    }));
});

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

var master_list=null;

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
    console.log(output_array);
    return output_array;
}

var top_count = null;
var mid_count = null;
var bottom_count = null;

function buildThumbnails(){
    var main_array = populateArray(36,0);
    var new_thumb;
    var new_item;
    var new_img;
    for (var i=0; i<main_array.length; i++){
        if (i<3) {
            new_thumb = main_array[i].thumbnail;
            new_item = $('<div class="grid-item grid-item--large ' + main_array[i].category + '" data-index=' + i + '>');
            new_img = $('<img src="' + new_thumb + '">');
            new_item.append(new_img);
            $('.grid').append(new_item);
        }
        else if (i<30) {
            new_thumb = main_array[i].thumbnail;
            new_item = $('<div class="grid-item grid-item--medium ' + main_array[i].category + '" data-index=' + i + '>');
            new_img = $('<img src="' + new_thumb + '">');
            new_item.append(new_img);
            $('.grid').append(new_item);
        } else {
            new_thumb = main_array[i].thumbnail;
            new_item = $('<div class="grid-item grid-item--small ' + main_array[i].category + '" data-index=' + i + '>');
            new_img = $('<img src="' + new_thumb + '">');
            new_item.append(new_img);
            $('.grid').append(new_item);

        }
    }
    $('#spinner').hide();
}


