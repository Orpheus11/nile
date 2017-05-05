define(['app',
    'appConfig'], function(app) {
    "use strict";

    return app.factory('nfsService', function ($http, $log, $q, server) {
        var nfsService = {};

        var nfs = [];
        var storageService = "";
        var storageConfig = {};

        function setStorageServer (storageServerId) {
            storageService = storageServerId;
            storageConfig = {
                params : {
                    storage_id : storageService
                }
            };
        }

        function getAllNfs () {
            nfs.length = 0;
            server.get('storage/listallnfs', storageConfig).then(function (result) {
                //console.log("> storage listall", result);
                angular.forEach(result.data, function (item) {
                    getCentersByNfs(item).then(function (centers) {
                        console.log(">> getCentersByNfs:", centers);
                        item.centers = centers;
                    });
                    nfs.push(item);

                });
            });
        }

        function createCenter (nfs, center ) {
            return server.post('storage/bindnfstocenter', {
                nfs_id : nfs.id,
                center_id : center.center_id,
                mount_dir : center.dir
            }, storageConfig);
        }

        function deleteNfs(nfs) {
            return server.post('storage/deletenfs', {
                nfs_id : nfs.id
            }, storageConfig);
        }

        function createNfs (nfs) {
            return server.post('storage/addnfs',nfs , storageConfig);
        }

        function getServersByCenter (nfs, center) {
            return server.post('storage/listservernfsbynfsidcenterid', {
                center_id : center.center_id,
                nfs_id    : nfs.id
            }, storageConfig);
        }

        function getCentersByNfs(nfs) {
            return server.post('storage/listcenternfsbynfsid', {
                nfs_id : nfs.id
            }, storageConfig).then(function (result) {
                var refer = $q.defer();
                refer.resolve(result.data);
                return refer.promise;
            });
        }

        function unbindCenter (nfs, center) {
            return server.post('storage/unbindnfsfromcenter', {
                nfs_id: nfs.id,
                center_id : center.center_id,
                mount_dir : center.mount_dir
            }, storageConfig);
        }

        function mountServer (nfs, center, _server) {
            console.log(_server)
            return server.post('storage/bindnfsbyserverid', {
                nfs_id: nfs.id,
                center_id: center.center_id,
                server_id: _server.server_id,
                mount_dir: center.mount_dir
            }, storageConfig);
        }

        function unmountServer (nfs, center, _server) {
            return server.post('storage/unbindnfsbyserverid', {
                nfs_id    : nfs.id,
                center_id : center.center_id,
                server_id : _server.server_id,
                mount_dir : center.mount_dir
            }, storageConfig);
        }
        angular.extend(nfsService, {
            nfs: nfs,
            getAllNfs: getAllNfs,
            deleteNfs: deleteNfs,
            createNfs: createNfs,
            unbindCenter: unbindCenter,
            getServersByCenter: getServersByCenter,
            mountServer: mountServer,
            unmountServer: unmountServer,
            createCenter: createCenter,

            setStorageServer : setStorageServer
        });

        return nfsService;
    });
});