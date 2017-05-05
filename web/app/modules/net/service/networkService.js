define(['app',
    'appConfig'], function(app) {
    "use strict";


    return app.factory('networkService', function ($http, $log, $q, server) {
        var networkService = {};
        var network_server_id = undefined ;
        //vlan
        var vlans = [];
        var currentVlan = {};

        var physical_interfaces = [];
        var ovs_brs = [];

        function listVlans (network_server_id) {
            server.get("networkservers/vlans?networkserverid="+network_server_id).then(function (result) {
                vlans.length = 0;
                console.log(" > listvlans", result);
                angular.forEach(result.data.vlans, function (item) {
                    vlans.push(item);
                });
            });
        }

        function deleteVlan (vlan) {
            var _vlan = {
                id : vlan.Id,
                name : vlan.Name,
                description : vlan.Description,
                network_server_id : vlan.Network_server_id,
                vlan_id : vlan.Vlan_id,
                phyinterface : vlan.Interface,
                cidr : vlan.Cidr,
                dhcp_range : vlan.Dhcp_range
            };
            return server.post('networkservers/vlans/delete',_vlan);
        }

        function createVlan (vlan) {
            var cidrTest = /^(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}([0])\/(\d{1}|[0-2]{1}\d{1}|3[0-2])$/;
            var ipTest = /^(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}(([01]?\d?\d|2[0-4]\d|25[0-5]))/;
            if(!vlan.Name){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Name is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!vlan.Network_server_id){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Network_server_id is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!vlan.Vlan_id){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Vlan_id is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!vlan.Interface){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Interface is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!vlan.Cidr){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Cidr is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!vlan.Listen_address){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Listen Address is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!vlan.Gateway){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Gateway is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!vlan.Dhcp_range){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Dhcp_range is null.</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!cidrTest.test(vlan.Cidr)){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Cidr is illegal .</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!ipTest.test(vlan.Listen_address)){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Listen Address is illegal .</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!ipTest.test(vlan.Gateway)){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Gateway is illegal .</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            var dhcp_se = vlan.Dhcp_range.split(",");
            if(dhcp_se.length != 2){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Dhcp Range is illegal .</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return  
            }
            var dhcp_start = dhcp_se[0];
            var dhcp_end = dhcp_se[1];
            if(!ipTest.test(dhcp_start)){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Dhcp Range is illegal .</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            if(!ipTest.test(dhcp_end)){
                $.smallBox({
                    title: "Create Vlan Error",
                    content: "<i class='fa fa-clock-o'></i> <i>Dhcp Range is illegal .</i>",
                    color: "#C46A69",
                    iconSmall: "fa fa-times fa-2x fadeInRight animated",
                    timeout: 4000
                });
                return
            }
            var dhcp_start_list = dhcp_start.split(".");
            var dhcp_end_list = dhcp_end.split(".");
            var preParse = false;
            for (var i = 0; i < 4; i++) {
                if (!preParse && dhcp_start_list[i]>dhcp_end_list[i]) {
                    $.smallBox({
                        title: "Create Vlan Error",
                        content: "<i class='fa fa-clock-o'></i> <i>Dhcp Range is illegal .</i>",
                        color: "#C46A69",
                        iconSmall: "fa fa-times fa-2x fadeInRight animated",
                        timeout: 4000
                    });
                    return
                };
                if (dhcp_start_list[i] < dhcp_end_list[i]) {
                    preParse = true;
                };
            };
            var _vlan = {
                name : vlan.Name,
                description : vlan.Description,
                network_server_id : vlan.Network_server_id,
                vlan_id : Number(vlan.Vlan_id),
                phyinterface : vlan.Interface,
                listen_address : vlan.Listen_address,
                gateway : vlan.Gateway,
                cidr : vlan.Cidr,
                dhcp_range : vlan.Dhcp_range
            };
            return server.post('networkservers/vlans/add', _vlan);
        }

        function editVlan (vlan) {
            var _vlan = {
                id : vlan.Id,
                name : vlan.Name,
                description : vlan.Description,
                network_server_id : vlan.Network_server_id,
                vlan_id : vlan.Vlan_id,
                phyinterface : vlan.Interface,
                cidr : vlan.Cidr,
                dhcp_range : vlan.Dhcp_range
            };
            return server.post('networkservers/vlans/update', _vlan);
        }

        function setCurrentVlan(vlan) {
            angular.extend(currentVlan, vlan);
        }

        function getVlanById (Id) {
            return server.get('auth/getdep?id=' +  Id);
        }

        //ip
        var ips = [];
        var vlanIps = [];
        function listIps (network_server_id) {
            server.get("networkservers/ips?networkserverid="+network_server_id).then(function (result) {
                ips.length = 0;
                console.log(" > listips", result);
                angular.forEach(result.data.ips, function (item) {
                    ips.push(item);
                });
            });
        }

        function listIpsByVlanId (network_server_id,vlan_id) {
            server.get("networkservers/ips?networkserverid="+network_server_id+"&vlan_id="+vlan_id).then(function (result) {
                vlanIps.length = 0;
                console.log(" > listvlanips", result);
                angular.forEach(result.data.ips, function (item) {
                    vlanIps.push(item);
                });
            });
        }

 
        angular.extend(networkService, {
            // networkserver : networkserver,
            physical_interfaces : physical_interfaces,
            ovs_brs : ovs_brs,
            vlans : vlans,
            currentVlan : currentVlan,
            // getNetworkServer : getNetworkServer,
            listVlans : listVlans,
            deleteVlan : deleteVlan,
            createVlan: createVlan,
            setCurrentVlan: setCurrentVlan,
            editVlan : editVlan,


            ips : ips,
            vlanIps : vlanIps,
            listIps : listIps,
            listIpsByVlanId : listIpsByVlanId
        });

        return networkService;

    });
});