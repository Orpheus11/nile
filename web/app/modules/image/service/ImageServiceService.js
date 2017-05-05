define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('imageServiceService', function($http,$log) {
        var imageServiceService = {};
        var imageServers = [];
        /*function GetImageServerDetail(image_server_id,callback){
            $http.get(appConfig.apiUrl+'/servers/detail/'+server_id).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }*/

        function listImageServers(){
            $http.get(appConfig.apiUrl+'/imageservers').success(function(data){
                imageServers.length = 0;
                angular.forEach(data, function (item) {
                    imageServers.push(item);
                    // console.log(" > storageServers", storageServers);
                });
            }).error(function(){
                $log.log('Error');
                // callback([]);
            });
        }

        function GetOutsideImageServers(callback){
            $http.get(appConfig.apiUrl+'/imageservers/outside').success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function ImportImageServer(image_server_id,image_server_name,image_server_ip,des,callback){
            var postData = {name:image_server_name,id:image_server_id,ip:image_server_ip,description:des};
            var config = {};
            $http.post(appConfig.apiUrl+'/imageservers/outside',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function Deleteimagefile(imageserver_id,id,callback) {
            var postData = {imageserver_id:imageserver_id,imagefile_id:id};
            var config = {};
            $http.post(appConfig.apiUrl+'/imageservers/deleteimagefile',postData,config).success(function(data){
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

        angular.extend(imageServiceService, {
            /*getServerDetail:GetServerDetail*/
            imageServers : imageServers,
            listImageServers : listImageServers,
            getOutsideImageServers: GetOutsideImageServers,
            importImageServer:ImportImageServer,
            deleteimagefile:Deleteimagefile
        });

        return imageServiceService;
	})
});
