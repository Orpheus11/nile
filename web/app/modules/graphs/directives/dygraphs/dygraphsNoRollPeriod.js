define(['modules/graphs/module', 'dygraphs-demo', 'dygraphs'], function (module, demo) {

    'use strict';

    return module.registerDirective('dygraphsNoRollPeriod', function () {
        return {
            restrict: 'A',
            scope:{
                data:'=xyData'
            },
            compile: function () {
                return {
                    post: function (scope, element) {
                        console.log("xyData:"+scope.data);
                        new Dygraph(element[0], scope.data, {
                            customBars : false,
                            ylabel : 'CPU_Used (%)',
                            legend : 'always',
                            labelsDivStyles : {
                                'textAlign' : 'right'
                            },
                            showRangeSelector : true,
                            rangeSelectorHeight : 30,
                            rangeSelectorPlotStrokeColor : 'yellow',
                            rangeSelectorPlotFillColor : 'lightyellow'
                        });
                    }
                }
            }
        }
    });
});
