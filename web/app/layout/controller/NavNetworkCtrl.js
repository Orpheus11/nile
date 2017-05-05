define(['layout/module','angular','appConfig'], function (module) {

    'use strict';

    module.registerController('NavNetworkCtrl', function ($scope,$modal,$http,navNetworkService,$log) {
        $scope.networkServers=navNetworkService.networkServers;
        navNetworkService.listNetworkServers();
        $scope.outsideNetworkServers=[];
        $scope.network_server_id="";

        $scope.GetNetworkServers = function(){
            navNetworkService.listNetworkServers();
            $scope.networkServers=navNetworkService.networkServers;
        }


        // $http({
        //     method: "get",
        //     url: appConfig.apiUrl+"/networkservers"
        // }).success(function(data){
        //     $scope.networkServers=data.networkserver;
        // })

        $http({
            method: "get",
            url: appConfig.apiUrl+"/networkservers/outside"
        }).success(function(data){
            $scope.outsideNetworkServers=data;
        })

        $scope.EditNetworkServer = function (network_server_id,network_server_name,des) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/editNetworkServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.network_server_id = network_server_id;
                    $scope.network_server_name = network_server_name;
                    $scope.description = des;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.EditNetworkServer=function(){
                        navNetworkService.editNetworkServer($scope.network_server_id,$scope.network_server_name,$scope.description,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Edit Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Edit Network Server Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                //console.log($scope.return_data)
                                $.smallBox({
                                    title: "Edit Network Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Network Server Info Has Been Updated</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                $modalInstance.close();
                            }
                        });
                    }
                }
            });
            modalInstance.result.then(function () {
                //$scope.UpdateImageTree();
                $log.info('Modal closed at: ' + new Date());
            }, function () {
                //$scope.UpdateImageTree();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.DeleteNetworkServer = function (network_server_id) {
            $.SmartMessageBox({
                title: "Delete Network Server!",
                content: "Are You Sure To Delete Network Server?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navNetworkService.deleteNetworkServer(network_server_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){

                            $.smallBox({
                                title: "Delete Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Network Server Not Deleted.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "Image Server Deleted",
                                content: "<i class='fa fa-clock-o'></i> <i>Network Server has been Deleted.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                            //$scope.UpdateImageTree();
                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Delete Network Server Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Delete Server Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }

            });
        };


    });
});
