define(['modules/console/module'], function (module) {

    'use strict';

    module.registerController('ConsoleCtrl', function ($stateParams,consoleService,$scope) {
        $scope.console_server_id = $stateParams.consoleserverid;

        consoleService.getConsoleServerDetail($stateParams.consoleserverid,function(data) {
            $scope.console_ports = data;
            console.log($scope.console_ports);
        });
    });
});
