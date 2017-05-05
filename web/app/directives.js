define([
    'angular',
    'appConfig'
], function (ng) {
    var module = ng.module('app.directives', []);
    module.directive('popup', function ($http, $templateCache, $rootScope) {
        return {
            restrict: 'EA',
            scope : {
                accept: '&accept'
            },
            link: function (scope, element, attrs) {
                console.log(">> link:", attrs);
                $http.get(attrs.templateUrl, {cache: $templateCache}).success(function(html) {
                    attrs.acceptFn = scope.accept;
                    element.bind('click', function () {
                       console.log("element click");
                        $rootScope.$emit('popup-click', attrs);
                    });
                });


            }
        };
    });

    module.controller('popupController', function ($rootScope, $scope) {
        $scope.showPopup = false;

        $scope.newDep = {
            Name : 4,
            Grade: 5,
            Description: 6
        };

        $rootScope.$on('popup-click', function (event, data) {
            console.log(">> popup-click:" ,  $scope);
            $scope.popupTemplateUrl = data.templateUrl;
            $scope.showPopup = true;
            $scope.popupSubmit = function () {
                return data.acceptFn.call();
            }

        });

        $scope.closePopup = function () {
            $scope.showPopup = false;
        }


    });

});