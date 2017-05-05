define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('storageService', function($http,$log) {
        var storageService = {};
        var storageServers = [];

        /*function GetImageServerDetail(image_server_id,callback){
         $http.get(appConfig.apiUrl+'/servers/detail/'+server_id).success(function(data){
         callback(data);
         }).error(function(){
         $log.log('Error');
         callback([]);
         });
         }*/
        function listStorageServers(){
            $http.get(appConfig.apiUrl+'/storage').success(function(data){
                // callback(data);
                // alert(data);
                console.log(" > storage", data);
                // alert(data[0].id)
                // storageServers = data;
                storageServers.length = 0;
                angular.forEach(data, function (item) {
                    storageServers.push(item);
                    // console.log(" > storageServers", storageServers);
                });

            }).error(function(){
                $log.log('Error');
                // callback([]);
            });
        }

        function GetOutsideStorageServers(callback){
            $http.get(appConfig.apiUrl+'/storage/outside').success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function ImportStorageServer(image_server_id,image_server_name,des,callback){
            var postData = {name:image_server_name,id:image_server_id,description:des};
            var config = {};
            $http.post(appConfig.apiUrl+'/storage/outside',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        /*function ImportImageServer1(image_server_id,image_server_name,des,callback){
         var postData = {name: "123", grade: 123, description: "123"};
         var config = {};
         $http.post(appConfig.apiUrl+'/auth/adddep',postData,config).success(function(data){
         callback(data);
         }).error(function(){
         $log.log('Error');
         callback([]);
         });
         }*/

        angular.extend(storageService, {
            /*getServerDetail:GetServerDetail*/
            getOutsideStorageServers: GetOutsideStorageServers,
            importStorageServer:ImportStorageServer,
            storageServers : storageServers,
            listStorageServers : listStorageServers
        });

        return storageService;
    })
});
