
define(['layout/module','angular'], function(module){

    "use strict";

    return module.registerDirective('contextMenu', [
            '$document',
            'ContextMenuService',
            function($document, ContextMenuService) {
                return {
                    restrict: 'A',
                    scope: {
                        'callback': '&contextMenu',
                        'disabled': '&contextMenuDisabled',
                        'closeCallback': '&contextMenuClose'
                    },
                    link: function($scope, $element, $attrs) {
                        var opened = false;

                        function open(event, menuElement) {
                            menuElement.addClass('open');

                            var doc = $document[0].documentElement;
                            var docLeft = (window.pageXOffset || doc.scrollLeft) -
                                    (doc.clientLeft || 0),
                                docTop = (window.pageYOffset || doc.scrollTop) -
                                    (doc.clientTop || 0),
                                elementWidth = menuElement[0].scrollWidth,
                                elementHeight = menuElement[0].scrollHeight;
                            var contextO = menuElement[0].getElementsByTagName('ul')[0];
                            var currentHeight = parseInt(window.getComputedStyle(contextO,null).height);

                            var docWidth = doc.clientWidth + docLeft,
                                docHeight = doc.clientHeight + docTop,
                                totalWidth =  event.pageX,
                                totalWidth = elementWidth + event.pageX,
                                totalHeight = currentHeight + event.pageY,
                                left = Math.max(event.pageX - docLeft, 0),
                                top = Math.max(event.pageY - docTop, 0);

                            if (totalWidth > docWidth) {
                                left = left - (totalWidth - docWidth);
                            }
                            if (totalHeight > docHeight) {
                                top = top - (totalHeight - docHeight);
                            }
                            menuElement.css('top',  top-45+'px');
                            menuElement.css('left', left-55 + 'px');

                            //Add By Michael
                            if ('entity' in $attrs) {
                                $scope.$emit('entity', $attrs.entity);
                            }


                            opened = true;
                        }

                        function close(menuElement) {
                            menuElement.removeClass('open');

                            if (opened) {
                                $scope.closeCallback();
                            }

                            opened = false;
                        }

                        $element.bind('contextmenu', function(event) {
                            if (!$scope.disabled()) {
                                if (ContextMenuService.menuElement !== null) {
                                    close(ContextMenuService.menuElement);
                                }
                                ContextMenuService.menuElement = angular.element(
                                    document.getElementById($attrs.target)
                                );
                                ContextMenuService.element = event.target;

                                //console.log('set', ContextMenuService.element);

                                event.preventDefault();
                                event.stopPropagation();
                                $scope.$apply(function() {
                                    $scope.callback({ $event: event });
                                });
                                $scope.$apply(function() {
                                    open(event, ContextMenuService.menuElement);
                                });
                            }
                        });

                        function handleKeyUpEvent(event) {
                            //console.log('keyup');
                            if (!$scope.disabled() && opened && event.keyCode === 27) {
                                $scope.$apply(function() {
                                    close(ContextMenuService.menuElement);
                                });
                            }
                        }

                        function handleClickEvent(event) {
                            if (!$scope.disabled() &&
                                opened &&
                                (event.button !== 2 ||
                                event.target !== ContextMenuService.element)) {
                                $scope.$apply(function() {
                                    close(ContextMenuService.menuElement);
                                });
                            }
                        }


                        $document.bind('keyup', handleKeyUpEvent);
                        // Firefox treats a right-click as a click and a contextmenu event
                        // while other browsers just treat it as a contextmenu event
                        $document.bind('click', handleClickEvent);
                        $document.bind('contextmenu', handleClickEvent);

                        //$scope.$on('$destroy', function() {
                        //    //console.log('destroy');
                        //    $document.unbind('keyup', handleKeyUpEvent);
                        //    $document.unbind('click', handleClickEvent);
                        //    $document.unbind('contextmenu', handleClickEvent);
                        //});
                    }
                };
            }
        ]
    );

});
