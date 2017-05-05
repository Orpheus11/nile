define(['layout/module','angular','appConfig'], function (module) {

    'use strict';

    module.registerController('NavComputeCtrl', function ($scope,$log,navComputeService,$rootScope,$interval) {
        $rootScope.serversId = [];
        navComputeService.getCenters(function(data){
            $scope.centers = data;
        });
        $scope.GetCenters = function(){
            navComputeService.getCenters(function(data){
                $scope.centers = data;
            });
        }
        $scope.GetServers = function(index){
            navComputeService.getServers($scope.centers[index].id,function(data){
                $scope.centers[index].servers = data;
                $rootScope.servers = data;
            })
        }
        $scope.GetVMs = function(server){
            navComputeService.getVms(server.id,function(data){
                server.vms = data;
            })
        }
        $scope.GetCenterVMs = function(index){
            navComputeService.getCenterVms($scope.centers[index].id,function(data){
                $rootScope.vm_priority_list = $scope.centers[index].vms = data;
            })
        }

        $scope.RefreshServers = function(index){
            navComputeService.getServers($scope.centers[index].id,function(data){
                for(var i=0;i<data.length;i++){
                    var exist=false;
                    if($scope.centers[index].servers!=undefined)
                    {
                        for (var j = 0; j < $scope.centers[index].servers.length; j++) {
                            if ($scope.centers[index].servers[j].id == data[i].id) {
                                $scope.centers[index].servers[j].status = data[i].status;
                                $scope.GetVMs($scope.centers[index].servers[j]);
                                exist = true;
                            }
                        }
                        if (exist == false) {
                            //console.log(typeof $scope.centers[index].servers);
                            $scope.centers[index].servers.push(data[i]);
                        }
                    }
                }
            })
        }

        //Auto Update Tree
        $scope.autoUpdate = true;
        var updateInterval;
        $scope.$watch('autoUpdate', function(autoUpdate){

            if(autoUpdate){
                //console.log("in update tree");
                updateInterval = $interval(function(){
                    //console.log($scope.centers);
                    for(var i= 0;i<$scope.centers.length;i++){
                        $scope.RefreshServers(i);
                    }
                }, 10000)
            } else {
                $interval.cancel(updateInterval);
            }
        });


        $rootScope.$on('updateCenter',$scope.GetCenters);
        $rootScope.$on('entity',function(event,data){
            $scope.entity=JSON.parse(data);
        });
    });
});
