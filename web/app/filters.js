define([
    'angular'
], function (ng) {
    var module = ng.module('app.filters', []);

    module.filter('upperCase', function () {
        return function (str) {
            return str ? str.toUpperCase() : '';
        };
    });


	module.filter('offset', function() { 
	return function(input, start) {
			start = parseInt(start, 10);
			return input.slice(start);
		};
	});

});