define(['modules/net/module', 'notification'], function (module) {

    "use strict";

    module.registerController('IppoolCtrl', function ($scope,projects) {
        $scope.ips=projects.data.ips;
        $scope.ipsOptions =  {
            "data": projects.data.ips,
            "iDisplayLength": 15,
            "columns": [
                { "data": "id" },
                { "data": "ipaddr" },
                { "data": "mac" },
                { "data": "vlan_id" },
                { "data": "vm_id" },
                { "data": "allocated" },
            ],
            "order": [[1, 'asc']]
        }
    })
});

