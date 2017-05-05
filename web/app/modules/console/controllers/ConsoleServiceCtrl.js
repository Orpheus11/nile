define(['modules/console/module'], function (module) {

    'use strict';

    module.registerController('ConsoleServiceCtrl', function (consoleService,$scope,$modal,$log) {

        var showBtn = document.getElementById('importArea');
        var importServerList = document.getElementById('importServerList');
        showBtn.onclick = function(){
            importServerList.style.display == "block"?importServerList.style.display = "none":importServerList.style.display = "block";
        }

        //consoleService.getOutsideConsoleServers(function(data){
        //    $scope.outsideConsoleServers = data;
        //});
        $scope.consoleServers = consoleService.consoleServers;
        consoleService.listConsoleServers();
        function getOutsideConsoleServers(){
            consoleService.getOutsideConsoleServers(function(data){
                $scope.outsideConsoleServers = data;
                $scope.outsideConsoleServersInfo = data.length;
            });
        }
        getOutsideConsoleServers();
        //$scope.getOutsideConsoleServers = function(){
        //    consoleService.getOutsideConsoleServers(function(data){
        //        $scope.outsideConsoleServers = data;
        //    });
        //}

        $scope.ImportConsoleServer = function(console_server_ips,console_server_id) {
            var modalInstance = $modal.open({
                templateUrl: 'app/modules/console/views/importConsoleServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.console_server_id = console_server_id;
                    $scope.console_server_ips = console_server_ips;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.importConsoleServer=function(){
                        console.log("in import consoleserver");
                        consoleService.importConsoleServer($scope.console_server_id,$scope.console_server_name,$scope.console_server_ip,$scope.console_server_des,function(data){
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
                                getOutsideConsoleServers();
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
    });
});
