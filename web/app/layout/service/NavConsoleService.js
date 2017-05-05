define(['app',
    'appConfig'], function (app) {
    "use strict";

    return app.factory('navConsoleService', function ($http, $log) {

        function GetConsoleServers(callback){
            $http.get(appConfig.apiUrl+'/spiceservers').success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function GetConsoleServerIps(console_server_id, callback){
             var postData = {id:console_server_id};
             $http.post(appConfig.apiUrl+'/spiceservers/getips', postData).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function EditConsoleServer(console_server_id,console_server_name,des,console_server_ip,callback){
            var postData = {name:console_server_name,id:console_server_id,description:des,ip:console_server_ip};
            var config = {};
            $http.post(appConfig.apiUrl+'/spiceservers/edit',postData,config).success(function(data){
                callback(data);

            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function GetOutsideConsoleServers(callback){
            $http.get(appConfig.apiUrl+'/spiceservers/outside').success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function ImportConsoleServer(console_server_id,console_server_name,des,callback){
            var postData = {name:console_server_name,id:console_server_id,description:des};
            var config = {};
            $http.post(appConfig.apiUrl+'/spiceservers/outside',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function DeleteConsoleServer(console_server_id,callback){
            var postData = {id:console_server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/spiceservers/delete',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }


        function BindingConsoleServer(center_id,console_server_id, callback){
            var postData = {center_id:center_id,console_server_id:console_server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/spiceservers/bind',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

		return{
            getConsoleServers:function(callback){
                GetConsoleServers(callback);
            },
            GetConsoleServerIps:function(console_server_id,callback){
                GetConsoleServerIps(console_server_id,callback);
            },
            editConsoleServer:function(console_server_id,console_server_name,description,console_server_ip,callback){
                EditConsoleServer(console_server_id,console_server_name,description,console_server_ip,callback);
            },
            getOutsideConsoleServers:function(callback){
                GetOutsideConsoleServers(callback);
            },
            importConsoleServer:function(console_server_id,console_server_name,des,callback){
                ImportConsoleServer(console_server_id,console_server_name,des,callback);
            },
            deleteConsoleServer:function(console_server_id,callback){
                DeleteConsoleServer(console_server_id,callback);
            },
            bindingConsoleServer:function(center_id,console_server_id,callback){
                BindingConsoleServer(center_id,console_server_id, callback);
            }
		}
	})
})
