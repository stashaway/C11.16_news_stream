var data = null;
var cats = {
    gaming:true,
    entertainment:true,
    news:true,
    technology:true,
    life:true,
    misc:true
};

$(document).ready(function() {
    var config = {
        apiKey: "AIzaSyCkUkWgpUJC7FeS2_w1ueRcLMhSz75Rh9Q",
        authDomain: "streamism-cccb0.firebaseapp.com",
        databaseURL: "https://streamism-cccb0.firebaseio.com",
        storageBucket: "streamism-cccb0.appspot.com",
        messagingSenderId: "582125369559"
    };
    firebase.initializeApp(config);
    // firebase.auth().onAuthStateChanged(function(user) {
    //     if(user) {
    //         console.log(user);
    //         firebase.auth().signOut().then(function() {
    //             console.log("signed out");
    //         })
    //     } else {
    //         //start firebase ui
    //         // FirebaseUI config.
    //         var uiConfig = {
    //             signInFlow: "popup",
    //             signInSuccessUrl: 'localhost:8888',
    //             signInOptions: [
    //                 // Leave the lines as is for the providers you want to offer your users.
    //                 firebase.auth.GoogleAuthProvider.PROVIDER_ID
    //             ],
    //             // Terms of service url.
    //             tosUrl: 'localhost:8888'
    //         };
    //
    //         // Initialize the FirebaseUI Widget using Firebase.
    //         var ui = new firebaseui.auth.AuthUI(firebase.auth());
    //         // The start method will wait until the DOM is loaded.
    //         ui.start('#firebaseui-auth-container', uiConfig);
    //         //end firebase ui
    //     }
    // });
    firebase.auth().signInAnonymously();
    var fb_ref = firebase.database();


    fb_ref.ref("-KbHuqtKNuu96svHRgjz").on('value', function(snapshot) {
        data = snapshot.val();
        //for (var data_obj in snapshot_obj) {
        //master_list=snapshot_obj;//[data_obj];
        //console.log(master_list);

        //buildThumbnails(master_list);
        var filtered = shuffle(data);
        go(filtered);

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

        $('.top_nav input:checkbox').change(function() {
            // this will contain a reference to the checkbox
            // console.log(this.name);
            // $grid1.isotope('hideItemElements', $('.'+this.name));

            //$('.'+this.name+':not(.grid-item--large').toggleClass('hidden');
            //$grid.isotope({ filter: '*:not(.hidden)' });
            //redistributeGrid();
            cats[this.name] = !cats[this.name];
            var filtered = shuffle(data);
            go(filtered);
        });
        //}
    });
    $('.large').on('click','.grid-item',(function(){
        update_preview(this);
    }));
    $('#spinner').hide();
});


function shuffle(snapshot) {
    var data = [];
    var max = 0;
    var filtered = [];

    //filter into just selected categories
    for (var i in snapshot.streams) {
        if (snapshot.streams.hasOwnProperty(i)) {
            var cat = snapshot.streams[i];
            if (cats[cat.id]) {
                data.push(cat);
                if (cat.streams.length > max) max = cat.streams.length;
            }
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

function go(filtered) {
    $('.large').html('');
    var the_grid = $('<div>',{
        class: 'grid'
    });
    var sizer=$('<div>',{
        class: 'grid-sizer'
    });
    $(the_grid).append(sizer);
    for (var i=0; i<96; i++){
            var size = "";
            var new_thumb = filtered[i].thumbnail;
            var new_item = $('<div class="grid-item ' + size + ' ' + filtered[i].category + '" data-index=' + i + '>');
            var new_img = $('<img src="' + new_thumb + '">');
            new_item.append(new_img);
            $(the_grid).append(new_item);

        $('.large').append(the_grid)
    }
    $('.grid').imagesLoaded().always( function() {
        checkImageSize('.grid img');
    });
}

/*function shuffle(array) {
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
}*/
function redistributeGrid(){
    var x = $('.grid > div').not('.hidden, .grid-item--large').filter(function(){
        console.log(this);
        var index = $(this).attr('data-index');
        console.log('index- '+index);
        return index<5;
        }).length;
    console.log('Number not hidden'+x);
};
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
    // console.log(output_array);
    return output_array;
}

var main_array=[];
function buildThumbnails(){
    main_array = populateArray(36,0);
    console.log('main array',main_array);
    var featured_object = {
        category: "divider",
        thumbnail: "images/featured.png",
        title: "Featured",
        viewers: null
    };
    main_array.splice(0,0,featured_object);
    main_array.splice(4,0,featured_object);
    main_array.splice(53,0,featured_object);
    main_array.splice(-3);
    console.log('main array after splice',main_array);
    var new_thumb;
    var new_item;
    var new_img;
    var the_grid = $('<div>',{
        class: 'grid'
    });
    var sizer=$('<div>',{
        class: 'grid-sizer'
    });
    $(the_grid).append(sizer);
    for (var i=0; i<main_array.length; i++){

        if (i<5) {
            if (main_array[i].category==='divider'){
                new_thumb = main_array[i].thumbnail;
                new_item = $('<div class="stamp grid-item grid-item--divider">');
                new_img = $('<img src="' + new_thumb + '">');
                new_item.append(new_img);
                $(the_grid).append(new_item);
                continue;
            }
            new_thumb = main_array[i].thumbnail;
            new_item = $('<div class="grid-item grid-item--large ' + main_array[i].category + '" data-index=' + i + '>');
            new_img = $('<img src="' + new_thumb + '">');
            new_item.append(new_img);
            $(the_grid).append(new_item);
        }
        else if (i<53) {
            if (main_array[i].category==='divider'){
                new_thumb = main_array[i].thumbnail;
                new_item = $('<div class="stamp grid-item grid-item--divider">');
                new_img = $('<img src="' + new_thumb + '">');
                new_item.append(new_img);
                $(the_grid).append(new_item);
                continue;
            }
            new_thumb = main_array[i].thumbnail;
            new_item = $('<div class="grid-item grid-item--medium ' + main_array[i].category + '" data-index=' + i + '>');
            new_img = $('<img src="' + new_thumb + '">');
            new_item.append(new_img);
            $(the_grid).append(new_item);
        } else {
            if (main_array[i].category==='divider'){
                new_thumb = main_array[i].thumbnail;
                new_item = $('<div class="stamp grid-item grid-item--divider">');
                new_img = $('<img src="' + new_thumb + '">');
                new_item.append(new_img);
                $(the_grid).append(new_item);
                continue;
            }
            new_thumb = main_array[i].thumbnail;
            new_item = $('<div class="grid-item grid-item--small ' + main_array[i].category + '" data-index=' + i + '>');
            new_img = $('<img src="' + new_thumb + '">');
            new_item.append(new_img);
            $(the_grid).append(new_item);
        }
        $('.large').append(the_grid)
    }
    $('.grid').imagesLoaded().always( function() {
        checkImageSize('.grid img');
    });
}


