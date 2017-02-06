/**
 * Created by baultik on 1/18/17.
 */
// Dimensions of sunburst.
var width = document.body.clientWidth + 100;
var height = document.body.clientHeight + 100;
var radius = Math.min(width, height) / 2;
var sunburst_array = [];

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
    w: 75, h: 30, s: 3, t: 10
};

// Mapping of step names to colors.

var colors = {
    "gaming": $('#gaming:checked + span').css('background-color'),
    "entertainment": $('#entertainment:checked + span').css('background-color'),
    "people":$('#people:checked + span').css('background-color'),
    "news":$('#news:checked + span').css('background-color'),
    "sports":$('#sports:checked + span').css('background-color'),
    "misc":$('#misc:checked + span').css('background-color')
};

function sunburst_category_color(){
    for(var i =0 ; i < sunburst_array.length; i++){
       var category = sunburst_array[i].__data__.data.id;
       if(category === 'gaming'){
           $('path').css(colors.gaming);
       }


       console.log(category);
    }
}

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0;

var vis = d3.select("#chart").append("svg:svg")
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.partition()
    .size([2*Math.PI, radius * radius]);

var arc = d3.arc()
    .startAngle(function(d) { return d.x0; })
    .endAngle(function(d) { return d.x1; })
    .innerRadius(function(d) { return Math.sqrt(d.y0); })
    .outerRadius(function(d) { return Math.sqrt(d.y1); });


// Bounding circle underneath the sunburst, to make it easier to detect
// when the mouse leaves the parent g.
vis.append("svg:circle")
    .attr("r", radius)
    .style("opacity", 0);

// Main function to draw and set up the visualization, once we have the data.

