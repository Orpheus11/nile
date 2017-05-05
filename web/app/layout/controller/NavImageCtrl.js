define(['layout/module','angular','appConfig'], function (module) {

    'use strict';

    module.registerController('NavImageCtrl', function ($scope,$modal,$log,navImageService,$rootScope) {

        $scope.entity=null;
        navImageService.getImageServers(function(data){
            $scope.imageServers = data;
        });
        $scope.GetImageServers = function(){
            navImageService.getImageServers(function(data){
                $scope.imageServers = data;
            });
            //console.log($scope.imageServers);
        }

        navImageService.getOutsideImageServers(function(data){
            $scope.outsideImageServers = data;
        });
        $scope.GetOutsideImageServers = function(){
            navImageService.getOutsideImageServers(function(data){
                $scope.outsideImageServers = data;
            });
        }


        $scope.EditImageServer = function (image_server_id,image_server_name,image_server_ip,des) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/editImageServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.image_server_id = image_server_id;
                    $scope.image_server_name = image_server_name;
                    $scope.description = des;
                    navImageService.GetImageServerIps(image_server_id, function(data){
                        $scope.image_server_ips = data.ips;
                        console.log($scope.image_server_ips);
                    });
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.EditImageServer=function(){
                        console.log($scope.image_server_ips);
                        console.log($scope.image_server_ip);
                        navImageService.editImageServer($scope.image_server_id,$scope.image_server_name,$scope.description,$scope.image_server_ip,function(data){
                            $scope.return_data = data;
                            if ($scope.return_data.error != null){
                                $.smallBox({
                                    title: "Edit Error",
                                    content: "<i class='fa fa-clock-o'></i> <i>Edit Image Server Error.</i>",
                                    color: "#C46A69",
                                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                    timeout: 4000
                                });

                            }
                            else{
                                $.smallBox({
                                    title: "Edit Center Succeed",
                                    content: "<i class='fa fa-clock-o'></i> <i>Image Server Info Has Been Updated</i>",
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
                //$log.info('Modal closed at: ' + new Date());
            }, function () {
                //$scope.UpdateImageTree();
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.ImportImageServer = function (image_server_id) {
            var modalInstance = $modal.open({
                templateUrl: 'app/layout/context/importImageServer.tpl.html',
                controller: function($scope,$modalInstance){
                    $scope.image_server_id = image_server_id;
                    $scope.closeModal = function(){
                        $modalInstance.close();
                    }
                    $scope.importImageServer=function(){
                        navImageService.importImageServer($scope.image_server_id,$scope.image_server_name,$scope.image_server_des,function(data){
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

        $scope.DeleteImageServer = function (image_server_id) {
            $.SmartMessageBox({
                title: "Delete Image Server!",
                content: "Are You Sure To Delete Image Server?",
                buttons: '[No][Yes]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Yes") {
                    navImageService.deleteImageServer(image_server_id,function(data){
                        $scope.return_data = data;
                        if ($scope.return_data.error != null){

                            $.smallBox({
                                title: "Delete Error",
                                content: "<i class='fa fa-clock-o'></i> <i>Image Server Not Deleted.</i>",
                                color: "#C46A69",
                                iconSmall: "fa fa-times fa-2x fadeInRight animated",
                                timeout: 4000
                            });
                        }
                        else{
                            $.smallBox({
                                title: "Image Server Deleted",
                                content: "<i class='fa fa-clock-o'></i> <i>Server has been Deleted.</i>",
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
                        title: "Delete Image Server Has Been Canceled",
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
