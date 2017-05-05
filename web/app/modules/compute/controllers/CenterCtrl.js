define(['modules/compute/module'], function (module) {

    'use strict';

    module.registerController('CenterCtrl', function ($stateParams,centerService,$scope) {
        $scope.center_id = $stateParams.centerid;

        centerService.getCenterDetail($scope.center_id,function(data){
            $scope.center = data;
            //console.log($scope.center);
        });

        centerService.getCenterVms($scope.center_id,function(data){
            $scope.center_vms = data;

        });

        /*serverService.getServerVmsDetail($scope.server_id,function(data){
            $scope.server_vms = data.vms;
            console.log($scope.server_vms);
        });*/

    });
});
