define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('serverService', function($http,$log) {
        var serverService = {};

        function GetServerDetail(server_id,callback){
            $http.get(appConfig.apiUrl+'/servers/detail/'+server_id).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function GetServerVmsDetail(server_id,callback){
            $http.get(appConfig.apiUrl+'/servers/vmsdetail/'+server_id).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function GetServerMacsDetail(server_id,callback){
            $http.get(appConfig.apiUrl+'/servers/servernetworkinfo/'+server_id).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function GetServerDisksDetail(server_id,callback){
            $http.get(appConfig.apiUrl+'/servers/serverstorageinfo/'+server_id).success(function(data){
                callback(data);
            }).error(function(){
               $log.log('Error');
               callback([]);
            });
        }
        
        angular.extend(serverService, {
            getServerDetail:GetServerDetail,
            getServerVmsDetail:GetServerVmsDetail,
            getServerMacsDetail:GetServerMacsDetail,
            getServerDisksDetail:GetServerDisksDetail
        });

        return serverService;
	})
});
