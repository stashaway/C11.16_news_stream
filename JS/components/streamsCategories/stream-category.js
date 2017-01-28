function streamCategoryController(){
    var ctrl = this;
}
angular.module('streamism').component('streamCategory',{
    templateUrl:'./JS/components/streamsCategories/stream-category.html',
    controller: streamCategoryController,
    transclude:true,
    bindings:{
        section: "<"
    }
});