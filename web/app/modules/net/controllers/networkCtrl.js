define(['modules/net/module'], function (module) {

    'use strict';

    module.registerController('NetworkCtrl', function ($scope,$http,$modal,$log,navNetworkService) {
        var showBtn = document.getElementById('importArea');
        var importServerList = document.getElementById('importServerList');
        showBtn.onclick = function(){
            importServerList.style.display == "block"?importServerList.style.display = "none":importServerList.style.display = "block";
        }

        $scope.networkServers=[];
        $scope.outsideNetworkServers=[];
        $scope.network_server_id="";

        $http({
            method: "get",
            url: appConfig.apiUrl+"/networkservers"
        }).success(function(data){
            $scope.networkServers=data.networkservers;
        })

        function getOutsideNetworkServers(){
            $http({
                method: "get",
                url: appConfig.apiUrl+"/networkservers/outside"
            }).success(function(data){
                $scope.outsideNetworkServers=data;
                $scope.outsideNetworkServersInfo = data.length;
            });
        }
        getOutsideNetworkServers();
        //$http({
        //    method: "get",
        //    url: appConfig.apiUrl+"/networkservers/outside"
        //}).success(function(data){
        //    $scope.outsideNetworkServers=data;
        //    $scope.outsideNetworkServersInfo = data.length;
        //})
        $scope.selectId=function(network_server_id){
            $scope.network_server_id=network_server_id;
        }


        $scope.importNetworkServer=function(){

            $http({
                method: "post",
                url: appConfig.apiUrl+"/networkservers/import",
                data: {
                    id:$scope.network_server_id,
                    name:$scope.network_server_name,
                    description:$scope.network_server_des
                }
            }).success(function(data){
                $.smallBox({
                    title: "Import Success",
                    content: "<i class='fa fa-clock-o'></i> <i>Import Network Server Success.</i>",
                    color: "#659265",
                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                    timeout: 4000
                });
                $http({
                    method: "get",
                    url: appConfig.apiUrl+"/networkservers"
                }).success(function(data){
                    $scope.networkServers=data.networkservers;
                })

                $http({
                    method: "get",
                    url: appConfig.apiUrl+"/networkservers/outside"
                }).success(function(data){
                    //$scope.outsideNetworkServers=data;
                    getOutsideNetworkServers();
                })
                navNetworkService.listNetworkServers();
                document.getElementById("dismissButton").click();
            }).error(function(data) {
                $.smallBox({
                    title: "Import Error",
                    content: "<i class='fa fa-clock-o'></i> <i>"+data.error+"</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            });
        }



    });
});
