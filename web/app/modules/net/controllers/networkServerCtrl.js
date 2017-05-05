define(['modules/net/module'], function (module) {

    'use strict';

    module.registerController('NetworkServerCtrl', function ($stateParams,$scope,$http,networkService,ngDialog) {
        $scope.network_server_id = $stateParams.networkserverid;
        networkService.network_server_id = "";
        networkService.network_server_id = $stateParams.networkserverid;
        networkService.physical_interfaces = [];
        networkService.ovs_brs = [];
        if($scope.network_server_id!= undefined){
            $http({
                method: "get",
                url: appConfig.apiUrl+"/networkservers/getnetworkserver?id="+$scope.network_server_id
            }).success(function(data){
                $scope.networkserver=data.networkserver;
                $scope.physical_interfaces = $scope.networkserver.Physical_interfaces.split(",");
                networkService.physical_interfaces = $scope.physical_interfaces;
                $scope.ovs_brs = $scope.networkserver.Ovs_brs.split(",");
                networkService.ovs_brs = $scope.ovs_brs;
            })
        }

        $scope.vlans = networkService.vlans;
        $scope.ips = networkService.ips;

        function listVlans(){
            networkService.listVlans($stateParams.networkserverid);
        }
        function listIps(){
            networkService.listIps($stateParams.networkserverid);
        }

        listVlans();
        listIps();

        $scope.deleteVlan = function(vlan){
            networkService.deleteVlan(vlan).then(function () {
                networkService.listVlans(networkService.network_server_id);
                networkService.listIps(networkService.network_server_id);
            });
        }

        $scope.editVlan = function(vlan){
            networkService.setCurrentVlan(vlan);
            // networkService.editVlan(vlan).then(listVlans);

            ngDialog.open({
                template: 'app/modules/net/views/vlan_edit.html',
                controller: 'vlanEditController'
            });
        }


        module.registerController('vlanEditController', function ($scope, networkService, ngDialog) {
            $scope.newVlan = networkService.currentVlan;

            $scope.formSubmit = function () {
                networkService.editVlan($scope.newVlan).then(function () {
                    networkService.listVlans(networkService.network_server_id);
                    // networkService.listIps(networkService.network_server_id);
                    ngDialog.closeAll();
                });
            }
        });

        module.registerController('vlanCreateController', function ($scope, networkService, ngDialog) {
            $scope.newVlan = {
                Network_server_id:networkService.network_server_id
            };
            $scope.vlans = networkService.vlans;
            $scope.physical_interfaces = networkService.physical_interfaces;
            $scope.ovs_brs = networkService.ovs_brs;
            $scope.formSubmit = function () {
                networkService.createVlan($scope.newVlan).then(function () {
                    networkService.listVlans(networkService.network_server_id);
                    networkService.listIps(networkService.network_server_id);
                    ngDialog.closeAll();
                });
            }
        });

        $scope.listIps = function(){
            $scope.range = [];
            $scope.preShow = false;
            $scope.endShow = false;
            $scope.itemsPerPage = 10;
            $scope.currentPage = 0;
            $scope.pageCount = Math.ceil($scope.ips.length/$scope.itemsPerPage)-1;
            $scope.fromCount = $scope.currentPage*$scope.itemsPerPage + 1;
            $scope.toCount = ($scope.currentPage+1)*$scope.itemsPerPage;
            if ($scope.itemsPerPage*($scope.currentPage+1)>$scope.ips.length){
                $scope.toCount = $scope.ips.length;
            }

            $scope.prevPage = function() { 
                if ($scope.currentPage > 0) {
                    $scope.currentPage--; 
                }
                $scope.fromCount = $scope.currentPage*$scope.itemsPerPage + 1;
                $scope.toCount = ($scope.currentPage+1)*$scope.itemsPerPage;
                if ($scope.itemsPerPage*($scope.currentPage+1)>$scope.ips.length){
                    $scope.toCount = $scope.ips.length;
                }
                rangeFn($scope.currentPage);
            };


            $scope.prevPageDisabled = function() {
                return $scope.currentPage === 0 ? "paginate_button previous disabled" : "paginate_button previous";
            };

            function rangeFn(current) {
                var pageList = [];
                if ($scope.pageCount > 10) {
                    if (current < 5) {
                        $scope.range = [0,1,2,3,4,5];
                        $scope.preShow = false;
                        $scope.endShow = true;
                    }
                    if(current === 5){
                        $scope.range = [4,5,6];
                        $scope.preShow = true;
                        $scope.endShow = true;
                    }
                    if (current > 5){
                        if ((current+4) < $scope.pageCount){
                            $scope.range = [current-1,current,current+1];
                            $scope.preShow = true;
                            $scope.endShow = true;
                        }
                        if ((current+4) === $scope.pageCount) {
                            $scope.range = [current-1,current,current+1];
                            $scope.preShow = true;
                            $scope.endShow = true;
                        };
                        if((current+4) > $scope.pageCount) {
                            $scope.range = [$scope.pageCount-4,$scope.pageCount-3,$scope.pageCount-2,$scope.pageCount-1,$scope.pageCount];
                            $scope.preShow = true;
                            $scope.endShow = false;
                        }
                    }
                }else{
                    for (var i = 0; i <= $scope.pageCount; i++) {
                        $scope.range[i] = i;
                        $scope.preShow = false;
                        $scope.endShow = false;
                    };
                }
            }
            rangeFn($scope.currentPage);

            $scope.nextPage = function() {
                if ($scope.currentPage < $scope.pageCount) {
                    $scope.currentPage++; 
                }
                $scope.fromCount = $scope.currentPage*$scope.itemsPerPage + 1;
                $scope.toCount = ($scope.currentPage+1)*$scope.itemsPerPage;
                if ($scope.itemsPerPage*($scope.currentPage+1)>$scope.ips.length){
                    $scope.toCount = $scope.ips.length;
                }
                rangeFn($scope.currentPage);
            };

            $scope.setPage = function(n) {
                $scope.currentPage = n;
                $scope.fromCount = $scope.currentPage*$scope.itemsPerPage + 1;
                $scope.toCount = ($scope.currentPage+1)*$scope.itemsPerPage;
                if ($scope.itemsPerPage*($scope.currentPage+1)>$scope.ips.length){
                    $scope.toCount = $scope.ips.length;
                }
                rangeFn(n);
            };

            $scope.nextPageDisabled = function() {
                return $scope.currentPage === $scope.pageCount ? "paginate_button next disabled" : "paginate_button next";
            }  
        };
  


    });
});
