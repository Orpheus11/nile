define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('dashboardService', function($http,$log,server) {
        var dashboardService = {};

        function listHistory(callback){
            $http.get(appConfig.apiUrl+'/dashboard/history').success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }
        function dashboardInfo(callback){
            $http.get(appConfig.apiUrl+'/dashboard/cloudinfo').success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function outside_servers(callback){
            $http.get(appConfig.apiUrl+'/servers/outside').success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function dashboardCenters(callback){
            $http.get(appConfig.apiUrl+'/centers').success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function listWeekHistory(){
            return server.get('dashboard/historylastweek');
        }

        function listMonthHistory(){
            return server.get('dashboard/historylastmonth');
        }

        function listAllHistory(){
            return server.get('dashboard/historyall');
        }

        angular.extend(dashboardService, {
            listHistory : listHistory,
            dashboardInfo : dashboardInfo,
            outside_servers :outside_servers,
            dashboardCenters:dashboardCenters,
            listWeekHistory: listWeekHistory,
            listMonthHistory: listMonthHistory,
            listAllHistory: listAllHistory

        });

        return dashboardService;
	})
});
