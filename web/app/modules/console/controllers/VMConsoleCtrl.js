define(['modules/console/module'], function (module) {

    'use strict';

    module.registerController('ConsoleCtrl', function ($stateParams,consoleService,$scope) {
        $scope.vm_id = $stateParams.vmid;

        consoleService.getVMConsole($stateParams.vmid,function(data){
            $scope.console_ip = data.ip;
            $scope.consoleserver_port = data.port;
            $scope.spiceUrl = "spice/index.html?host=" + data.ip + "&port=" + data.port;
        });
    });
});
