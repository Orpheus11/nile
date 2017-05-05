define(['app',
    'appConfig'], function(app){
    "use strict";

    return app.factory('navNetworkService',function($http,$log,server) {
        var navNetworkService = {};
        var networkServers = [];
        var vlans = [];
        var ovsBrs = [];
        var selected_networkserver = {};
        function listNetworkServers(){
            server.get("networkservers").then(function (result) {
                networkServers.length = 0;
                console.log(" > listnetworkServers", result);
                angular.forEach(result.data.networkservers, function (item) {
                    networkServers.push(item);
                });
            });
        }

        function getNetworkServerByCenterId(center_id){
            angular.extend(selected_networkserver, {});
            server.get("networkservercenters/getnetworkserverbycenterid?center_id="+center_id).then(function (result) {
                console.log(" > getnetworkserverbycenterid", result);
                angular.extend(selected_networkserver, result.data.networkserver);
            });
        }

        function bindingNetworkServer(center_id,network_server_id, callback){
            var postData = {center_id:center_id,network_server_id:network_server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/networkservercenters/add',postData,config).success(function(data){
                callback(data);
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function editNetworkServer(network_server_id,network_server_name,des,callback){
            var postData = {name:network_server_name,id:network_server_id,description:des};
            var config = {};
            $http.post(appConfig.apiUrl+'/networkservers/update',postData,config).success(function(data){
                callback(data);
                listNetworkServers();
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function deleteNetworkServer(network_server_id,callback){
            var postData = {id:network_server_id};
            var config = {};
            $http.post(appConfig.apiUrl+'/networkservers/delete',postData,config).success(function(data){
                callback(data);
                listNetworkServers();
            }).error(function(){
                $log.log('Error');
                callback([]);
            });
        }

        function getVlansByServerId(server_id,callback){
            server.get("networkservers/listvlansbyserverid?server_id="+server_id).then(function (result) {
                console.log(" > listvlansbyserverid", result);
                angular.extend(vlans, result.data.vlans);
            });
        }

        function getOvsBrsByServerId(server_id,callback){
            server.get("networkservers/listovsbrsbyserverid?server_id="+server_id).then(function (result) {
                console.log(" > listovsbrsbyserverid", result);
                angular.extend(ovsBrs, result.data.ovsbrs);
                console.log(" > listovsbrsbyserverid", ovsBrs);
            });
        }

        angular.extend(navNetworkService, {
            vlans : vlans,
            ovsBrs : ovsBrs,
            networkServers : networkServers,
            selected_networkserver : selected_networkserver,
            listNetworkServers : listNetworkServers,
            editNetworkServer : editNetworkServer,
            deleteNetworkServer : deleteNetworkServer,
            bindingNetworkServer : bindingNetworkServer,
            getNetworkServerByCenterId : getNetworkServerByCenterId,
            getVlansByServerId : getVlansByServerId,
            getOvsBrsByServerId : getOvsBrsByServerId
        });

        return navNetworkService;

	})
})
