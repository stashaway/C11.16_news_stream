/**
 * Created by baultik on 1/23/17.
 */
var google = require('googleapis');
var youtube = google.youtube({version: 'v3', auth: "AIzaSyDo1DIkPeLxpcT6Q14-m-WSm2dbUdYcZGk"});
var async = require("async");

var categories = [
    {id:20,name:"gaming"},
    {id:24,name:"entertainment"},
    {id:1, name:"entertainment"},
    {id:10,name:"entertainment"},
    {id:22,name:"life"},
    {id:19,name:"life"},
    {id:17,name:"life"},
    {id:25,name:"current"},
    {id:29,name:"current"},
    {id:27,name:"learning"},
    {id:28,name:"learning"},
    {id:15,name:"other"}
];

function StreamSet(name) {
    this.streams = [];
    this.viewers = 0;
    this.id = name;

    this.add = function (stream) {
        this.viewers += parseInt(stream.viewers);
        this.streams.push(stream);
    };

    this.find = function (id) {
        for (var i = 0; i < this.streams.length; i++) {

            if (this.streams[i].id == id) {
                return this.streams[i];
            }

            if (this.streams[i].hasOwnProperty("streams")) {
                var node = this.streams[i].find(id);
                if (node != null) return node;
            }
        }
        return null;
    };

    this.sort = function (property) {
        for (var i = 0; i < this.streams.length; i++) {
            if (this.streams[i] instanceof StreamSet) {
                this.streams[i].sort(property);
            }
        }

        this.streams.sort(function (a, b) {
            return b[property] - a[property];
        })
    };
}

function Stream() {
    this.id = null;
    this.title = null;
    this.channel = null;
    this.thumbnail = null;
    this.viewers = null;
    this.link = null;
    this.startTime = null;
    this.category = null;
}

var root = new StreamSet("root");
root.add(new StreamSet("gaming"));
root.add(new StreamSet("entertainment"));
root.add(new StreamSet("life"));
root.add(new StreamSet("current"));
root.add(new StreamSet("learning"));
root.add(new StreamSet("other"));

var ops = {};

for (var i in categories){
    if (categories.hasOwnProperty(i)){
        var cat = categories[i];
        ops[cat.id] = search(cat.id);
    }
}

async.parallel(ops, function(err, results) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(results);


});


function search(cat) {
    var params = {
        part: 'snippet',
        eventType:"live",
        order:"viewCount",
        type:"video",
        maxResults:3,
        videoCategoryId:cat
    };

    return function (callback) {
        youtube.search.list(params, function (error, data) {
            // if(error) {
            //     console.error(error);
            //     return;
            // }

            //console.log();
            // var vIds = parseIDs(data.items);
            // videos(vIds);
            callback(error,data);
        })
    }
}

function videos(vIds) {
    var params = {
        part:"liveStreamingDetails",
        id:vIds
    };
    youtube.videos.list(params, function(err, data) {
    if(err) {
        console.error(err);
        return;
    }

    console.log(data);
});
}

function parseIDs(streams) {
    var videoIDs = "";

    for (var i in streams) {
        if (streams.hasOwnProperty(i)) {
            videoIDs += videoIDs.length > 0 ? ", " : "";
            videoIDs += streams[i].id.videoId;
        }
    }

    return videoIDs;
}