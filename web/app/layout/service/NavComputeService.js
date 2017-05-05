define(['app',
    'appConfig'], function (app) {
    "use strict";

    return app.factory('navComputeService', function ($http, $log) {

        function GetCenters(callback) {

            $http.get(appConfig.apiUrl + '/centers').success(function (data) {

                callback(data);

            }).error(function () {

                $log.log('Error');
                callback([]);
            });

        }



        function GetServers(center_id,callback) {
            $http.get(appConfig.apiUrl + '/centers/getservers/'+center_id).success(function (data) {
                callback(data);
            }).error(function () {
                $log.log('Error');
                callback([]);
            });
        }

        function GetVms(server_id,callback) {
            $http.get(appConfig.apiUrl + '/vms/getvms/'+server_id).success(function (data) {
                callback(data);
            }).error(function () {
                $log.log('Error');
                callback([]);
            });
        }

        function getCenterVms(center_id,callback) {
            $http.get(appConfig.apiUrl + '/centers/getvms/'+center_id).success(function (data) {
                callback(data);
            }).error(function () {
                $log.log('Error');
                callback([]);
            });
        }
        
        // function getHaDetail(center_id,callback) {
        //     $http.get(appConfig.apiUrl + '/ha/hadetail?entity_id='+center_id).success(function (data) {
        //         callback(data);
        //     }).error(function () {
        //         $log.log('Error');
        //         callback([]);
        //     });
        // }

        return{
            getCenters:function(callback){
                GetCenters(callback);
			},
            getServers:function(center_id,callback){
                GetServers(center_id,callback);
            },
            getVms:function(server_id,callback){
                GetVms(server_id,callback);
            },
            getCenterVms:function(center_id,callback){
                getCenterVms(center_id,callback);
            }
            // ,
            // getHaDetail:function(center_id,callback){
            //     getHaDetail(center_id,callback);
            // }
		}
	})
})
