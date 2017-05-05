define(['app',
    'appConfig'], function(app){
    "use strict";

	    return app.factory('navStorageService', function($http,$log) {

            function GetStorageServers(callback){
                $http.get(appConfig.apiUrl+'/storage').success(function(data){
                    callback(data);
                }).error(function(){
                    $log.log('Error');
                    callback([]);
                });
            }

            function EditStorageServer(server_id,server_name,des,callback){
                var postData = {name:server_name,id:server_id,description:des};
                var config = {};
                $http.post(appConfig.apiUrl+'/storage/edit',postData,config).success(function(data){
                    callback(data);

                }).error(function(){
                    $log.log('Error');
                    callback([]);
                });
            }
            function DeleteStorageServer(server_id,callback){
                var postData = {id:server_id};
                var config = {};
                $http.post(appConfig.apiUrl+'/storage/delete',postData,config).success(function(data){
                    callback(data);
                }).error(function(){
                    $log.log('Error');
                    callback([]);
                });
            }

		return{
            getStorageServers:function(callback){
                GetStorageServers(callback);
            },
            editStorageServer:EditStorageServer,
            deleteStorageServer:DeleteStorageServer
		}
	})
})
