'use strict';

var gRangeScope = [];

angular.module('angulardemoApp')
    .directive('pfkRangeSelector',
        ['$interval', 'pfkRangeSelectorService',
function ($interval,   service) {
    return {
//not needed in this case        require: ['^ButtonsCtrl'],
        templateUrl: 'templates/rangeselector.html',
        restrict: 'E',
//        link: function (scope, element, attrs,controllers) {
//            scope.buttonsCtrl = controllers[0];
//            console.log('controllers[0] is',controllers[0]);
//        },
        scope: {
            // variables here can be substituted in the template.
            // '@' means look at <pfk-slider-menu> attributes and copy.
            // '=' means set up 2-way binding with variable name in
            // parent scope (controller in this case)
            // '&' means hook for function execution.
            configObject: '=configObject',
            id: '@id',
        },
        controller : function($scope, $element
                              // ,$attrs,$transclude
                              //,otherInjectables
                             ) {
            //$scope.sliderDiv.css({display:'block'});
            //$scope.sliderDiv.css({left:value,width:value});

            $scope.parentDiv = $element.find('.pfkRangeSelector');
            $scope.bodyElt = angular.element('body');
            function parentWidth() { return $scope.parentDiv.width(); }

            $scope.sliderWindow = $element.find('.sliderWindow');
            $scope.displaySliderWindow = false;
            $scope.sliderWindowLeft = 0;
            $scope.sliderWindowWidth = 0;

            $scope.movingSliderWindow = $element.find('.movingSliderWindow');
            $scope.displayMovingSliderWindow = false;
            $scope.movingSliderWindowLeft = 0;

            $scope.mousePosSensor = $element.find('.mousePosSensor');
            $scope.displayMousePosSensor = false;

            $scope.mousePosLineInd = $element.find('.mousePosLineInd');
            $scope.displayMousePosLineInd = 0; // opacity
            $scope.mousePosLineIndPos = 0;

            $scope.mousePosIndicator = $element.find('.mousePosIndicator');
            $scope.displayMousePosInd = 0; // opacity
            $scope.mousePosTickIndPos = 0;
            $scope.mousePosTickNumber = 50;

            $scope.dragRangeWindow = $element.find('.dragRangeWindow');
            $scope.displayDragRangeWindow = false;
            $scope.dragRangeWindowLeft = 0;
            $scope.dragRangeWindowWidth = 0;

            $scope.dragStartIndicator = $element.find('.dragStartIndicator');
            $scope.displayDragStartIndicator = false;
            $scope.dragStartIndicatorPos = 0;
            $scope.dragStartTickNumber = 150;

            $scope.dragEndIndicator = $element.find('.dragEndIndicator');
            $scope.displayDragEndIndicator = false;
            $scope.dragEndIndicatorPos = 0;
            $scope.dragEndTickNumber = 170;

            $scope.tickPositions = [];

            function resetWindows() {
                $scope.displaySliderWindow = false;
                $scope.displayMovingSliderWindow = false;
                $scope.displayMousePosSensor = false;
                $scope.displayMousePosLineInd = 0;
                $scope.displayMousePosInd = 0;
                $scope.displayDragRangeWindow = false;
                $scope.displayDragStartIndicator = false;
                $scope.displayDragEndIndicator = false;
                $scope.sliderWindow.off('mousedown');
                $scope.bodyElt.off('mousemove');
                $scope.bodyElt.off('mouseup');
                $scope.mousePosSensor.off('mousedown');
                $scope.mousePosSensor.off('mouseenter');
                $scope.mousePosSensor.off('mouseleave');
            }

            // definition:
            //    tick = user's value, a number from configObject.validRange
            //    index = zero-based index into validRange
            //    Px = pixels from left of pfkRangeSelector

            function pxToIndex(px) {
                return parseInt(ticksInValid() * px / parentWidth());
            }
            function indexToTick(ind) {
                var ret = -1;
                if (ind < 0) {
                    return ret;
                }
                $scope.configObject.validRange.every(
                    function(range) {
                        var len = range[1] - range[0] + 1;
                        if (ind >= len) {
                            ind -= len;
                            return true; // keep searching
                        }
                        ret = range[0] + ind;
                        return false; // done
                    }
                );
                return ret;
            }
            function ticksInValid() {
                var count = 0;
                $scope.configObject.validRange.forEach(
                    function(range) {
                        count += range[1] - range[0] + 1;
                    }
                );
                return count;
            }
            function tickToIndex(tick) {
                var index = 0;
                $scope.configObject.validRange.every(
                    function(range) {
                        if (tick >= range[0] &&
                            tick <= range[1])
                        {
                            index += tick - range[0];
                            return false;
                        }
                        index += range[1] - range[0] + 1;
                        return true;
                    }
                );
                return index;
            }
            function indexToPx(ind) {
                return parseInt(parentWidth() * ind / ticksInValid());
            }

            var moveState = {
                startX : 0, // used by MOVINGWINDOW
                clientStartX : 0, // used by DRAGGINGRANGE
                offsetStartX : 0  // used by DRAGGINGRANGE
            };

            $scope.setState = function(state) {
                if ($scope.currentState === state) {
                    return;
                }
                $scope.currentState = state;
                switch (state) {
                case service.windowState.BLANK:
                    // nothing is being displayed: widget is inactive.
                    // parent controller must setState to get us to do
                    // anything.
                    resetWindows();
                    break;

                case service.windowState.DISPLAYWINDOW:
                    resetWindows();
                    // the window is displayed and is movable.
                    // mouse down on slider will transition to MOVINGWINDOW.
                    $scope.displaySliderWindow = true;
                    var centerInd = tickToIndex($scope.configObject.windowCenter);
                    var leftInd = centerInd - ($scope.configObject.windowSize/2);
                    var rightInd = centerInd + ($scope.configObject.windowSize/2) - 1;
                    $scope.sliderWindowLeft = indexToPx(leftInd);
                    $scope.sliderWindowWidth = indexToPx(rightInd - leftInd);
                    $scope.sliderWindow.on('mousedown',function(evt) {
                        $scope.$apply(function() {
                            moveState.startX = evt.clientX;
                            moveState.windowCenter = $scope.configObject.windowCenter;
                            $scope.setState(service.windowState.MOVINGWINDOW);
                        });
                    });
                    break;

                case service.windowState.MOVINGWINDOW:
                    // the window is currently being moved. letting up on
                    // the mouse generates a centerChange event to the
                    // parent and a return to DISPLAYWINDOW state.
                    $scope.displaySliderWindow = true;
                    $scope.displayMovingSliderWindow = true;
                    $scope.movingSliderWindowLeft = $scope.sliderWindowLeft;
                    $scope.bodyElt.on('mousemove',function(evt) {
                        $scope.$apply(function() {
                            var diffX = evt.clientX - moveState.startX;
                            var centerInd =
                                tickToIndex($scope.configObject.windowCenter);
                            var newCenterInd = centerInd + pxToIndex(diffX);

                            var newCenter = indexToTick(newCenterInd);
                            if (newCenter !== -1) {
                                $scope.movingSliderWindowLeft = 
                                    $scope.sliderWindowLeft + diffX;
                            }
                        });
                    });
                    $scope.bodyElt.on('mouseup',function(evt) {
                        $scope.$apply(function() {
                            $scope.displayMovingSliderWindow = true;
                            $scope.bodyElt.off('mouseup');
                            $scope.bodyElt.off('mousemove');
                            var diffX = evt.clientX - moveState.startX;
                            var centerInd =
                                tickToIndex($scope.configObject.windowCenter);
                            var newCenterInd = centerInd + pxToIndex(diffX);
                            var tiv = ticksInValid();
                            if (newCenterInd >= tiv) {
                                newCenterInd = tiv-1;
                            }
                            if (newCenterInd < 0) {
                                newCenterInd = 0;
                            }
                            var newCenter = indexToTick(newCenterInd);
                            if (newCenter !== -1) {
                                $scope.configObject.windowCenter = newCenter;
                                // broadcast goes down, emit goes up
                                $scope.$emit($scope.id+'.centerChange',
                                             newCenter);
                            }
                            $scope.setState(service.windowState.DISPLAYWINDOW);
                        });
                    });
                    break;

                case service.windowState.DRAGRANGESTART:
                    // no slider window is displayed. the mouse position
                    // is being tracked and tick number is displayed and
                    // tracking. mousedown event transitions us to
                    // DRAGGINGRANGE.
                    // (note: jshint doesn't like a no-break fallthru,
                    //        but this is intentional.)
                    resetWindows(); // jshint ignore:line
                    // fallthru
                case service.windowState.RANGEDRAGGED:
                    // slider is displayed and mouse position is tracked
                    // and displayed but slider is not resizing.
                    // mousedown sends us back to DRAGGINGRANGE with a
                    // brand new start position--old range is lost.
                    // the parent controller may also setState us out of
                    // this state.
                    $scope.displayMousePosSensor = true;
                    $scope.mousePosSensor.on('mouseenter',function() {
                        if (service.internal.dragInProgress) {
                            return;
                        }
                        $scope.$apply(function() {
                            $scope.displayMousePosLineInd = 1;
                            $scope.bodyElt.on('mousemove',function(evt) {
                                $scope.$apply(function() {
                                    $scope.displayMousePosInd = 1;
                                    var tick = indexToTick(pxToIndex(
                                        evt.offsetX === undefined ?
                                            evt.originalEvent.layerX :
                                            evt.offsetX
                                    ));
                                    $scope.mousePosTickNumber = tick;
                                    var pos = indexToPx(tickToIndex(tick));
                                    $scope.mousePosLineIndPos = pos;
                                    var pw = parentWidth();
                                    if (pos > (pw - 35)) {
                                        pos = pw - 35;
                                    }
                                    $scope.mousePosTickIndPos = pos;
                                });
                            });
                        });
                    });
                    $scope.mousePosSensor.on('mouseleave',function() {
                        if (service.internal.dragInProgress) {
                            return;
                        }
                        $scope.$apply(function() {
                            $scope.displayMousePosLineInd = 0;
                            $scope.displayMousePosInd = 0;
                            $scope.bodyElt.off('mousemove');
                        });
                    });
                    $scope.mousePosSensor.on('mousedown',function(evt) {
                        if (service.internal.dragInProgress) {
                            return;
                        }
                        $scope.$apply(function() {
                            var posX = evt.offsetX === undefined ?
                                evt.originalEvent.layerX :
                                evt.offsetX;
                            moveState.offsetStartX = posX;
                            moveState.clientStartX = evt.clientX;
                            var currentInd = pxToIndex(posX);
                            $scope.mouseDragStartingInd = currentInd;
                            service.internal.dragInProgress = true;
                            $scope.setState(service.windowState.DRAGGINGRANGE);
                        });
                    });
                    break;

                case service.windowState.DRAGGINGRANGE:
                    // slider is displayed, starting at mousedown position.
                    // slider is tracking mouse, moving other edge.
                    // mouseup generates dragComplete event to parent
                    // and transition to RANGEDRAGGED state.

                    var pw = parentWidth();
                    var leftPx, rightPx;
                    var inWindow = true;

                    $scope.mousePosSensor.off('mouseleave');
                    $scope.mousePosSensor.on('mouseleave',function() {
                        inWindow = false;
                    });
                    $scope.mousePosSensor.off('mouseenter');
                    $scope.mousePosSensor.on('mouseenter',function() {
                        inWindow = true;
                    });
                    $scope.displayMousePosInd = 0;
                    $scope.displayMousePosLineInd = 0;
                    $scope.bodyElt.off('mousemove');
                    $scope.bodyElt.on('mousemove',function(evt) {
                        $scope.$apply(function() {

                            var deltaX = evt.clientX - moveState.clientStartX;
                            var posX = moveState.offsetStartX + deltaX;

                            var mouseInd = pxToIndex(posX);
                            if (mouseInd < 0) {
                                mouseInd = 0;
                            }
                            var tiv = ticksInValid();
                            if (mouseInd >= tiv) {
                                mouseInd = tiv-1;
                            }
                            var mouseTick = indexToTick(mouseInd);

                            if (mouseInd > $scope.mouseDragStartingInd) {
                                // dragging to the right

                                leftPx = indexToPx($scope.mouseDragStartingInd);
                                rightPx = indexToPx(mouseInd);

                                $scope.displayDragStartIndicator = true;
                                $scope.dragStartIndicatorPos = leftPx - 35;
                                if ($scope.dragStartIndicatorPos < 0) {
                                    $scope.dragStartIndicatorPos = 0;
                                }
                                $scope.dragStartTickNumber =
                                    indexToTick($scope.mouseDragStartingInd);

                                $scope.displayDragEndIndicator = true;
                                $scope.dragEndIndicatorPos = rightPx;
                                if ($scope.dragEndIndicatorPos > (pw - 35)) {
                                    $scope.dragEndIndicatorPos = pw - 35;
                                }
                                $scope.dragEndTickNumber = mouseTick;

                                $scope.displayDragRangeWindow = true;
                                $scope.dragRangeWindowLeft = leftPx;
                                $scope.dragRangeWindowWidth = rightPx - leftPx;

                            } else {

                                leftPx = indexToPx(mouseInd);
                                rightPx = indexToPx($scope.mouseDragStartingInd);

                                // dragging to the left
                                $scope.displayDragEndIndicator = true;
                                $scope.dragEndIndicatorPos = rightPx;
                                if ($scope.dragEndIndicatorPos > (pw - 35)) {
                                    $scope.dragEndIndicatorPos = pw - 35;
                                }
                                $scope.dragEndTickNumber =
                                    indexToTick($scope.mouseDragStartingInd);

                                $scope.displayDragStartIndicator = true;
                                $scope.dragStartIndicatorPos = leftPx - 35;
                                if ($scope.dragStartIndicatorPos < 0) {
                                    $scope.dragStartIndicatorPos = 0;
                                }
                                $scope.dragStartTickNumber = mouseTick;

                                $scope.displayDragRangeWindow = true;
                                $scope.dragRangeWindowLeft = leftPx;
                                $scope.dragRangeWindowWidth = rightPx - leftPx;
                            }
                        });
                    });

                    $scope.bodyElt.on('mouseup', function(/*evt*/) {
                        service.internal.dragInProgress = false;
                        $scope.mousePosSensor.off('mouseenter');
                        $scope.mousePosSensor.off('mouseleave');
                        $scope.$apply(function() {
                            $scope.bodyElt.off('mousemove');
                            $scope.bodyElt.off('mouseup');
                            $scope.setState(service.windowState.RANGEDRAGGED);
                            $scope.$emit($scope.id+'.dragComplete',
                                         [$scope.dragStartTickNumber,
                                          $scope.dragEndTickNumber]);
                        });
                        if (inWindow) {
                            // fire an enter-event on the position sensor so
                            // as to redraw the mouse position indicator
                            $scope.mousePosSensor.mouseenter();
                        }
                    });

                    break;
                }
            };

            $scope.currentState = 0; // invalid
            $scope.setState(service.windowState.BLANK);

            // we have to wait for all constructions to be
            // complete before we can do this. using $interval
            // is a giant hack but i don't know how to reliably do
            // it otherwise.

            $interval(function() {
                $scope.setState(service.windowState.BLANK);
            }, /*ms*/100, /*count*/1, /*apply*/true);

            $scope.$on($scope.id+'.updateTicks', function(evt,ticks) {
                $scope.tickPositions.length = 0;
                ticks.forEach(function(t) {
                    $scope.tickPositions.push(indexToPx(tickToIndex(t)));
                });
            });
            $scope.configObject.setState = $scope.setState;

            gRangeScope.push($scope);
        }
    };
}])
.service('pfkRangeSelectorService',
         [
function () {
    var ret = {
        internal: {
            dragInProgress : false
        },
        windowState: { // never use 0
            BLANK : 1,
            DISPLAYWINDOW : 2,
            MOVINGWINDOW : 3,
            DRAGRANGESTART : 4,
            DRAGGINGRANGE : 5,
            RANGEDRAGGED : 6
        },
        RangeSelectorConfig : function (validRange, windowSize,
                                        windowCenter) {
            this.setState = null; // filled in during construction
            this.validRange = validRange;
            this.windowSize = windowSize;
            this.windowCenter = windowCenter;
        }
    };
    return ret;
}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
