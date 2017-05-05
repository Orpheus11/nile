define(['angular',
    'angular-couch-potato',
    'angular-ui-router','appConfig'], function(ng, couchPotato){

    var module = angular.module('app.console', ['ui.router']);

    couchPotato.configureApp(module);

    module.config(function($stateProvider, $couchPotatoProvider){
        $stateProvider
            .state('app.console', {
                abstract: true,
                data: {
                    title: 'Console Service'
                }
            })

            .state('app.console.service', {
                url: '/ConsoleService',
                data: {
                    title: 'Console Service'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/console/views/consoleservice.html',
                        controller: 'ConsoleServiceCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/console/controllers/ConsoleServiceCtrl',
                                'modules/tables/directives/datatables/datatableBasic',
                                'modules/tables/directives/datatables/datatableColumnFilter',
                                'modules/tables/directives/datatables/datatableColumnReorder',
                                'modules/tables/directives/datatables/datatableTableTools'
                            ])
                        }
                    }
                }
            })


            .state('app.console.server', {
                url: '/ConsoleServer/:consoleserverid',
                data: {
                    title: 'Console Server'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/console/views/consoleserver.html',
                        controller: 'ConsoleCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/console/controllers/ConsoleCtrl',
                                'modules/tables/directives/datatables/datatableBasic',
                                'modules/tables/directives/datatables/datatableColumnFilter',
                                'modules/tables/directives/datatables/datatableColumnReorder',
                                'modules/tables/directives/datatables/datatableTableTools'
                            ])
                        }
                    }
                }
            })

            .state('app.console.vm', {
                url: '/Console/:vmid',
                data: {
                    title: 'VM Console'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/console/views/vmconsole.html',
                        controller: 'VMConsoleCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/console/controllers/VMConsoleCtrl',
                                'spice/spicearraybuffer',
                                'spice/enums',
                                'spice/atKeynames',
                                'spice/utils',
                                'spice/png',
                                'spice/lz',
                                'spice/quic',
                                'spice/bitmap',
                                'spice/spicedataview',
                                'spice/spicetype',
                                'spice/spicemsg',
                                'spice/wire',
                                'spice/spiceconn',
                                'spice/display',
                                'spice/main',
                                'spice/inputs',
                                'spice/webm',
                                'spice/playback',
                                'spice/simulatecursor',
                                'spice/cursor',
                                'spice/thirdparty/jsbn',
                                'spice/thirdparty/rsa',
                                'spice/thirdparty/prng4',
                                'spice/thirdparty/rng',
                                'spice/thirdparty/sha1',
                                'spice/ticket',
                                'spice/resize',
                                'spice/filexfer',
                                'spice/temp'
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