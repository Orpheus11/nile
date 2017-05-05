define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('centerService', function($http,$log) {
        var centerService = {};

        function GetCenterDetail(center_id,callback){
            $http.get(appConfig.apiUrl+'/centers/detail/'+center_id).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function GetCenterVms(center_id,callback){
            $http.get(appConfig.apiUrl+'/centers/getvms/'+center_id).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        /*function GetServerVmsDetail(server_id,callback){
            $http.get(appConfig.apiUrl+'/servers/vmsdetail/'+server_id).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }*/


        
        angular.extend(centerService, {
            getCenterDetail:GetCenterDetail,
            getCenterVms:GetCenterVms
            /*getServerVmsDetail:GetServerVmsDetail*/
        });

        return centerService;
	})
});
