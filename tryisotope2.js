$(document).ready(function() {
    buildThumbnails(parsedStreamData);
    $grid = $('.grid').imagesLoaded( function() {
        // init Masonry after all images have loaded
        $grid.isotope({
            // options...
            itemSelector: '.grid-item',
            masonry: {columnWidth: '.grid-sizer'},
            percentPosition: true
        });
    });
    $grid2 = $('.grid2').imagesLoaded( function() {
        // init Masonry after all images have loaded
        $grid2.isotope({
            // options...
            itemSelector: '.grid-item2',
            masonry: {columnWidth: '.grid-sizer2'},
            percentPosition: true
        });
    });

    $('.side_nav input:checkbox').change(function() {
        // this will contain a reference to the checkbox
        console.log(this.name);
            $('.'+this.name).toggleClass('hidden');
            $grid.isotope({ filter: '*:not(.hidden)' });
            $grid2.isotope({ filter: '*:not(.hidden)' });
    });
});

var sizeClasses=['medium"','medium"','medium"','medium"','medium"','medium"','medium"','medium"','medium"','medium"','medium"','medium"'];

function buildThumbnails(stream){
    console.log(stream);
    var thumbs=$('<div class="grid">');
    var thumbs2=$('<div class="grid2">');
    var gridsizer=$('<div class="grid-sizer">');
    thumbs.append(gridsizer);
    var gridsizer2=$('<div class="grid-sizer2">');
    thumbs2.append(gridsizer2);
    var thumb;
    var thumb2;
    var thumb3;
    var thumb4;
    var thumb5;
    var thumb6;

    for (var i=0; i<stream.length; i++){
        contDiv=$('<div class="games grid-item grid-item--'+sizeClasses[i]+'>');
        contDiv2=$('<div class="entertainment grid-item grid-item--'+sizeClasses[i+1]+'>');
        contDiv3=$('<div class="news grid-item grid-item--'+sizeClasses[i+2]+'>');
        thumb=$('<img src=' + stream[i].thumbnail + '>');
        thumb2=$('<img src=' + stream[i].thumbnail + '>');
        thumb3=$('<img src=' + stream[i].thumbnail + '>');
        contDiv.append(thumb);
        contDiv2.append(thumb2);
        contDiv3.append(thumb3);
        thumbs.append(contDiv,contDiv2);
    }
    $('.medium').append(thumbs);

    for (var j=0; j<2; j++){
        contDiv4=$('<div class="entertainment grid-item2 grid-item--large">');
        contDiv5=$('<div class="news grid-item2 grid-item--large">');
        contDiv6=$('<div class="games grid-item2 grid-item--large">');
        thumb4=$('<img src=' + stream[j].thumbnail + '>');
        thumb5=$('<img src=' + stream[j].thumbnail + '>');
        thumb6=$('<img src=' + stream[j].thumbnail + '>');
        contDiv4.append(thumb6);
        contDiv5.append(thumb5);
        contDiv6.append(thumb4);
        thumbs2.append(contDiv4, contDiv5);
    }
    console.log('Thumbs2 - '+thumbs2);
    $('.large').append(thumbs2);

}