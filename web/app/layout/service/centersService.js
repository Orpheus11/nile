define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('centersService', function( server ) {
        var centers = [];
        var centersService = {};


        function getAllCenters () {
            centers.length = 0;
            return server.get('centers').then(function (result){

                angular.forEach(result.data, function (item) {
                    centers.push(item);
                })

            })
        }
        angular.extend(centersService, {
            centers: centers,
            getAllCenters : getAllCenters
        });

        return centersService;


    })
});