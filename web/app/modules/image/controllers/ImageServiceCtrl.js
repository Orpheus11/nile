define(['modules/image/module'], function (module) {

    'use strict';

    module.registerController('ImageServiceCtrl', function ($stateParams,imageServiceService,$scope,$modal,$log) {

        var showBtn = document.getElementById('importArea');
        var importServerList = document.getElementById('importServerList');
        showBtn.onclick = function(){
            importServerList.style.display == "block"?importServerList.style.display = "none":importServerList.style.display = "block";
        }

        imageServiceService.getOutsideImageServers(function(data){
            $scope.outsideImageServers = data;
        });
        $scope.imageServers = imageServiceService.imageServers;
        imageServiceService.listImageServers();
        //$scope.GetOutsideImageServers = function(){
        //    imageServiceService.getOutsideImageServers(function(data){
        //        $scope.outsideImageServers = data;
        //    });
        //}

        function getOutsideImageServers(){
            imageServiceService.getOutsideImageServers(function(data){
                $scope.outsideImageServers = data;
                $scope.outsideImageServersInfo = data.length;
            });
        }
        getOutsideImageServers();
        $scope.ImportImageServer = function (image_server_id, image_server_ips) {
            var modalInstance = $modal.open({
                templateUrl: 'app/modules/image/views/importImageServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.image_server_id = image_server_id;
                    $scope.image_server_ips = image_server_ips;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.importImageServer=function(){
                        console.log($scope.image_server_ips);
                        console.log($scope.image_server_ip);
                        imageServiceService.importImageServer($scope.image_server_id,$scope.image_server_name,$scope.image_server_ip,$scope.image_server_des,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Import Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Import Image Server Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Import Image Server Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Image Server Imported</i>",
                                    color: "#659265",
                                    iconSmall: "fa fa-check fa-2x fadeInRight animated",
                                    timeout: 4000
                                });
                                getOutsideImageServers();
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
