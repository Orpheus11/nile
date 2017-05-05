define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('vmService', function($http,$log) {
        var vmService = {};
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

        function GetVMDetail(vm_id,callback){
            var postData = {id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/detail',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function GetVMHistory(vm_id,callback){
            var postData = {id:vm_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/vms/history',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }
        
        angular.extend(vmService, {
            getVMConsole : GetVMConsole,
            getVMDetail:GetVMDetail,
            getVMHistory:GetVMHistory
        });

        return vmService;
	})
});
