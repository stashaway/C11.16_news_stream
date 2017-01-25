var TwitchApi = require('twitch-api');
var StreamSet = require('./streamSet');
var Stream = require('./stream');

var streamismTwitch = function (categories,streamSet) {
    this.api = new TwitchApi({
        clientId: 'a6ftugoz7pwach29wsg5wrsn4gfpug'
    });
    this.categories = categories;
    this.streamSet = streamSet;
};

streamismTwitch.prototype.parse = function (data){
    for (var i in data.streams) {
        var stream = new Stream();
        var twitchStream = data.streams[i];

        var set = this.streamSet.find(this.categories[0]);//game
        var game = twitchStream.game;

        switch (game.toUpperCase()) {
            case "IRL":
            case "SOCIAL EATING":
                set = this.streamSet.find(this.categories[2]);//life
                break;
            case "TALK SHOWS":
                set = this.streamSet.find(this.categories[3]);//news
                break;
            case "MUSIC":
                set = this.streamSet.find(this.categories[1]);//ent
                break;
            case "CREATIVE":
            case "GAME DEVELOPMENT":
                set = this.streamSet.find(this.categories[5]);//ent
                break;
        }

        stream.id = twitchStream._id;
        stream.title = twitchStream.channel.status;
        stream.channel = twitchStream.channel.display_name;
        stream.viewers = twitchStream.viewers;
        stream.thumbnail = twitchStream.preview.large;
        stream.link = twitchStream.channel.url;
        stream.startTime = twitchStream.created_at;
        set.add(stream);
    }
};

streamismTwitch.prototype.start = function (callback) {
    var sTwitch = this;
    sTwitch.api.getStreams({limit:3},function (error,data) {
        if (error) {
            console.log(error);
            return;
        }
        sTwitch.parse(data);
        sTwitch.streamSet.sort("viewers");
        callback(sTwitch.streamSet);
    });
};

module.exports = streamismTwitch;