function createVisualization(json) {
    var local_array = $.extend(true, {}, json);
    for(var i = 0; i<local_array.streams.length;){
        var obj = local_array.streams[i];
        if(preferences[obj.id]){
            i++
        }else{
            local_array.streams.splice(i,1);
        }
    }

    var stringified = JSON.stringify(local_array).replace(/streams/g, 'children');
    local_array = JSON.parse(stringified);

    // Turn the data into a d3 hierarchy and calculate the sums.
    var root = d3.hierarchy(local_array)
        .sum(function(d) {console.log(d); return d.viewers; })
        .sort(function(a, b) { return b.value - a.value; });

    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = partition(root).descendants()
        .filter(function(d) {
            var sunFilter = true;
            if(d.data.hasOwnProperty('category')){
                sunFilter = preferences[d.data.category];
            }
            return sunFilter && (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
        });
    var index_count = -1;
    var path = vis.data([local_array]).selectAll("path")
        .data(nodes);
    path.exit().remove();
        var pathway = path.enter().append("svg:path")
            .merge(path)
        .attr("display", function(d) {sunburst_array.push(this); return d.depth ? null : "none"; })
        .attr("d", arc)
        .attr("fill-rule", "evenodd")
        .attr('data-index', function() {index_count += 1; return index_count})
        .style("fill", function(d) {
            var color = colors[d.data.category] || !(d.parent) ? colors[d.data.category] : colors[d.parent.data.category]
            console.log('Fill output:', color);
            console.log('Colors object:', colors);
            console.log('Category:', d.data.category);
            console.log('Parent:', d.parent);
            return color;
        })
        .style("opacity", 1)
        .on("mouseover", mouseover)
        .on('click',
            sun_video
        );
        // var path_index = $("");
     // $('<div class="grid-item grid-item-f--large ' + main_array[i].category + '" data-index=' + i + '>');
        path.exit().remove();

    // Add the mouseleave handler to the bounding circle.
    d3.select("#container").on("mouseleave", mouseleave);

    // Get total size of the tree = value of root node from partition.
    totalSize = pathway.node().__data__.value;
    sunburst_category_color();
}

function update_graph(data){
    var path = g.selectAll('path').data(data);





};

function sun_video(d, i){

    console.log('click handled', i);
    // $('#viewport').toggleClass('bigport');
    // $('#viewport').toggleClass('viewport');
    var index = parseInt($(this).attr('data-index'));
    var current_item_details = sunburst_array[index].__data__.data;
    // var current_preview_obj = determine_sunburst_info(this, sunburst_array);
    console.log(current_item_details);
    embedPreview.play(current_item_details);
    // embedFullVideo.play(item,fullscreen,"left");
    // embedFullChat.play(item,fullscreen,"right");
    // fullscreen.show();

    // window.location.href = d.data.link;
    // onYouTubeIframeAPIReady();
}

// Embed.prototype.sunplay = function (data, parent, type) {
//     this.stop();
//
//     this.data = data;
//     this.parentElement = $(parent);
//     var src = this.__data__.data.source==="twitch" ? this.__data__.data.embedVideo :
//         this.data.embedVideo+"?&autoplay=1&fs=0&modestbranding=1&playsinline=1&rel=0";
//
//     var width = this.parentElement.width();
//     var height = this.parentElement.height();
//     var top = 0;
//     var left = 0;
//
//     if (type) {
//         if (type=="left") {
//             if (this.parentElement.height() > this.parentElement.width()) {
//                 height = width * 0.5625;
//             } else {
//                 width = this.parentElement.width() *0.75;
//             }
//         } else if (type=="right") {
//             if (this.parentElement.height() > this.parentElement.width()) {
//                 top = width * 0.5625;
//                 height = this.parentElement.height() - top;
//             } else {
//                 left = this.parentElement.width() *0.75;
//                 width = this.parentElement.width() - left;
//             }
//             src = this.data.embedChat;
//         }
//     }
//
//     var params = {
//         id:"preview_iframe",
//         frameborder:"0",
//         scrolling:"no",
//         width:width,
//         height:height,
//         src:src
//     };
//
//     var style = {
//         position: "absolute",
//         left: left,
//         top: top,
//         display:"inline-block"
//     };
//
//     this.iframeElement = $("<iframe>",params).css(style);
//     $(this.parentElement).append(this.iframeElement);
// };


function determine_sunburst_info (item, array) {
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
    var index = parseInt($(item).attr('data-index'));
    var current_item_details = array[index].__data__.data;
    return {
        'index': index,
        'thumbnail': current_item_details.thumbnail,
        'link': current_item_details.link,
        'category': current_item_details.category,
        'channel': current_item_details.channel,
        'viewers': current_item_details.viewers,
        'start': current_item_details.startTime,
        'title': current_item_details.title,
        'id': current_item_details.id,
        'chat': current_item_details.embedChat,
        'video': current_item_details.embedVideo,
        'source': item.source
    };
}
// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {

    var percentage = (100 * d.value / totalSize).toPrecision(3);
    var percentageString = percentage + "%";
    if (percentage < 0.1) {
        percentageString = "< 0.1%";
    }

    var v = d.data.viewers ? d.data.viewers + " viewers" : d.data.tviewers + " viewers";
    d3.select("#percentage").text(percentageString+" "+v);
    d3.select("#title").text(d.data.name);
    $('#thumbnail').attr('src', d.data.thumbnail).appendTo('#viewport');
    d3.select('#viewport').style("visibility", '');
    d3.select("#explanation").style("visibility", "");

    var sequenceArray = d.ancestors().reverse();
    sequenceArray.shift(); // remove root node from the array
    updateBreadcrumbs(sequenceArray, percentageString);

    // Fade all the segments.
    d3.selectAll("path")
        .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    vis.selectAll("path")
        .filter(function(node) {
            return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

    // Hide the breadcrumb trail
    d3.select("#trail")
        .style("visibility", "hidden");

    // Deactivate all segments during transition.
    d3.selectAll("path").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll("path")
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .on("end", function() {
            d3.select(this).on("mouseover", mouseover);
        });

    d3.select("#explanation")
        .style("visibility", "hidden");
}

function initializeBreadcrumbTrail() {
    // Add the svg area.
    var trail = d3.select("#sequence").append("svg:svg")
        .attr("width", width)
        .attr("height", 50)
        .attr("id", "trail");
    // Add the label at the end, for the percentage.
    trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
    var points = [];
    points.push("0,0");
    points.push(b.w + ",0");
    points.push(b.w + b.t + "," + (b.h / 2));
    points.push(b.w + "," + b.h);
    points.push("0," + b.h);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + (b.h / 2));
    }
    return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

    // Data join; key function combines name and depth (= position in sequence).
    var trail = d3.select("#trail")
        .selectAll("g")
        .data(nodeArray, function(d) { return d.data.name + d.depth; });

    // Remove exiting nodes.
    trail.exit().remove();

    // Add breadcrumb and label for entering nodes.
    var entering = trail.enter().append("svg:g");

    entering.append("svg:polygon")
        .attr("points", breadcrumbPoints)
        .style("fill", function(d) { return colors[d.data.name]; });

    entering.append("svg:text")
        .attr("x", (b.w + b.t) / 2)
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.data.name; });

    // Merge enter and update selections; set position for all nodes.
    entering.merge(trail).attr("transform", function(d, i) {
        return "translate(" + i * (b.w + b.s) + ", 0)";
    });

    // Now move and update the percentage at the end.
    d3.select("#trail").select("#endlabel")
        .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
        .attr("y", b.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(percentageString);

    // Make the breadcrumb trail visible, if it's hidden.
    d3.select("#trail")
        .style("visibility", "");

}

