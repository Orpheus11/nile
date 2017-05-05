'use strict';

/**
 * @ngdoc overview
 * @name app [smartadminApp]
 * @description
 * # app [smartadminApp]
 *
 * Main module of the application.
 */

define([
    'angular',
    'angular-couch-potato',
    'angular-ui-router',
    'angular-animate',
    'ngDialog',
    'angular-bootstrap',
    'smartwidgets',
    'notification'
], function (ng, couchPotato) {

    var app = ng.module('app', [
        'ngSanitize',

        'scs.couch-potato',
        'ngAnimate',
        'ngDialog',
        'ui.router',
        'ui.bootstrap',
        'app.filters',
        'app.server',
        'app.directives',
        // App
        'app.auth',
        'app.layout',
        'app.chat',
        'app.dashboard',
        'app.calendar',
        'app.inbox',
        'app.graphs',
        'app.tables',
        'app.forms',
        'app.ui',
        'app.widgets',
        'app.maps',
        'app.appViews',
        'app.misc',
        'app.smartAdmin',
        'app.net',
        'app.storage',
        'app.privilege',
        'app.compute',
        'app.image',
        'app.console'
    ]);

    couchPotato.configureApp(app);
    app.config(function ($provide, $httpProvider) {

        // Intercept http calls.
        $provide.factory('ErrorHttpInterceptor', function ($q) {
            var errorCounter = 0;
            function notifyError(rejection){
                console.log(rejection);
		if(rejection.status==0){
			//alert(location.href)
			var curr_href = location.href
			location.href = appConfig.apiUrl+"/testapi?from="+curr_href;  
		}
                //$.bigBox({
                //    title: rejection.status + ' ' + rejection.statusText,
                //    content: rejection.data,
                //    color: "#C46A69",
                //    icon: "fa fa-warning shake animated",
                //    number: ++errorCounter,
                //    timeout: 6000
                //});
            }

            return {
                // On request failure
                requestError: function (rejection) {
                    // show notification
                    notifyError(rejection);

                    // Return the promise rejection.
                    return $q.reject(rejection);
                },

                // On response failure
                responseError: function (rejection) {
                    // show notification
                    notifyError(rejection);
                    // Return the promise rejection.
                    return $q.reject(rejection);
                }
            };
        });
        // $httpProvider.defaults.withCredentials = true;
	   console.log($httpProvider);
        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('ErrorHttpInterceptor');
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

    app.run(function ($couchPotato, $rootScope, $location,  $state, $stateParams, ngDialog ,User,$http) {
        app.lazy = $couchPotato;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        // editableOptions.theme = 'bs3';

        $rootScope.closeDialog = function () {
            ngDialog.closeAll();
        }


        $rootScope.$on('$stateChangeStart', function (event, target) {
	    $http.get(appConfig.apiUrl).then(function(response){
                    console.log(response);
                }
            )
            if (!User.userid) {
                var userid = undefined;
                $http.get(appConfig.apiUrl+'/auth/getloginuser').then(function(response){
                    if (response.data.user) {
                        userid = response.data.user.Id;
                    };
                    if (!userid) {
                        $location.path('/login');
                    };
                 });
            }
            if (target.name == 'login') {
                if (!User.userid) {
                    var userid = undefined;
                    $http.get(appConfig.apiUrl+'/auth/getloginuser').then(function(response){
                        if (response.data.user) {
                            userid = response.data.user.Id;
                        };
                        if (userid) {
                            $location.path('/dashboard');
                        };
                     });
                }else{
                    $location.path('/dashboard');
                }
            };
            // if (target.name != 'login') {
            //     if (!User.userid) {
            //         var userid = undefined;
            //         $http.get(appConfig.apiUrl+'/auth/getloginuser').then(function(response){
            //             if (response.data.user) {
            //                 userid = response.data.user.Id;
            //             };
            //             if (!userid) {
            //                 $location.path('/login');
            //             };
            //          });
            //     }
            //     // User.initialized.then(function () {
            //     //     if (!User.userid) {
            //     //         $location.path('/login');
            //     //     }
            //     // });
            // };
        });

    });




    return app;
});
