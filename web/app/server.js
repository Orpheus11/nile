define([
    'angular',
    'appConfig'
], function (ng) {
    var module = ng.module('app.server', []);

    var cachedQuest = {};
    var cacheSize = 5;

    module.factory('server', function ($http) {

        var server = {};

        ['get', 'post', 'put', 'delete'].forEach(function (key) {
            server[key] = function () {
                var arg = arguments,
                    url = arg[0],
                    last_args = Array.prototype.slice.call(arguments, 1);

                if ( appConfig.__DEBUG__ ) {
                    url = 'api/' + url;
                    if (! url.endsWith('.json')) {
                         url = url + '.json';
                    }
                } else {
                    url = appConfig.apiUrl + '/' + url;
                }

                last_args.unshift(url);

                return $http[key].apply(null, last_args);
            }
        });


        return server;
    });
});