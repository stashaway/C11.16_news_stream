function individualStreamController($log){
    var ctrl = this;
}
angular.module('streamism').component('individualStream',{
    templateUrl:'./JS/components/individualStream/individual-streams.html',
    controller: individualStreamController,
    transclude:true,
    bindings:{
        gridItem:"<",
        streamObject:"<"
    }
})