function drawLegend() {

    // Dimensions of legend item: width, height, spacing, radius of rounded rect.
    var li = {
        w: 75, h: 30, s: 3, r: 3
    };

    var legend = d3.select("#legend").append("svg:svg")
        .attr("width", li.w)
        .attr("height", d3.keys(colors).length * (li.h + li.s));

    var g = legend.selectAll("g")
        .data(d3.entries(colors))
        .enter().append("svg:g")
        .attr("transform", function(d, i) {
            return "translate(0," + i * (li.h + li.s) + ")";
        });

    g.append("svg:rect")
        .attr("rx", li.r)
        .attr("ry", li.r)
        .attr("width", li.w)
        .attr("height", li.h)
        .style("fill", function(d) { return d.value; });

    g.append("svg:text")
        .attr("x", li.w / 2)
        .attr("y", li.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.key; });
}

function toggleLegend() {
    var legend = d3.select("#legend");
    if (legend.style("visibility") == "hidden") {
        legend.style("visibility", "");
    } else {
        legend.style("visibility", "hidden");
    }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how
// often that sequence occurred.
function buildHierarchy(csv) {
    var root = {"name": "root", "children": []};
    for (var i = 0; i < csv.length; i++) {
        var sequence = csv[i][0];
        var size = +csv[i][1];
        if (isNaN(size)) { // e.g. if this is a header row
            continue;
        }
        var parts = sequence.split("-");
        var currentNode = root;
        for (var j = 0; j < parts.length; j++) {
            var children = currentNode["children"];
            var nodeName = parts[j];
            var childNode;
            if (j + 1 < parts.length) {
                // Not yet at the end of the sequence; move down the tree.
                var foundChild = false;
                for (var k = 0; k < children.length; k++) {
                    if (children[k]["name"] == nodeName) {
                        childNode = children[k];
                        foundChild = true;
                        break;
                    }
                }
                // If we don't already have a child node for this branch, create it.
                if (!foundChild) {
                    childNode = {"name": nodeName, "children": []};
                    children.push(childNode);
                }
                currentNode = childNode;
            } else {
                // Reached the end of the sequence; create a leaf node.
                childNode = {"name": nodeName, "size": size};
                children.push(childNode);
            }
        }
    }
    return root;
};

// var player;
// function onYouTubeIframeAPIReady() {
//     player = new YT.Player('player', {
//         height: '390',
//         width: '640',
//         videoId: 'M7lc1UVf-VE',
//         events: {
//             'onReady': onPlayerReady,
//             'onStateChange': onPlayerStateChange
//         }
//     });
//     console.log('youtube video ready')
//
// }
