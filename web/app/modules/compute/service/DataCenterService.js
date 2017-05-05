define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('dataCenterService', function($http,$log) {
        var dataCenterService = {};
        var centers = [];
        function listCenters(){
            $http.get(appConfig.apiUrl+'/centers').success(function(data){
                // callback(data);
                // alert(data);
                console.log(" > centers", data);
                // alert(data[0].id)
                // storageServers = data;
                centers.length = 0;
                angular.forEach(data, function (item) {
                    centers.push(item);
                    // console.log(" > storageServers", storageServers);
                });

            }).error(function(){
                $log.log('Error');
                // callback([]);
            });
        }

        function GetOutsideServers(callback) {
            $http.get(appConfig.apiUrl + '/servers/outside').success(function (data) {
                callback(data);
            }).error(function () {
                $log.log('Error');
                callback([]);
            });
        }

        function GetCenters(callback) {
            $http.get(appConfig.apiUrl + '/centers').success(function (data) {
                callback(data);
            }).error(function () {
                $log.log('Error');
                callback([]);
            });
        }

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
        
        angular.extend(dataCenterService, {
            centers : centers,
            listCenters : listCenters,
            getOutsideServers: GetOutsideServers,
            getCenters:GetCenters,
            importServer:ImportServer
/*            getServerDetail:GetServerDetail,
            getServerVmsDetail:GetServerVmsDetail*/
        });

        return dataCenterService;
	})
});
