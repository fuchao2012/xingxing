define(['jquery',
        'pubsub'], function ($,
                             pubsub) {
    return ['$scope', 'dataService', 'events', function ($scope, dataService, events) {

        //region -- Fields --

        var self = this;

        //endregion

        //region -- Private


        //endregion

        //region -- View Model --

        $scope.selectedBattle = null;

        $scope.onEditBattle = function(){
            //alert($scope.selectedBattle);
            console.log(this)
        };

        $scope.selectBattle = function(battle){
            $scope.selectedBattle = battle;
            if(battle.id==="mapsta"){
               $(".popBar").show();
            }else{
                $("input[name='sta']").removeAttr("checked"); 
                $(".popBar").hide();
            }
            console.log(battle.id)
        };

        $scope.selectClass = function(battle){
            var selected = $scope.selectedBattle === battle;
            if(selected){
                return "select";
            } else{
                return "unselect";
            }
        };

        //endregion

        this.$onInit = function () {
            dataService.getBattles().then(function(bs){
                console.log(bs,"ssss");
                $scope.battles = bs;
                
            });
        };
    }];
});