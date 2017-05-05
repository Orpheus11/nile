define(['layout/module','angular','appConfig'], function (module) {

    'use strict';

    module.registerController('NavServerCtrl', function ($scope,$modal,$log,navServerService,$rootScope) {

        $scope.ImportServer = function (server_id,centers) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/importServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.server_id = server_id;
                    $scope.centers = centers;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.importServer=function(){
                        navServerService.importServer($scope.server_id,$scope.center_id,$scope.server_name,$scope.server_des,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Import Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Import Server Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Import Server Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Server Imported</i>",
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
                $log.info('Modal closed at: ' + new Date());
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.EditServer = function (server_id,server_name,server_des) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/editServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.server_id = server_id;
                    $scope.server_name = server_name;
                    $scope.server_des = server_des;

                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.editServer=function(){
                        navServerService.editServer($scope.server_id,$scope.server_name,$scope.server_des,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Edit Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>EditServer Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Edit Server Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Server Info Has Been Updated</i>",
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
                //$scope.UpdateTree();
                $log.info('Modal closed at: ' + new Date());
            }, function () {
                //$scope.UpdateTree();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.DeleteServer = function (server_id) {
            $.SmartMessageBox({
                title: "Delete Server!",
                content: "Are You Sure To Delete Server?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navServerService.deleteServer(server_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Delete Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Server Not Deleted.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "Server Deleted",
                                content: "<i class='fa fa-clock-o'></i> <i>Server has been Deleted.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Delete Server Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Delete Server Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }

            });
        };

        $scope.MigrateServer = function (server_id,server_name,server_des,centers) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/migrateServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.server_id = server_id;
                    $scope.centers = centers;
                    $scope.server_name=server_name;
                    $scope.server_des = server_des;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.migrateServer=function(){
                        navServerService.migrateServer($scope.server_id,$scope.center_id,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Migrate Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Migrate Server Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Migrate Server Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Server Migrated</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                $('li.active').remove();
                                $modalInstance.close();
                            }
                        });
                    }
                }
            });
            modalInstance.result.then(function () {
                //$scope.UpdateTree();
                $log.info('Modal closed at: ' + new Date());
            }, function () {
               //$scope.UpdateTree();
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.RefreshServer = function (server_id) {
            $.SmartMessageBox({
                title: "Refresh Server!",
                content: "Are You Sure To Refresh Server?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navServerService.refreshServer(server_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Refresh Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Server Refresh Faild.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "Server Refresh",
                                content: "<i class='fa fa-clock-o'></i> <i>Server Refreshed.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Refresh Server Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Refresh Server Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }

            });
        };


        $scope.StartVMs = function(server_id){
            $.SmartMessageBox({
                title: "Start All Vms!",
                content: "Are You Sure To Start All Vms?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navServerService.startVMs(server_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Start All Vms",
                                content: "<i class='fa fa-clock-o'></i> <i>Start All Vms Faild.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "Start All Vms",
                                content: "<i class='fa fa-clock-o'></i> <i>Start All Vms.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Start All Vms Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Start All Vms Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }

            });  
        };




        $scope.ShutdownVMs = function(server_id){
            $.SmartMessageBox({
                title: "Shutdown All Vms!",
                content: "Are You Sure To Shutdown All Vms?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navServerService.shutdownVMs(server_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Shutdown All Vms",
                                content: "<i class='fa fa-clock-o'></i> <i>Shutdown All Vms Faild.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "Shutdown All Vms",
                                content: "<i class='fa fa-clock-o'></i> <i>Shutdown All Vms.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Shutdown All Vms Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Shutdown All Vms Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }

            });  
        };




        $scope.ForceShutdownVMs = function(server_id){
            $.SmartMessageBox({
                title: "Force Shutdown All Vms!",
                content: "Are You Sure To Force Shutdown All Vms?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navServerService.forceShutdownVMs(server_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){
                            $.smallBox({
                                title: "Force Shutdown All Vms",
                                content: "<i class='fa fa-clock-o'></i> <i>Force Shutdown All Vms Faild.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "Force Shutdown All Vms",
                                content: "<i class='fa fa-clock-o'></i> <i>Force Shutdown All Vms.</i>",
                                color: "#659265",
                                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                timeout: 4000
                            });

                        }
                    });
                }
                if (ButtonPressed === "No") {
                    $.smallBox({
                        title: "Force Shutdown All Vms Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Force Shutdown All Vms Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }

            });  
        };


    });
});
