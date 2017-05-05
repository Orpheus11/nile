define(['modules/storage/module'], function (module) {

    'use strict';

    module.registerController('storageNfsCtrl', function ($scope, $stateParams, nfsService, centersService) {
        console.log("registerController called > ",  $stateParams);

        nfsService.setStorageServer($stateParams.storageserverid);

        $scope.nfs = nfsService.nfs;
        $scope.currentCenter = {};
        $scope.centers = centersService.centers;

        $scope.unbindShow = false;

        nfsService.getAllNfs();
        centersService.getAllCenters();


        $scope.deleteNfs = function (nfs) {
            nfsService.deleteNfs(nfs).then(function () {
                $.bigBox({
                    title: "delete nfs successed"
                });
                nfsService.getAllNfs();
            });
        }

        $scope.createNewNfs = function () {
            nfsService.createNfs($scope.newNfs).then(function () {
                $.bigBox({
                    title: "create nfs successed"
                });
                nfsService.getAllNfs();
                $('#AddNfs').modal('hide');
                $scope.newNfs = {};
            });
        }

        $scope.unbind = function (nfs, center) {
            nfsService.unbindCenter(nfs, center).then(function () {
                $.bigBox({
                    title: "unbind center to  nfs successed"
                });
                nfsService.getAllNfs();
            });
        }

        var editCenter = $scope.editCenter = function (nfs, center) {
            console.log("center", center)
            $scope.currentCenter =  angular.copy(center);
            nfsService.getServersByCenter(nfs, $scope.currentCenter).then(function (result) {
                $scope.currentCenter.servers = result.data;
                $scope.unbindShow = true;
            });
        }

        $scope.AddCenter = function (nfs) {
            $scope.currentNfs =  angular.copy(nfs);
            console.log(">add Center:", $scope.centers);
            $('#AddCenter').modal();
        }

        $scope.createNewCenter = function () {
            var nfs = $scope.currentNfs
            nfsService.createCenter(nfs, $scope.newCenter).then(function (result) {
                $.bigBox({
                    title: "create center  successed"
                });
                nfsService.getAllNfs();
                $('#AddCenter').modal('hide');
                $scope.newCenter = {};
            });
        }

        $scope.closeUnbind = function () {
            $scope.unbindShow = false;
        }

        $scope.mountServer = function (nfs, server) {
            nfsService.mountServer(nfs, $scope.currentCenter, server).then(function (result) {
                $.bigBox({
                    title: "mount nfs successed"
                });
                nfsService.getAllNfs();
               // unbind();
            });
        }

        $scope.unmountServer = function (nfs, server) {
            nfsService.unmountServer(nfs, $scope.currentCenter, server).then(function (result) {
                $.bigBox({
                    title: "unmount nfs successed"
                });
                nfsService.getAllNfs();
                //unbind();
            });
        }
    });

});
