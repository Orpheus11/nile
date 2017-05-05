define(['modules/compute/module'], function (module) {

    'use strict';

    module.registerController('DataCenterCtrl', function (dataCenterService,$scope,$modal,$log) {

        var showBtn = document.getElementById('importArea');
        var importServerList = document.getElementById('importServerList');
        showBtn.onclick = function(){
            importServerList.style.display == "block"?importServerList.style.display = "none":importServerList.style.display = "block";
        }

        $scope.centers = dataCenterService.centers;
        dataCenterService.listCenters();

        //dataCenterService.getOutsideServers(function(data){
        //    $scope.outsideServers = data;
        //});
        //
        //$scope.GetOutsideServers = function(){
        //    dataCenterService.getOutsideServers(function(data){
        //        $scope.outsideServers = data;
        //    });
        //}

        function getOutsideServers(){
            dataCenterService.getOutsideServers(function(data){
                $scope.outsideServers = data;
                $scope.outsideServersInfo = data.length;
            });
        }
        getOutsideServers();
        $scope.ImportServer = function (server_id) {
            var modalInstance = $modal.open({
                templateUrl: 'app/modules/compute/views/importServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.server_id = server_id;
                    dataCenterService.getCenters(function(data){
                        $scope.centers = data;
                    });
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.importServer=function(){
                        dataCenterService.importServer($scope.server_id,$scope.center_id,$scope.server_name,$scope.server_des,function(data){
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
                                getOutsideServers();
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
        /*serverService.getServerDetail($scope.server_id,function(data){
            $scope.server = data.server;
            //console.log($scope.server);
        });

        serverService.getServerVmsDetail($scope.server_id,function(data){
            $scope.server_vms = data.vms;
            console.log($scope.server_vms);
        });*/

    });
});
