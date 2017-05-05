define(['layout/module','angular','appConfig'], function (module) {

    'use strict';

    module.registerController('NavConsoleCtrl', function ($scope,$modal,$log,navConsoleService,$rootScope) {

        $scope.entity=null;
        /*navConsoleService.getConsoleServers(function(data){
            $scope.consoleServers = data;
        });*/
        $scope.GetConsoleServers = function(){
            navConsoleService.getConsoleServers(function(data){
                $scope.consoleServers = data;
            });
            //console.log($scope.consoleServers);
        }

        /*navConsoleService.getOutsideConsoleServers(function(data){
            $scope.outsideConsoleServers = data;
        });*/
        $scope.GetOutsideConsoleServers = function(){
            navConsoleService.getOutsideConsoleServers(function(data){
                $scope.outsideConsoelServers = data;
            });
        }


        $scope.EditConsoleServer = function (console_server_id,console_server_name,des) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/editConsoleServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.console_server_id = console_server_id;
                    $scope.console_server_name = console_server_name;
                    $scope.description = des;
                    navConsoleService.GetConsoleServerIps(console_server_id, function(data){
                        $scope.console_server_ips = data.ips;
                    });
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    // $scope.getServerIp = function(console_server_ip){
                    //         $scope.console_server_ip = console_server_ip;
                    //         console.log($scope.console_server_ip);
                    // }
                    $scope.EditConsoleServer=function(){
                        console.log($scope.console_server_ip);
                        navConsoleService.editConsoleServer($scope.console_server_id,$scope.console_server_name,$scope.description,$scope.console_server_ip,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Edit Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Edit Console Server Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                console.log($scope.return_data)
                                $.smallBox({
                                    title: "Edit Console Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Console Server Info Has Been Updated</i>",
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
                ////$scope.UpdateImageTree();
                //$log.info('Modal closed at: ' + new Date());
            }, function () {
                //$scope.UpdateImageTree();
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.ImportConsoleServer = function (console_server_id) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/importConsoleServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.console_server_id = console_server_id;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.importConsoleServer=function(){
                        navConsoleService.importConsoleServer($scope.console_server_id,$scope.console_server_name,$scope.console_server_des,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Import Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Import Console Server Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Import Console Server Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Console Server Imported</i>",
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

        $scope.DeleteConsoleServer = function (console_server_id) {
            $.SmartMessageBox({
                title: "Delete Console Server!",
                content: "Are You Sure To Delete Console Server?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navConsoleService.deleteConsoleServer(console_server_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){

                            $.smallBox({
                                title: "Delete Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Console Server Not Deleted.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "Image Server Deleted",
                                content: "<i class='fa fa-clock-o'></i> <i>Console Server has been Deleted.</i>",
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
                        title: "Delete Console Server Has Been Canceled",
                        content: "<i class='fa fa-clock-o'></i> <i>Delete Server Has Been Canceled</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                }

            });
        };



        $rootScope.$on('entity',function(event,data){
            $scope.entity=JSON.parse(data);
        });

    });
});
