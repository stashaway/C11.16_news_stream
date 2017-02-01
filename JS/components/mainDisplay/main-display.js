
function mainDisplayController(dbService) {
    var ctrl = this;
    firebase.database().ref("-KbHuqtKNuu96svHRgjz").on('value', function (snapshot) {
        var snapshot_obj = snapshot.val();
        ctrl.data = snapshot_obj;
         ctrl.array = buildThumbnails(ctrl.data);
        console.log("Master array" , ctrl.array);
    })
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    function populateArray(cycles, depth) {
        var output_array = [];
        var games_list = ctrl.data['streams'][0]['streams'];
        var entertainment_list = ctrl.data['streams'][1]['streams'];
        var life_list = ctrl.data['streams'][2]['streams'];
        var current_list = ctrl.data['streams'][3]['streams'];
        var tech_list = ctrl.data['streams'][4]['streams'];
        var misc_list = ctrl.data['streams'][5]['streams'];

        for (var i=depth; i<cycles; i++) {
            var array = [];
            array.push(games_list[i]);
            array.push(entertainment_list[i]);
            array.push(life_list[i]);
            array.push(current_list[i]);
            array.push(tech_list[i]);
            array.push(misc_list[i]);
            shuffle(array);
            output_array = output_array.concat(array);
        }
        return output_array;
    }
    function buildThumbnails() {
        var array = [];
        var top_array = populateArray(1, 0);
        var mid_array = populateArray(8, 1);
        var bottom_array = populateArray(20, 9);
        return [top_array,mid_array,bottom_array];
    }
};
angular.module('streamism').component('mainDisplay',{
    templateUrl:'./JS/components/mainDisplay/main-display.html',
    controller: mainDisplayController,
    transclude: true,
});
