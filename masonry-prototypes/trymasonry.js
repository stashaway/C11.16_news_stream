$(document).ready(function() {
    buildThumbnails(parsedStreamData);
    var $grid = $('.grid').imagesLoaded( function() {
        // init Masonry after all images have loaded
        $grid.masonry({
            // options...
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer'
            // percentPosition: true
        });
    });
    var $grid2 = $('.grid2').imagesLoaded( function() {
        // init Masonry after all images have loaded
        $grid2.masonry({
            // options...
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer2'
            // percentPosition: true
        });
    });
});

var sizeClasses=['large"','large"','large"','large"','medium"','medium"','medium"','medium"','small"','small"','small"','small"'];
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
    var contDiv4;
    var contDiv5;
    var contDiv6;
    for (var i=0; i<stream.length; i++){
        contDiv=$('<div class="grid-item grid-item--'+sizeClasses[i]+'>');
        contDiv2=$('<div class="grid-item grid-item--'+sizeClasses[i+1]+'>');
        contDiv3=$('<div class="grid-item grid-item--'+sizeClasses[i+2]+'>');
        thumb=$('<img src=' + stream[i].thumbnail + '>');
        thumb2=$('<img src=' + stream[i].thumbnail + '>');
        thumb3=$('<img src=' + stream[i].thumbnail + '>');
        contDiv.append(thumb);
        contDiv2.append(thumb2);
        contDiv3.append(thumb3);
        thumbs.append(contDiv,contDiv2,contDiv3);
    }
    $('.gaming').append(thumbs);
    for (var j=0; j<stream.length; j++){
        contDiv4=$('<div class="grid-item grid-item--'+sizeClasses[j]+'>');
        contDiv5=$('<div class="grid-item grid-item--'+sizeClasses[j+1]+'>');
        contDiv6=$('<div class="grid-item grid-item--'+sizeClasses[j+2]+'>');
        thumb4=$('<img src=' + stream[j].thumbnail + '>');
        thumb5=$('<img src=' + stream[j].thumbnail + '>');
        thumb6=$('<img src=' + stream[j].thumbnail + '>');
        contDiv4.append(thumb6);
        contDiv5.append(thumb5);
        contDiv6.append(thumb4);
        thumbs2.append(contDiv4,contDiv5,contDiv6);
    }
    console.log('Thumbs2 - '+thumbs2);
    $('.entertainment').append(thumbs2);

}