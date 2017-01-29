angular.module('streamism').service('dbService',function($firebaseArray){
    var dbs = this;
    var fb_ref = firebase.database().ref("-KbHuqtKNuu96svHRgjz/streams")
    var array = $firebaseArray(fb_ref);
    array.$watch(function(event){
        // console.log(event);
    });
});

