define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('consoleService', function($http,$log) {
        var consoleService = {};
        var consoleServers = [];
        /*function GetImageServerDetail(image_server_id,callback){
            $http.get(appConfig.apiUrl+'/servers/detail/'+server_id).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }*/

        function listConsoleServers(){
            $http.get(appConfig.apiUrl+'/spiceservers').success(function(data){
                consoleServers.length = 0;
                angular.forEach(data, function (item) {
                    consoleServers.push(item);
                    // console.log(" > storageServers", storageServers);
                });
            }).error(function(){
                $log.log('Error');
                // callback([]);
            });
        }


        function GetConsoleServerDetail(consoleserverid,callback){
            $http.get(appConfig.apiUrl+'/spiceservers/detail/'+consoleserverid).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });

        }
        function GetVMConsole(vm_id,callback){
            var postData = {id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/console',postData,config).success(function(data){
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
        function ImportConsoleServer(console_server_id,console_server_name,console_server_ip,des,callback){
            var postData = {name:console_server_name,id:console_server_id,description:des,ip:console_server_ip};
            var config = {};
            console.log("in import console");
            $http.post(appConfig.apiUrl+'/spiceservers/outside',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        
        angular.extend(consoleService, {
            /*getServerDetail:GetServerDetail*/
            consoleServers : consoleServers,
            listConsoleServers : listConsoleServers,
            getVMConsole : GetVMConsole,
            getConsoleServerDetail:GetConsoleServerDetail,
            getOutsideConsoleServers:GetOutsideConsoleServers,
            importConsoleServer:ImportConsoleServer
        });

        return consoleService;
	})
});
