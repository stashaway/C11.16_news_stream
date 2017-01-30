/**
 * Created by baultik on 1/23/17.
 */
var fs = require('fs');
var StreamSet = require('./streamSet');
var Stream = require('./stream');
var yt = require("./youtube");
var twitch = require("./twitch");

var admin = require('firebase-admin');
var serviceAccount = require("./streamism-cccb0-firebase-adminsdk-vjej8-01b00647dc.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://streamism-cccb0.firebaseio.com",
    databaseAuthVariableOverride: {
        uid: "streamism-grabber"
    }
});

var db = admin.database();

//streamism categories
var categories = [
    "gaming","entertainment","life","news","technology","misc"
];

//yt categories mapped to streamism categories
var ytCategories = [
    {id:20,name:categories[0]},
    {id:24,name:categories[1]},
    {id:1, name:categories[1]},
    {id:10,name:categories[1]},
    {id:22,name:categories[2]},
    {id:19,name:categories[2]},
    {id:17,name:categories[2]},
    {id:25,name:categories[3]},
    {id:29,name:categories[3]},
    {id:27,name:categories[4]},
    {id:28,name:categories[4]},
    {id:15,name:categories[5]}
];
//tree root object to hold all stream data - categories are streamsets holding streams
var root = new StreamSet("streamism");
for (var c in categories) {
    if (categories.hasOwnProperty(c)) {
        root.add(new StreamSet(categories[c]));
    }
}
//temp write to file function
function writeToFile(filename, obj) {
    fs.writeFile(filename, JSON.stringify(obj) , function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

var sTwitch = new twitch(categories,root);
sTwitch.start(function (tdata) {
    var sYt = new yt(categories,ytCategories,tdata);
    sYt.start(function (ytdata) {
        db.ref("-KbHuqtKNuu96svHRgjz").set(ytdata);
        //writeToFile("new.json",ytdata);
        console.log("Set database");
    });
});

/*
setInterval(function () {
    //Initiate twitch then initiate youtube - root is passed in and back filled with data

},300000);*/
