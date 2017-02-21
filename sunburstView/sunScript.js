/**
 * Created by baultik on 1/18/17.
 */
// Dimensions of sunburst.
var width = document.body.clientWidth;
var height = document.body.clientHeight - 100 - $("nav").height() - 30;
var radius = Math.min(width, height) / 2;
$("#sunburst_sequence_container").height(height);
$("#chart").css({"padding-top": $("nav").height() + 20 + "px"}).height(height);
$("#viewport").width(radius * 2).height(radius * 2);


var sunburst_array = [];

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
    w: 75, h: 30, s: 3, t: 10
};
// '<span class="glyphicon glyphicon-gamepad"></span>'
// Mapping of step names to colors.
var icons = {
    "gaming": 'f11b' ,
    "entertainment": '<span class="glyphicons glyphicons-theater"></span>',
    "people": '<span class="glyphicons glyphicons-group"></span>',
    "news": '<span class="glyphicons glyphicons-newspaper"></span>',
    "sports": ' <span class="glyphicons glyphicons-soccer-ball"></span>',
    "misc": '<span class="glyphicons glyphicons-globe"></span>'
};

var colors = {
    "gaming": $('#gaming:checked + span').css('background-color'),
    "entertainment": $('#entertainment:checked + span').css('background-color'),
    "people": $('#people:checked + span').css('background-color'),
    "news": $('#news:checked + span').css('background-color'),
    "sports": $('#sports:checked + span').css('background-color'),
    "misc": $('#misc:checked + span').css('background-color')
};

