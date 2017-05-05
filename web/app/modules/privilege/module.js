define(['angular',
    'angular-couch-potato',
    'angular-ui-router','appConfig','ngJsTree'], function(ng, couchPotato){

    var module = angular.module('app.privilege', ['ui.router','ngJsTree']);

    couchPotato.configureApp(module);

    module.config(function($stateProvider, $couchPotatoProvider){
        $stateProvider
            .state('app.privilege', {
                abstract: true,
                data: {
                    title: 'NET Elements'
                }
            })
            .state('app.privilege.users', {
                url: '/privilege/users',
                data: {
                    title: 'Users Manager'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/privilege/views/users.html',
                        controller: 'privilegeUsersCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/privilege/controllers/privilegeUsersCtrl'
                            ])
                        }
                    }
                }
            })
            .state('app.privilege.roles', {
                url: '/privilege/roles',
                data: {
                    title: 'Roles Mangaer'
                },
                views: {
                    "content@app": {
                        templateUrl: 'app/modules/privilege/views/roles.html',
                        controller: 'privilegeRolesCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'modules/privilege/controllers/privilegeRolesCtrl',
                                'modules/privilege/directives/jstree.min'
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