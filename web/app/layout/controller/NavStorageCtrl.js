define(['layout/module','angular','appConfig'], function (module) {

    'use strict';

    module.registerController('NavStorageCtrl', function ($scope,navStorageService,$log,$modal) {
        //console.log('NavStorageCtrl load');

        $scope.entity=null;
        navStorageService.getStorageServers(function(data){
            $scope.storageServers = data;
            //console.log($scope.storageServers);
        });
        $scope.GetStorageServers = function(){
            navStorageService.getStorageServers(function(data){
                $scope.storageServers = data;
                //console.log($scope.storageServers);
            });
        }

        $scope.EditStorageServer = function (server_id,server_name,des) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/editStorageServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.server_id = server_id;
                    $scope.server_name = server_name;
                    $scope.description = des;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.EditStorageServer=function(){
                        navStorageService.editStorageServer($scope.server_id,$scope.server_name,$scope.description,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Edit Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Edit Storage Server Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                console.log($scope.return_data)
                                $.smallBox({
                                    title: "Edit Storage Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Storage Server Info Has Been Updated</i>",
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
        $scope.DeleteStorageServer = function (server_id) {
            $.SmartMessageBox({
                title: "Delete Storage Server!",
                content: "Are You Sure To Delete Console Server?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navStorageService.deleteStorageServer(server_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){

                            $.smallBox({
                                title: "Delete Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Storage Server Not Deleted.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "Storage Server Deleted",
                                content: "<i class='fa fa-clock-o'></i> <i>Storage Server has been Deleted.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Delete Storage Server Has Been Canceled",
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