function sunburst_category_color() {
    for (var i = 0; i < sunburst_array.length; i++) {
        var category = sunburst_array[i].__data__.data.id;
        if (category === 'gaming') {
            $('path').css(colors.gaming);
        }
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
    .size([2 * Math.PI, radius * radius]);

var arc = d3.arc()
    .startAngle(function (d) {
        return d.x0;
    })
    .endAngle(function (d) {
        return d.x1;
    })
    .innerRadius(function (d) {
        return Math.sqrt(d.y0);
    })
    .outerRadius(function (d) {
        return Math.sqrt(d.y1);
    });


// Bounding circle underneath the sunburst, to make it easier to detect
// when the mouse leaves the parent g.
vis.append("svg:circle")
    .attr("r", radius)
    .style("opacity", 0);

// Main function to draw and set up the visualization, once we have the data.

function createVisualization(json) {
    var local_array = $.extend(true, {}, json);
    for (var i = 0; i < local_array.streams.length;) {
        var obj = local_array.streams[i];
        //Filter to 50 max videos for each category
        obj.streams = obj.streams.filter(function (val, index) {
            return index < 50;
        });
        //local_array.streams[i] = obj;

        if (preferences[obj.id]) {
            i++
        } else {
            local_array.streams.splice(i, 1);
        }
    }

/*    function innerFilter() {
        var local_array = $.extend(true, {}, json);
        var dataIndex = parseInt($(this).attr('data-index'));
        for (var i = 0; i < local_array.streams.length;) {
            var obj = local_array.streams[i];
            var preference = preferences[obj.id];

            obj.streams = obj.streams.filter(function (val, index) {
                return index < 50;
            });
            if(dataIndex > 0 && dataIndex < 6) {
                if (i < local_array.streams.length && obj.id !== this.__data__.data.id) {
                    local_array.streams.splice(i, 1);

                } else {
                    i++
                }
            }else{
                return
            }

        }
        conformDomElements()
    }*/

        var stringified = JSON.stringify(local_array).replace(/"streams":/g, '\"children\":');
        local_array = JSON.parse(stringified);

        // Turn the data into a d3 hierarchy and calculate the sums.
        var root = d3.hierarchy(local_array)
            .sum(function (d) {
                return d.viewers;
            })
            .sort(function (a, b) {
                return b.value - a.value;
            });

        // For efficiency, filter nodes to keep only those large enough to see.
        var nodes = partition(root).descendants()
            .filter(function (d) {
                var sunFilter = true;
                if (d.data.hasOwnProperty('category')) {
                    sunFilter = preferences[d.data.category];
                }
                return sunFilter && (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
            });
        var index_count = -1;
        var icon;
        // function sunburst_filter(){
        //     var current = this.
        // }

        var path = vis.data([local_array]).selectAll("path")
            .data(nodes);
        path.exit().remove();
        sunburst_array = [];
        var pathway = path.enter().append("svg:path")
            .merge(path)
            // path.transition()
            .attr("display", function (d) {
                sunburst_array.push(this);
                return d.depth ? null : "none";
            })

            .attr("d", arc)
            .attr("fill-rule", "evenodd")
            .attr('data-index', function (d) {
                index_count += 1;
                return index_count;
            })

            .attr('icon', function(d){
                // var testDiv = $('<div>').css({
                //     height: "20px",
                //     width: "20px",
                //     'background-color': 'black',
                //     "z-index": 5
                // });
                var icon = icons[d.data.id] || icons[d.data.category];
                var index = parseInt($(this).attr('data-index'));
                if(index > 0 && index < 7){
                    // path.append(testDiv);
                    path.append('svg:foreignObject')
                    .attr("x", -8)
                    .attr("y", -8)
                    .attr("width", 20)
                    .attr("height", 20)
                    .append("xhtml:span")
                    .attr('class', icon);
                }
                return icon

            })
            .style("fill", function (d) {
                var color = colors[d.data.id] || colors[d.data.category];
                return  color;
            })
            .style("opacity", 1)
            .on("mouseover", mouseover)
            .on('click',
                sun_video
            );

        // .on('click', conformSunburstElements );
        // var path_index = $("");
        // $('<div class="grid-item grid-item-f--large ' + main_array[i].category + '" data-index=' + i + '>');
        path.exit().transition()
            .remove();

        // Add the mouseleave handler to the bounding circle.
        d3.select("#container").on("mouseleave", mouseleave);

        // Get total size of the tree = value of root node from partition.
        totalSize = pathway.node().__data__.value;
        //sunburst_category_color();
    }

    function update_graph(data) {
        var path = g.selectAll('path').data(data);


    }

    var savedPrefs = getPreferences();

    function sun_video(d, i) {
        // console.log('click handled', i);
        // $('#viewport').toggleClass('bigport');
        // $('#viewport').toggleClass('viewport');

        var index = parseInt($(this).attr('data-index'));
        var current_item_details = sunburst_array[index].__data__.data;
        if(current_item_details.hasOwnProperty('children')){
            var prefs = getPreferences();
            var count = 0;
            for (var key in prefs) if (prefs[key]) count++;
            var sunburst_data = {};
            if (count == 1) {
                sunburst_data = savedPrefs;
            } else {
                savedPrefs = $.extend(true, {}, prefs);
                for (var j = 1; j < 7; j++) {
                    var obj = sunburst_array[j].__data__.data;
                    if(obj.hasOwnProperty('children')) {
                        sunburst_data[obj.id] = j == index;
                    }
                }
            }

            setPreferences(sunburst_data);
        }
        // var current_preview_obj = determine_sunburst_info(this, sunburst_array);
        //console.log(current_item_details);
        else if (current_item_details.hasOwnProperty("embedVideo")) embedPreview.play(current_item_details);
        // embedFullVideo.play(item,fullscreen,"left");
        // embedFullChat.play(item,fullscreen,"right");
        // fullscreen.show();

        // window.location.href = d.data.link;
        // onYouTubeIframeAPIReady();
        // sendEvent('video', 'play', 'play time');
        analizeViewTime();
    }

// };


    function determine_sunburst_info(item, array) {
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


        var v = d.data.viewers ? d.data.viewers + " viewers" : percentageString;
        //d3.select("#percentage").text(percentageString+" "+v);
        d3.select("#percentage").text(v);
        d3.select("#title").text(d.data.title || d.data.id);
        $('#thumbnail').attr('src', d.data.thumbnail).appendTo('#viewport');
        d3.select('#viewport').style("visibility", '');
        d3.select("#explanation").style("visibility", "");

        var sequenceArray = d.ancestors().reverse();
        sequenceArray.shift(); // remove root node from the array
        //updateBreadcrumbs(sequenceArray, percentageString);

        // Fade all the segments.
        d3.selectAll("path")
            .style("opacity", 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        vis.selectAll("path")
            .filter(function (node) {
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
            .on("end", function () {
                d3.select(this).on("mouseover", mouseover);
            });

        d3.select("#viewport")
            .style("visibility", "hidden");
    }

