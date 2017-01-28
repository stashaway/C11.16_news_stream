var TwitchApi = require('twitch-api');
var credentials = require("./credentials");
var StreamSet = require('./streamSet');
var Stream = require('./stream');

var streamismTwitch = function (categories,streamSet) {
    this.api = new TwitchApi({
        clientId: credentials.twitch
    });
    this.categories = categories;
    this.streamSet = streamSet;
};

streamismTwitch.prototype.parse = function (data){
    for (var i in data.streams) {
        var stream = new Stream();
        var twitchStream = data.streams[i];

        stream.category = this.categories[0];
        var set = this.streamSet.find(this.categories[0]);//game
        var game = twitchStream.game;

        switch (game.toUpperCase()) {
            case "IRL":
            case "SOCIAL EATING":
                set = this.streamSet.find(this.categories[2]);//life
                stream.category = this.categories[2];
                break;
            case "TALK SHOWS":
                set = this.streamSet.find(this.categories[3]);//news
                stream.category = this.categories[3];
                break;
            case "MUSIC":
                set = this.streamSet.find(this.categories[1]);//ent
                stream.category = this.categories[1];
                break;
            case "CREATIVE":
            case "GAME DEVELOPMENT":
                set = this.streamSet.find(this.categories[5]);//misc
                stream.category = this.categories[5];
                break;
        }

        stream.id = twitchStream.channel.name;
        stream.title = twitchStream.channel.status;
        stream.channel = twitchStream.channel.display_name;
        stream.viewers = isNaN(parseInt(twitchStream.viewers)) ? 0 : parseInt(twitchStream.viewers);
        stream.thumbnail = twitchStream.preview.medium;
        stream.link = twitchStream.channel.url;
        stream.startTime = twitchStream.created_at;
        stream.source = "twitch";
        stream.embedVideo = "http://player.twitch.tv/?channel=" + twitchStream.channel.name;
        stream.embedChat = twitchStream.channel.url + "/chat";
        set.add(stream);
    }
};

streamismTwitch.prototype.start = function (callback) {
    var sTwitch = this;
    sTwitch.api.getStreams({limit:50},function (error,data) {
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