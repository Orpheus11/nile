define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('imageService', function($http,$log) {
        var imageService = {};
        var dropzone=null;
        var ip="";
        /*function GetImageServerDetail(image_server_id,callback){
            $http.get(appConfig.apiUrl+'/servers/detail/'+server_id).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }*/
        function GetImageServerDetail(imageserverid,callback){
            $http.get(appConfig.apiUrl+'/imageservers/detail/'+imageserverid).success(function(data){
                ip = data.ip;
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        angular.extend(imageService, {
            /*getServerDetail:GetServerDetail*/
            ip:ip,
            getImageServerDetail:GetImageServerDetail
        });

        return imageService;
	})
});
