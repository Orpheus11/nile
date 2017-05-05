define(['app',
    'appConfig'], function(app) {
    "use strict";


    return app.factory('monitorService', function ($http, server) {
        var monitorService = {};
        var currentTime = (new Date).getTime();
        function getMonitor(entity_id) {
            // entity_id = "64d17984-2a08-4627-a761-050e04178f21";
            return server.get("monitor/listbyentityid?entity_id="+entity_id);
        };
        function getMonitorLimitOneHour(entity_id) {
            //entity_id = "e474b93b-23f7-457c-a565-a869de7a36e6";
            return server.get("monitor/listbyentityidlimitonehour?entity_id="+entity_id);
        };
        function getcurrentTime() {
            server.get("currenttime").then(function (result) {
                currentTime = Number(result.data);
            });
            return currentTime;
        };
        getcurrentTime();
        angular.extend(monitorService, {
            getMonitor : getMonitor,
            getMonitorLimitOneHour : getMonitorLimitOneHour,
            currentTime : currentTime,
            getcurrentTime : getcurrentTime
        });

        return monitorService;

    });
});