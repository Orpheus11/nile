define(['angular',
    'angular-couch-potato',
    'angular-ui-router','appConfig'], function(ng, couchPotato){

    var module = angular.module('app.compute', ['ui.router']);

    couchPotato.configureApp(module);

    module.config(function($stateProvider, $couchPotatoProvider){
        $stateProvider
            .state('app.compute', {
                abstract: true,
                data: {
                    title: 'Compute'
                }
            })

            .state('app.compute.vm', {
                url: '/VM/:vmid',
                data: {
                    title: 'VM'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/compute/views/vm.html',
                        controller: 'VMCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/compute/controllers/VMCtrl',
                                'modules/graphs/directives/flot/flotBasic',
                                'modules/graphs/directives/inline/sparklineContainer',
                                'modules/graphs/directives/inline/easyPieChartContainer',
                                'modules/tables/directives/datatables/datatableBasic',
                                'modules/tables/directives/datatables/datatableColumnFilter',
                                'modules/tables/directives/datatables/datatableColumnReorder',
                                'modules/tables/directives/datatables/datatableTableTools'
                            ])
                        }
                    }
                }
            })
            .state('app.compute.server', {
                url: '/Server/:serverid',
                data: {
                    title: 'Server'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/compute/views/server.html',
                        controller: 'ServerCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/compute/controllers/ServerCtrl',
                                'modules/graphs/directives/flot/flotBasic',
                                'modules/graphs/directives/inline/sparklineContainer',
                                'modules/graphs/directives/inline/easyPieChartContainer',
                                'modules/tables/directives/datatables/datatableBasic',
                                'modules/tables/directives/datatables/datatableColumnFilter',
                                'modules/tables/directives/datatables/datatableColumnReorder',
                                'modules/tables/directives/datatables/datatableTableTools',
                                'modules/graphs/directives/dygraphs/dygraphsNoRollPeriod',
                                'modules/graphs/directives/dygraphs/dygraphsNoRollTimestamp'
                            ])
                        }
                    }
                }
            })

            .state('app.compute.center', {
                url: '/Center/:centerid',
                data: {
                    title: 'Center'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/compute/views/center.html',
                        controller: 'CenterCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/compute/controllers/CenterCtrl',
                                'modules/graphs/directives/flot/flotBasic',
                                'modules/graphs/directives/inline/sparklineContainer',
                                'modules/graphs/directives/inline/easyPieChartContainer',
                                'modules/tables/directives/datatables/datatableBasic',
                                'modules/tables/directives/datatables/datatableColumnFilter',
                                'modules/tables/directives/datatables/datatableColumnReorder',
                                'modules/tables/directives/datatables/datatableTableTools'
                            ])
                        }
                    }
                }
            })

            .state('app.compute.datacenter', {
                url: '/DataCenter/',
                data: {
                    title: 'DataCenter'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/compute/views/datacenter.html',
                        controller: 'DataCenterCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/compute/controllers/DataCenterCtrl',
                                'modules/graphs/directives/flot/flotBasic',
                                'modules/graphs/directives/inline/sparklineContainer',
                                'modules/graphs/directives/inline/easyPieChartContainer',
                                'modules/tables/directives/datatables/datatableBasic',
                                'modules/tables/directives/datatables/datatableColumnFilter',
                                'modules/tables/directives/datatables/datatableColumnReorder',
                                'modules/tables/directives/datatables/datatableTableTools'
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