$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyCkUkWgpUJC7FeS2_w1ueRcLMhSz75Rh9Q",
        authDomain: "streamism-cccb0.firebaseapp.com",
        databaseURL: "https://streamism-cccb0.firebaseio.com",
        storageBucket: "streamism-cccb0.appspot.com",
        messagingSenderId: "582125369559"
    };
    firebase.initializeApp(config);
    var fb_ref = firebase.database();
    fb_ref.ref().on('value', function(snapshot) {
        var snapshot_obj = snapshot.val();
        for (var data_obj in snapshot_obj) {
            buildThumbnails(snapshot_obj[data_obj]);
            $grid1 = $('.grid-l').imagesLoaded( function() {
                $grid1.isotope({
                    itemSelector: '.grid-item-l',
                    masonry: {columnWidth: '.grid-sizer-l'},
                    stagger: 30,
                    percentPosition: true
                });
            });
            $grid2 = $('.grid-m').imagesLoaded( function() {
                $grid2.isotope({
                    itemSelector: '.grid-item-m',
                    masonry: {columnWidth: '.grid-sizer-m'},
                    stagger: 30,
                    percentPosition: true
                });
            });
            $grid3 = $('.grid-s').imagesLoaded( function() {
                $grid3.isotope({
                    itemSelector: '.grid-item-s',
                    masonry: {columnWidth: '.grid-sizer-s'},
                    stagger: 30,
                    percentPosition: true
                });
            });
            $('.side_nav input:checkbox').change(function() {
                // this will contain a reference to the checkbox
                console.log(this.name);
                $('.'+this.name).toggleClass('hidden');
                $grid1.isotope({ filter: '*:not(.hidden)' });
                $grid2.isotope({ filter: '*:not(.hidden)' });
                $grid3.isotope({ filter: '*:not(.hidden)' });
            });
        }
    });
});
function buildThumbnails(fullList){
    var games_list = fullList['streams'][0]['streams'];
    var entertainment_list = fullList['streams'][1]['streams'];
    var life_list = fullList['streams'][2]['streams'];
    var current_list = fullList['streams'][3]['streams'];
    for (var i=0; i<1; i++){
        var new_e_thumb = entertainment_list[i].thumbnail;
        var new_e_item = $('<div class="grid-item-l grid-item--large entertainment">');
        var new_e_img = $('<img src="' + new_e_thumb + '">');
        new_e_item.append(new_e_img);
        $('.grid-l').append(new_e_item);
        var new_l_thumb = life_list[i].thumbnail;
        var new_l_item = $('<div class="grid-item-l grid-item--large news">');
        var new_l_img = $('<img src="' + new_l_thumb + '">');
        new_l_item.append(new_l_img);
        $('.grid-l').append(new_l_item);
        var new_g_thumb = games_list[i].thumbnail;
        var new_g_item = $('<div class="grid-item-l grid-item--large games">');
        var new_g_img = $('<img src="' + new_g_thumb + '">');
        new_g_item.append(new_g_img);
        $('.grid-l').append(new_g_item);
        var new_c_thumb = current_list[i].thumbnail;
        var new_c_item = $('<div class="grid-item-l grid-item--large misc">');
        var new_c_img = $('<img src="' + new_c_thumb + '">');
        new_c_item.append(new_c_img);
        $('.grid-l').append(new_c_item);

    }
    for (var i=4; i<13; i++){
        var new_e_thumb = entertainment_list[i].thumbnail;
        var new_e_item = $('<div class="grid-item-m grid-item--medium entertainment">');
        var new_e_img = $('<img src="' + new_e_thumb + '">');
        new_e_item.append(new_e_img);
        $('.grid-m').append(new_e_item);
        var new_l_thumb = life_list[i].thumbnail;
        var new_l_item = $('<div class="grid-item-m grid-item--medium news">');
        var new_l_img = $('<img src="' + new_l_thumb + '">');
        new_l_item.append(new_l_img);
        $('.grid-m').append(new_l_item);
        var new_g_thumb = games_list[i].thumbnail;
        var new_g_item = $('<div class="grid-item-m grid-item--medium games">');
        var new_g_img = $('<img src="' + new_g_thumb + '">');
        new_g_item.append(new_g_img);
        $('.grid-m').append(new_g_item);
        var new_c_thumb = current_list[i].thumbnail;
        var new_c_item = $('<div class="grid-item-m grid-item--medium misc">');
        var new_c_img = $('<img src="' + new_c_thumb + '">');
        new_c_item.append(new_c_img);
        $('.grid-m').append(new_c_item);
    }
    for (var i=13; i<33; i++){
        var new_e_thumb = entertainment_list[i].thumbnail;
        var new_e_item = $('<div class="grid-item-s grid-item--small entertainment">');
        var new_e_img = $('<img src="' + new_e_thumb + '">');
        new_e_item.append(new_e_img);
        $('.grid-s').append(new_e_item);
        var new_l_thumb = life_list[i].thumbnail;
        var new_l_item = $('<div class="grid-item-s grid-item--small news">');
        var new_l_img = $('<img src="' + new_l_thumb + '">');
        new_l_item.append(new_l_img);
        $('.grid-s').append(new_l_item);
        var new_g_thumb = games_list[i].thumbnail;
        var new_g_item = $('<div class="grid-item-s grid-item--small games">');
        var new_g_img = $('<img src="' + new_g_thumb + '">');
        new_g_item.append(new_g_img);
        $('.grid-s').append(new_g_item);
        var new_c_thumb = current_list[i].thumbnail;
        var new_c_item = $('<div class="grid-item-s grid-item--small misc">');
        var new_c_img = $('<img src="' + new_c_thumb + '">');
        new_c_item.append(new_c_img);
        $('.grid-s').append(new_c_item);
    }
}