define(['angular',
    'angular-couch-potato',
    'angular-ui-router'], function (ng, couchPotato) {

    "use strict";


    var module = ng.module('app.layout', ['ui.router']);


    couchPotato.configureApp(module);

    module.config(function ($stateProvider, $couchPotatoProvider, $urlRouterProvider) {


        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    root: {
                        templateUrl: 'app/layout/layout.tpl.html',
                        controller: 'LayoutCtrl',
                        resolve: {
                            deps: $couchPotatoProvider.resolveDependencies([
                                'auth/directives/loginInfo',
                                'modules/graphs/directives/inline/sparklineContainer',
                                'components/inbox/directives/unreadMessagesCount',
                                'components/chat/api/ChatApi',
                                'components/chat/directives/asideChatWidget',
                                'modules/forms/directives/validate/smartValidateForm',

                                'modules/forms/directives/wizard/smartFueluxWizard',
                                'modules/forms/directives/input/smartMaskedInput',
                                'modules/forms/directives/wizard/smartWizard',
                                'modules/forms/controllers/FormWizardCtrl',
                                'layout/controller/layoutCtrl'
                            ])
                        }
                    }
                }
            });
        // $urlRouterProvider.otherwise('/dashboard');
        $urlRouterProvider.otherwise('/login');

    });

    module.run(function ($couchPotato) {
        module.lazy = $couchPotato;
    });

    module.updateCenter=false;

    return module;

});
