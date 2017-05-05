define(['angular',
    'angular-couch-potato',
    'angular-ui-router','appConfig'], function(ng, couchPotato){

    var module = angular.module('app.net', ['ui.router']);

    couchPotato.configureApp(module);

    module.config(function($stateProvider, $couchPotatoProvider){
        $stateProvider
            .state('app.net', {
                abstract: true,
                data: {
                    title: 'NET Elements'
                }
            })

            .state('app.net.networkserver', {
                url: '/NetworkServer',
                data: {
                    title: 'NetworkServer'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/net/views/network.html',
                        controller: 'NetworkCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/net/controllers/networkCtrl'
                            ])
                        }
                    }
                }
            })

            .state('app.net.server', {
                url: '/NetworkServer/:networkserverid',
                data: {
                    title: 'Network Server'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/net/views/networkServer.html',
                        controller: 'NetworkServerCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/net/controllers/networkServerCtrl',
                                'modules/tables/directives/datatables/datatableBasic',
                                'modules/net/directives/nettableTableTools'
                            ])
                        }
                    }
                }
            })

            .state('app.net.vxnet', {
                url: '/net/vxnet',
                data: {
                    title: 'VxNet'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/net/views/vxnet.html',
                        controller: 'VxnetCtrl',
                        resolve: {
                            projects:function($http){
                                return $http.get(appConfig.apiUrl+'/vlans/interfaces')
                            },
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/net/controllers/vxnetCtrl',
                                'modules/net/directives/vxnetTable'
                            ])
                        }
                    }
                }
            })
            .state('app.net.ippool', {
                url: '/net/ippool',
                data: {
                    title: 'IpPool'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/net/views/ippool.html',
                        controller: 'IppoolCtrl',
                        resolve: {
                            projects:function($http){
                                return $http.get(appConfig.apiUrl+'/ips')
                            },
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/net/controllers/ippoolCtrl',
                                'modules/tables/directives/datatables/datatableBasic',
                                'modules/net/directives/nettableTableTools'
                            ])
                        }
                    }
                }
            })
            
    });

    module.run(function($couchPotato){
        module.lazy = $couchPotato
    });

    return module;
});