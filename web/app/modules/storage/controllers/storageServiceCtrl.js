define(['modules/storage/module'], function (module) {

    'use strict';

    module.registerController('StorageServiceCtrl', function ($stateParams,storageService,$scope,$modal,$log) {

        var showBtn = document.getElementById('importArea');
        var importServerList = document.getElementById('importServerList');
        showBtn.onclick = function(){
            importServerList.style.display == "block"?importServerList.style.display = "none":importServerList.style.display = "block";
        }

        //storageService.getOutsideStorageServers(function(data){
        //    $scope.outsideStorageServers = data;
        //});

        $scope.storageServers = storageService.storageServers;
        storageService.listStorageServers();

        function getOutsideStorageServers(){
            storageService.getOutsideStorageServers(function(data){
                $scope.outsideStorageServers = data;
                $scope.outsideStorageServersInfo = data.length;
            });
        }
        getOutsideStorageServers();
        //$scope.GetOutsideStorageServers = function(){
        //    storageService.getOutsideStorageServers(function(data){
        //        $scope.outsideStorageServers = data;
        //    });
        //}

        $scope.ImportStorageServer = function (server_id) {
            var modalInstance = $modal.open({
                templateUrl: 'app/modules/storage/views/importStorageServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.server_id = server_id;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.importStorageServer=function(){
                        storageService.importStorageServer($scope.server_id,$scope.server_name,$scope.server_des,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Import Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Import Storage Server Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Import Storage Server Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Storage Server Imported</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                getOutsideStorageServers();
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
