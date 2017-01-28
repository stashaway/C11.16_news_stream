function mainDisplayController(dbService) {
    var ctrl = this;
    firebase.database().ref("-KbHuqtKNuu96svHRgjz").on('value', function (snapshot) {
        var snapshot_obj = snapshot.val();
        ctrl.data = snapshot_obj.streams;
    })
};
angular.module('streamism').component('mainDisplay',{
    templateUrl:'./JS/components/mainDisplay/main-display.html',
    controller: mainDisplayController,
    transclude: true,
});
