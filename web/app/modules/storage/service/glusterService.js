define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('glusterService', function($http, $log, $q, server) {
        var glusterService = {};

        var volumes = [];
        var bricks = [];
        var centers = [];
        var centerVolumeMap = {};
        var brickVolumeMap = {};

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

        function getCenterVolume (successCallback) {
            return server.get('storage/gluster/listcentervolume', storageConfig);
        }

        function getAllVolumes() {
            return server.get('storage/gluster/listvolume', storageConfig);
        }

        function getvolumeBrick () {
            return server.get('storage/gluster/listvolumebrick', storageConfig);
        }

        function getVolumesWidthCenters () {
            centerVolumeMap = {};
            brickVolumeMap = {};
            $q.all([getAllVolumes(), getCenterVolume(), getvolumeBrick()]).then(function (result) {
                console.log(" $q.all ", result);
                var allVolumes = result[0].data,
                    centerVolumes = result[1].data,
                    volumeBricks = result[2].data;

                angular.forEach(centerVolumes, function (item) {
                    if ( ! centerVolumeMap[item.volume_id]) {
                        centerVolumeMap[item.volume_id] = [];
                    }
                    centerVolumeMap[item.volume_id].push(item);
                });

                angular.forEach(volumeBricks, function (item) {
                    if ( ! brickVolumeMap[item.volume_id]) {
                        brickVolumeMap[item.volume_id] = [];
                    }
                    brickVolumeMap[item.volume_id].push(item);
                });

                volumes.length = 0;
                angular.forEach(allVolumes, function (item) {
                    item.centers = centerVolumeMap[item.id];
                    item.bricks = brickVolumeMap[item.id];
                    console.log(centerVolumeMap);
                    console.log(brickVolumeMap);
                    console.log(item.id)
                    volumes.push(item);
                });

                console.log("getVolumesWidthCenters > ", volumes);
            });
        }
        function createVolume (volume,callback) {
           // return server.post('storage/gluster/createglfsvolume', volume ,storageConfig);
             server.post('storage/gluster/createglfsvolume', volume ,storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }
        function getAllBricks () {
            return server.get('storage/gluster/listbrick', storageConfig);
        }

        function getAllBrickWithVolume () {
            // brickVolumeMap = {};
            // $q.all([getAllBricks(), getvolumeBrick()]).then(function (result) {
            //     var allBricks = result[0].data,
            //         volumeBricks = result[1].data;

            //     angular.forEach(volumeBricks, function (item) {
            //         if ( ! brickVolumeMap[item.brick_id]) {
            //             brickVolumeMap[item.brick_id] = [];
            //         }
            //         brickVolumeMap[item.brick_id].push(item);
            //     });

            //     bricks.length = 0;
            //     angular.forEach(allBricks, function (item) {
            //         item.volumes = brickVolumeMap[item.id];
            //         bricks.push(item);
            //     });
            // });

            return server.get("storage/gluster/listbrick", storageConfig).then(function (result) {
                bricks.length = 0;
                console.log(" > bricks", result);
                angular.forEach(result.data, function (item) {
                    bricks.push(item);
                });
            });

        }

        function getServersByCenter (volume, center) {
            return server.post('storage/gluster/listservervolumebycenteridvolumeid', {
                center_id : center.center_id,
                volume_id    : volume.id
            }, storageConfig);
        }

        function getBricksByVolumId(volume_id){
            return server.get("storage/gluster/listvolumebrickbyvolumeid?volume_id="+volume_id).then(function (result) {
                bricks.length = 0;
                console.log(" > bricks", result);
                angular.forEach(result.data, function (item) {
                    bricks.push(item);
                });
            });
        }

        function createCenter (volume, center, callback) {
            // return server.post('storage/gluster/bindglfsvolume', {
            //     volume_id : volume.id,
            //     center_id : center.center_id,
            //     mount_dir : center.dir
            // }, storageConfig);
            server.post('storage/gluster/bindglfsvolume', {
                volume_id : volume.id,
                center_id : center.center_id,
                mount_dir : center.dir
            },storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function unbindCenter (volume, center, callback) {
            // return server.post('storage/gluster/unbindglfsvolume', {
            //     volume_id : volume.id,
            //     center_id : center.center_id,
            //     mount_dir : center.mount_dir
            // }, storageConfig);
             server.post('storage/gluster/unbindglfsvolume', {
                volume_id : volume.id,
                center_id : center.center_id,
                mount_dir : center.mount_dir
            },storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function createBrick (brick, callback) {
            console.log(brick);
            server.post('storage/gluster/addglfsbrick', brick, storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
            //return server.post('storage/gluster/addglfsbrick', brick, storageConfig);
        }

        function openVolume (volume, callback) {
            server.post('storage/gluster/startglfsvolume', {
                volume_id : volume.id
            }, storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function rebalanceVolume(volume, callback) {
            server.post('storage/gluster/rebalancevolume', {
                volume_id : volume.id
            }, storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            }).then(getAllBrickWithVolume);
        }

        function addVolumeBrick(volume, callback) {
            //return server.post('storage/gluster/addvolumebrick', volume, storageConfig).then(getAllBrickWithVolume);
            server.post('storage/gluster/addvolumebrick', volume, storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            }).then(getAllBrickWithVolume);
        }

        function closeVolume(volume, callback) {
            server.post('storage/gluster/stopglfsvolume', {
                volume_id : volume.id,
                brick_id_list : volume.brick_id_list,
            }, storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function deleteVolume (volume, callback) {
            server.post('storage/gluster/deleteglfsvolume', {
                volume_id : volume.id
            }, storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }
        function deleteBrick (brick, callback) {
            server.post('storage/gluster/deleteglfsbrick', {
                brick_id : brick.id
            }, storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function replaceVolume (volume, brick, target, callback){
            server.post('storage/gluster/replacevolumebrick', {
                volume_id : volume.id,
                brick_id_old : brick.id,
                brick_id_new : target.id
            }, storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function mountServer (_server, callback) {
            server.post('storage/gluster/bindvolumebyserverid', {
                volume_id: _server.volume_id,
                center_id: _server.center_id,
                server_id: _server.server_id,
                mount_dir: _server.mount_dir
            }, storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function unmountServer (_server, callback) {
            server.post('storage/gluster/unbindvolumebyserverid', {
                volume_id: _server.volume_id,
                center_id: _server.center_id,
                server_id: _server.server_id,
                mount_dir: _server.mount_dir
            }, storageConfig).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        angular.extend(glusterService, {
            volumes: volumes,
            getAllVolumes : getVolumesWidthCenters,
            createVolume: createVolume,
            deleteVolume: deleteVolume,
            replaceVolume: replaceVolume,
            openVolume: openVolume,
            closeVolume: closeVolume,
            rebalanceVolume : rebalanceVolume,
            addVolumeBrick : addVolumeBrick,
            bricks : bricks,
            centers : centers,
            getAllBricks: getAllBrickWithVolume,
            createBrick: createBrick,
            deleteBrick: deleteBrick,
            unbindCenter: unbindCenter,
            getServersByCenter: getServersByCenter,
            mountServer: mountServer,
            unmountServer: unmountServer,
            createCenter: createCenter,

            setStorageServer : setStorageServer
        });

        return glusterService;
    })
});
