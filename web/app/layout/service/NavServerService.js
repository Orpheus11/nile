define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('navServerService', function($http,$log) {
        function ImportServer(server_id,center_id,server_name,des,callback){
            console.log("in Import server");
            var postData = {name:server_name,id:server_id,description:des,center_id:center_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/servers/outside',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }
        function EditServer(server_id,server_name,des,callback){
            var postData = {name:server_name,id:server_id,description:des};
            var config = {};
            $http.post(appConfig.apiUrl+'/servers/edit',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function DeleteServer(server_id,callback){
            var postData = {id:server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/servers/delete',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }
        function RefreshServer(server_id,callback){
            var postData = {id:server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/servers/refresh',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function MigrateServer(server_id,center_id,callback){
            var postData = {server_id:server_id,center_id:center_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/servers/movetocenter',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function StartVMs(server_id,callback){
            var postData = {id:server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/servers/startvms',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function ShutdownVMs(server_id,callback){
            var postData = {id:server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/servers/shutdownvms',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function ForceShutdownVMs(server_id,callback){
            var postData = {id:server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/servers/forceshutdownvms',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }


		return{
            importServer:function(server_id,center_id,server_name,des,callback){
                ImportServer(server_id,center_id,server_name,des,callback);
            },
            editServer:function(server_id,server_name,des,callback){
                EditServer(server_id,server_name,des,callback);
            },
            deleteServer:function(server_id,callback){
                DeleteServer(server_id, callback);
            },
            migrateServer:function(server_id,center_id,callback){
                MigrateServer(server_id,center_id,callback);
            },
            refreshServer:function(server_id,callback){
                RefreshServer(server_id, callback);
            },
            startVMs:function(server_id,callback){
                StartVMs(server_id, callback);
            },
            shutdownVMs:function(server_id,callback){
                ShutdownVMs(server_id, callback);
            },
            forceShutdownVMs:function(server_id,callback){
                ForceShutdownVMs(server_id, callback);
            }

		}
	})
})
