define(['modules/net/module'], function (module) {

    'use strict';

    module.registerController('VxnetCtrl', function ($scope, projects) {
        var ifaces=projects.data.interfaces;
        var interfs="";
        for (var i in ifaces) {
            interfs=interfs+ifaces[i]+":"+ifaces[i];
            if (i < ifaces.length-1) {
                interfs=interfs+";"
            };
        };
        $scope.interfaces=interfs;
    });
});
