define(['app',
    'appConfig'], function(app) {
    "use strict";


    return app.factory('navPolicyService', function ($http, $log) {
        var navPolicyService = {};
        var dwmTimeList = [];

        function getHaDetail(center_id,callback) {
            $http.get(appConfig.apiUrl + '/ha/hadetail?entity_id='+center_id).success(function (data) {
                callback(data);
            }).error(function () {
                $log.log('Error');
                callback([]);
            });
        }

        function setHighAvailable($scope,callback){
            var postData = {entity_id:$scope.center_id,entity_type:$scope.center_type,general_object:{
                enable_ha:$scope.enable_ha,failover:$scope.failover,migrate_back:$scope.migrate_back,
                use_standby:$scope.use_standby,preferred_servers_list:$scope.preferred_servers_list,
                vm_priority_list:$scope.vm_priority_list
                // ,advance_object:{wait_interval:$scope.wait_interval,retry_count:$scope.retry_count}
            }};
            var config = {};
            console.log(postData);
            $http.post(appConfig.apiUrl+'/ha/handleha',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function getDwmDetail(center_id,callback) {
            $http.get(appConfig.apiUrl + '/dwm/dwmdetails?entity_id='+center_id).success(function (data) {
                callback(data);
            }).error(function () {
                $log.log('Error');
                callback([]);
            });
        }

        function setDwm($scope,callback){
            var postData = {entity_id:$scope.center_id,enable_dwm:$scope.enable_dwm,threshold:$scope.threshold,
                data_period:$scope.data_period,frequency:$scope.frequency,
                timeList:$scope.timeList
                };
            var config = {};
            console.log("postData:"+postData);
            $http.post(appConfig.apiUrl+'/dwm/handledwmdetails',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }
        angular.extend(navPolicyService, {
            getHaDetail : getHaDetail,
            setHighAvailable : setHighAvailable,
            dwmTimeList : dwmTimeList,
            setDwm : setDwm,
            getDwmDetail : getDwmDetail
        });

        return navPolicyService;

    });
});