var google = require('googleapis');
var youtube = google.youtube({version: 'v3', auth: "AIzaSyDo1DIkPeLxpcT6Q14-m-WSm2dbUdYcZGk"});
var async = require("async");
var StreamSet = require('./streamSet');
var Stream = require('./stream');

var streamismYT = function (categories,ytCategories,streamSet) {
    this.categories = categories;
    this.ytCategories = ytCategories;
    this.streamSet = streamSet;
};

streamismYT.prototype.searchRequest = function(cat) {
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
            callback(error,data);
        })
    }
};

streamismYT.prototype.videosRequest = function(vIds) {
    var params = {
        part:"liveStreamingDetails",
        id:vIds
    };

    return function (callback) {
        youtube.videos.list(params, function(error, data) {
            callback(error,data);
        });
    }
};

streamismYT.prototype.parseIDs = function(streams) {
    var videoIDs = "";

    for (var i in streams) {
        if (streams.hasOwnProperty(i)) {
            videoIDs += videoIDs.length > 0 ? ", " : "";
            videoIDs += streams[i].id.videoId;
        }
    }

    return videoIDs;
};

streamismYT.prototype.parseSearch = function(response) {
    for (var i in response) {
        if (response.hasOwnProperty(i)) {
            var items = response[i];
            var set = this.streamSet.find(i);

            for (var j in items) {
                if (items.hasOwnProperty(j)) {
                    var stream = new Stream();
                    var ytStream = items[j];
                    stream.title = ytStream.snippet.title;
                    stream.thumbnail = ytStream.snippet.thumbnails.high.url;
                    stream.link = "http://youtube.com/watch/v=" + ytStream.id.videoId;
                    stream.id = ytStream.id.videoId;
                    stream.channel = ytStream.snippet.channelTitle;
                    stream.category = i;
                    set.add(stream);
                }
            }
        }
    }
};

streamismYT.prototype.parseVideos = function(items) {
    for (var i in items) {
        if (items.hasOwnProperty(i)) {
            var ytVid = items[i];
            var stream = this.streamSet.find(ytVid.id);
            stream.viewers = parseInt(ytVid.liveStreamingDetails.concurrentViewers);
            stream.startTime = ytVid.liveStreamingDetails.actualStartTime;
        }
    }
};

streamismYT.prototype.start = function (callback) {
    var syt = this;
    var root = syt.streamSet;
    var temp = {};

    for (var c in syt.categories) {
        if (syt.categories.hasOwnProperty(c)) {
            temp[syt.categories[c]] = [];
        }
    }

    var searchRequests = {};

    //Group requests
    for (var i in syt.ytCategories){
        if (syt.ytCategories.hasOwnProperty(i)){
            var cat = syt.ytCategories[i];
            searchRequests[cat.id] = syt.searchRequest(cat.id);
        }
    }

    //Use async parallel to group calls
    async.parallel(searchRequests, function(err, results) {
        if (err) {
            console.log(err);
            return;
        }

        var vidRequests = {};

        for (var i in syt.ytCategories){
            if (syt.ytCategories.hasOwnProperty(i)){
                var cat = syt.ytCategories[i];
                var items = results[cat.id].items;
                temp[cat.name] = temp[cat.name].concat(items);

                var vIds = syt.parseIDs(items);
                vidRequests[cat.id] = syt.videosRequest(vIds);
            }
        }

        syt.parseSearch(temp);

        async.parallel(vidRequests, function (error, results) {
            if (err) {
                console.log(err);
                return;
            }

            for (var i in syt.ytCategories){
                if (syt.ytCategories.hasOwnProperty(i)){
                    var cat = syt.ytCategories[i];
                    var items = results[cat.id].items;
                    syt.parseVideos(items);
                }
            }

            root.sort("viewers");

            callback(root);
        })
    });
};

module.exports = streamismYT;

