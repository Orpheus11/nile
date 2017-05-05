define(['angular',
    'angular-couch-potato',
    'angular-ui-router','appConfig'], function(ng, couchPotato){

    var module = angular.module('app.image', ['ui.router']);

    couchPotato.configureApp(module);

    module.config(function($stateProvider, $couchPotatoProvider){
        $stateProvider
            .state('app.image', {
                abstract: true,
                data: {
                    title: 'Image Service'
                }
            })

            .state('app.image.server', {
                url: '/ImageServer/:imageserverid',
                data: {
                    title: 'Image Server'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/image/views/imageserver.html',
                        controller: 'ImageCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/image/controllers/ImageCtrl',
                                'modules/graphs/directives/flot/flotBasic',
                                'modules/graphs/directives/inline/sparklineContainer',
                                'modules/graphs/directives/inline/easyPieChartContainer',
                                'modules/tables/directives/datatables/datatableBasic',
                                'modules/tables/directives/datatables/datatableColumnFilter',
                                'modules/tables/directives/datatables/datatableColumnReorder',
                                'modules/tables/directives/datatables/datatableTableTools',
                                'modules/image/directives/upload/smartDropzone'
                            ])
                        }
                    }
                }
            })

            .state('app.image.service', {
                url: '/ImageService',
                data: {
                    title: 'Image Service'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/image/views/imageservice.html',
                        controller: 'ImageServiceCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/image/controllers/ImageServiceCtrl',
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