define(['app',
    'appConfig'], function (app) {
    "use strict";

    return app.factory('navImageService', function ($http, $log) {

        function GetImageServers(callback){
            $http.get(appConfig.apiUrl+'/imageservers').success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function GetImageServerIps(image_server_id, callback){
             var postData = {id:image_server_id};
             $http.post(appConfig.apiUrl+'/imageservers/getips', postData).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function EditImageServer(image_server_id,image_server_name,des,image_server_ip,callback){
            var postData = {name:image_server_name,id:image_server_id,description:des,ip:image_server_ip};
            var config = {};
            $http.post(appConfig.apiUrl+'/imageservers/edit',postData,config).success(function(data){
                callback(data);

            }).error(function(){
                $log.log('Error');
                callback([]);
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

        function ImportImageServer(image_server_id,image_server_name,des,callback){
            var postData = {name:image_server_name,id:image_server_id,description:des};
            var config = {};
            $http.post(appConfig.apiUrl+'/imageservers/outside',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function DeleteImageServer(image_server_id,callback){
            var postData = {id:image_server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/imageservers/delete',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function GetImageServerDetail(imageserverid,callback){
            $http.get(appConfig.apiUrl+'/imageservers/detail/'+imageserverid).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });

        }

        function GetImageServerDetailImage(imageserverid,callback){
            $http.get(appConfig.apiUrl+'/imageservers/detail/image/'+imageserverid).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });

        }
        function GetImageServerDetailISO(imageserverid,callback){
            $http.get(appConfig.apiUrl+'/imageservers/detail/iso/'+imageserverid).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });

        }

		return{
            getImageServers:function(callback){
                GetImageServers(callback);
            },
            editImageServer:function(image_server_id,image_server_name,description,image_server_ip,callback){
                EditImageServer(image_server_id,image_server_name,description,image_server_ip,callback);
            },
            getOutsideImageServers:function(callback){
                GetOutsideImageServers(callback);
            },
            GetImageServerIps:function(image_server_id,callback){
                GetImageServerIps(image_server_id,callback);
            },
            importImageServer:function(image_server_id,image_server_name,des,callback){
                ImportImageServer(image_server_id,image_server_name,des,callback);
            },
            deleteImageServer:function(image_server_id,callback){
                DeleteImageServer(image_server_id,callback);
            },
            getImageServerDetail:function(imageserverid,callback){
                GetImageServerDetail(imageserverid,callback);
            },
            getImageServerDetailImage:function(imageserverid,callback){
                GetImageServerDetailImage(imageserverid,callback);
            },
            getImageServerDetailISO:function(imageserverid,callback){
                GetImageServerDetailISO(imageserverid,callback);
            }
		}
	})
})
