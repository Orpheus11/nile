define(['angular',
    'angular-couch-potato',
    'angular-ui-router','appConfig'], function(ng, couchPotato){

    var module = angular.module('app.storage', ['ui.router']);

    couchPotato.configureApp(module);

    module.config(function($stateProvider, $couchPotatoProvider){
        $stateProvider
            .state('app.storage', {
                abstract: true,
                data: {
                    title: 'NET Elements'
                }
            })
            .state('app.storage.gluster', {
                url: '/storage/gluster/:storageserverid',
                data: {
                    title: 'Gluster'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/storage/views/gluster.html',
                        controller: 'storageGlusterCtrl',
                        resolve: {
                            projects:function($http){

                                return $http.get(appConfig.apiUrl+'/storage/gluster/listbrick')
                                // return $http.post('api/storage/gluster/listbrick.json')
                            },
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/storage/controllers/storageGlusterCtrl'
                            ])
                        }
                    }
                }
            })
            .state('app.storage.nfs', {
                url: '/storage/nfs/:storageserverid',
                data: {
                    title: 'Nfs'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/storage/views/nfs.html',
                        controller: 'storageNfsCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/storage/controllers/storageNfsCtrl'
                            ])
                        }
                    }
                }
            })

            .state('app.storage.service', {
                url: '/StorageService',
                data: {
                    title: 'Storage Service'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/storage/views/storageservice.html',
                        controller: 'StorageServiceCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/storage/controllers/storageServiceCtrl',
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