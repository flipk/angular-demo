'use strict';

// usage:
//    <pfk-range-selector id="SOMESTRING" callback="parentCallback">
//
//  parentCallback : function (evt, data)  where
//   evt = 'WINDOWMOVED'  and data = { id, centerTick, tickWidth }
//   evt = 'RANGEDRAGGED' and data = { id, startTick, endTick }
//   evt = 'DESTRUCTED'   and data = { id }
//   evt = 'CONSTRUCTED'  and data = { id, setRanges, windowMode, 
//                                     rangeDragMode, rangeProgress,
//                                     setTicks, setHighlightTicks }
// where 
//   setValidRange : function(ranges)  where  ranges = [[],[]]
//   windowMode : function(centerTick,tickWidth)
//   rangeDragMode : function(startTick, endTick)  nulls mean start blank
//   rangeProgress : function(startTick, endTick, currentTick)
//   setTicks : function(ticks) where ticks = []
//   setHighlightTicks : function(ticks) where ticks = []

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
            id: '@',
            callback: '='
        },
        controller : function($scope, $element
                              // ,$attrs,$transclude
                              //,otherInjectables
                             ) {

            $scope.validRange = [[],[]];

            // window mode
            $scope.windowCenter = 0; // tick from validRange
            $scope.windowSize = 0; // in ticks/indexes

            //$scope.sliderDiv.css({display:'block'});
            //$scope.sliderDiv.css({left:value,width:value});

            $scope.parentDiv = $element.find('.pfkRangeSelector');
            $scope.bodyElt = angular.element('body');
            function parentWidth() { return $scope.parentDiv.width(); }

            $scope.sliderWindow = $element.find('.sliderWindow');
            $scope.displaySliderWindow = false;
            $scope.sliderWindowLeft = 0; // in px
            $scope.sliderWindowWidth = 0; // in px

            $scope.movingSliderWindow = $element.find('.movingSliderWindow');
            $scope.displayMovingSliderWindow = false;
            $scope.movingSliderWindowLeft = 0; // in px

            $scope.mousePosSensor = $element.find('.mousePosSensor');
            $scope.displayMousePosSensor = false;

            $scope.mousePosLineInd = $element.find('.mousePosLineInd');
            $scope.displayMousePosLineInd = 0; // opacity
            $scope.mousePosLineIndPos = 0; // in px

            $scope.mousePosIndicator = $element.find('.mousePosIndicator');
            $scope.displayMousePosInd = 0; // opacity
            $scope.mousePosTickIndPos = 0; // in px
            $scope.mousePosTickNumber = 0; // tick#

            $scope.dragRangeWindow = $element.find('.dragRangeWindow');
            $scope.displayDragRangeWindow = false;
            $scope.dragRangeWindowLeft = 0; // in px
            $scope.dragRangeWindowWidth = 0; // in px

            $scope.dragStartIndicator = $element.find('.dragStartIndicator');
            $scope.displayDragStartIndicator = false;
            $scope.dragStartIndicatorPos = 0; // in px
            $scope.dragStartTickNumber = 0; // tick#

            $scope.dragEndIndicator = $element.find('.dragEndIndicator');
            $scope.displayDragEndIndicator = false;
            $scope.dragEndIndicatorPos = 0; // in px
            $scope.dragEndTickNumber = 0; // tick#

            $scope.tickPositions = [];
            // TODO $scope.highlightTickPositions = [];

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
                service.dragInProgress = false;
            }

            // definition:
            //    tick = user's value, a number from validRange
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
                $scope.validRange.every(
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
                $scope.validRange.forEach(
                    function(range) {
                        count += range[1] - range[0] + 1;
                    }
                );
                return count;
            }
            function tickToIndex(tick) {
                var index = 0;
                $scope.validRange.every(
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

            // uses in $scope : windowCenter and windowSize
            function drawWindow() {
                $scope.displaySliderWindow = true;
                var centerInd = tickToIndex($scope.windowCenter);
                var leftInd = centerInd - ($scope.windowSize/2);
                var rightInd = centerInd + ($scope.windowSize/2) - 1;
                $scope.sliderWindowLeft = indexToPx(leftInd);
                $scope.sliderWindowWidth = indexToPx(rightInd - leftInd);
            }

            // uses in $scope : mousePosTickNumber
            function drawRangeCursor() {
                $scope.displayMousePosLineInd = 1;
                $scope.displayMousePosInd = 1;
                var pos = indexToPx(tickToIndex($scope.mousePosTickNumber));
                $scope.mousePosLineIndPos = pos;
                var pw = parentWidth();
                if (pos > (pw - 35)) {
                    pos = pw - 35;
                }
                $scope.mousePosTickIndPos = pos;
            }

            // uses in $scope : dragStartTickNumber and dragEndTickNumber
            function drawRange() {
                var leftPx = indexToPx(tickToIndex($scope.dragStartTickNumber));
                var rightPx = indexToPx(tickToIndex($scope.dragEndTickNumber));

                $scope.displayDragStartIndicator = true;

                $scope.dragStartIndicatorPos = leftPx - 35;
                if ($scope.dragStartIndicatorPos < 0) {
                    $scope.dragStartIndicatorPos = 0;
                }

                var pw = parentWidth();
                $scope.displayDragEndIndicator = true;
                $scope.dragEndIndicatorPos = rightPx;
                if ($scope.dragEndIndicatorPos > (pw - 35)) {
                    $scope.dragEndIndicatorPos = pw - 35;
                }

                $scope.displayDragRangeWindow = true;
                $scope.dragRangeWindowLeft = leftPx;
                $scope.dragRangeWindowWidth = rightPx - leftPx;
            }

            var states = {
                INIT : 0,
                BLANK : 1,
                DISPLAYWINDOW : 2,
                MOVINGWINDOW : 3,
                DRAGRANGESTART : 4,
                RANGEDRAGGED : 5,
                DRAGGINGRANGE : 6,
                RANGEPROGRESS : 7
            };
            $scope.currentState = states.INIT;

            var moveState = {
                startX : 0,       // used by MOVINGWINDOW
                windowCenter : 0, // used by MOVINGWINDOW
                clientStartX : 0, // used by DRAGGINGRANGE
                offsetStartX : 0  // used by DRAGGINGRANGE
            };

            $scope.setState = function (newState) {
                $scope.currentState = newState;
                switch (newState) {
                case states.BLANK:
                    resetWindows();
                    break;

                case states.DISPLAYWINDOW:
                    resetWindows();
                    // the window is displayed and is movable.
                    // mouse down on slider will transition to MOVINGWINDOW.
                    drawWindow();
                    $scope.sliderWindow.on('mousedown',function(evt) {
                        $scope.$apply(function() {
                            moveState.startX = evt.clientX;
                            moveState.windowCenter = $scope.windowCenter;
                            $scope.setState(states.MOVINGWINDOW);
                        });
                    });
                    break;

                case states.MOVINGWINDOW:
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
                                tickToIndex($scope.windowCenter);
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
                                tickToIndex($scope.windowCenter);
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
                                $scope.windowCenter = newCenter;
                                $scope.callback('WINDOWMOVED', {
                                    id: $scope.id,
                                    centerTick : $scope.windowCenter,
                                    tickWidth : $scope.windowSize
                                });
                            }
                            $scope.setState(states.DISPLAYWINDOW);
                        });
                    });
                    break;

                case states.DRAGRANGESTART:
                    // no slider window is displayed. the mouse position
                    // is being tracked and tick number is displayed and
                    // tracking. mousedown event transitions us to
                    // DRAGGINGRANGE.
                    // (note: jshint doesn't like a no-break fallthru,
                    //        but this is intentional.)
                    resetWindows(); // jshint ignore:line
                    // fallthru
                case states.RANGEDRAGGED:
                    // slider is displayed and mouse position is tracked
                    // and displayed but slider is not resizing.
                    // mousedown sends us back to DRAGGINGRANGE with a
                    // brand new start position--old range is lost.
                    // the parent controller may also setState us out of
                    // this state.
                    $scope.displayMousePosSensor = true;
                    $scope.mousePosSensor.on('mouseenter',function() {
                        if (service.dragInProgress) {
                            return;
                        }
                        $scope.$apply(function() {
                            $scope.bodyElt.on('mousemove',function(evt) {
                                $scope.$apply(function() {
                                    var tick = indexToTick(pxToIndex(
                                        evt.offsetX === undefined ?
                                            evt.originalEvent.layerX :
                                            evt.offsetX
                                    ));
                                    $scope.mousePosTickNumber = tick;
                                    drawRangeCursor();
                                });
                            });
                        });
                    });
                    $scope.mousePosSensor.on('mouseleave',function() {
                        if (service.dragInProgress) {
                            return;
                        }
                        $scope.$apply(function() {
                            $scope.displayMousePosLineInd = 0;
                            $scope.displayMousePosInd = 0;
                            $scope.bodyElt.off('mousemove');
                        });
                    });
                    $scope.mousePosSensor.on('mousedown',function(evt) {
                        if (service.dragInProgress) {
                            return;
                        }
                        $scope.$apply(function() {
                            var posX = evt.offsetX === undefined ?
                                evt.originalEvent.layerX : // firefox
                                evt.offsetX;
                            moveState.offsetStartX = posX;
                            moveState.clientStartX = evt.clientX;
                            var currentInd = pxToIndex(posX);
                            $scope.mouseDragStartingInd = currentInd;
                            service.dragInProgress = true;
                            $scope.setState(states.DRAGGINGRANGE);
                        });
                    });
                    break;

                case states.DRAGGINGRANGE:
                    // slider is displayed, starting at mousedown position.
                    // slider is tracking mouse, moving other edge.
                    // mouseup generates dragComplete event to parent
                    // and transition to RANGEDRAGGED state.

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
                                $scope.dragStartTickNumber =
                                    indexToTick($scope.mouseDragStartingInd);
                                $scope.dragEndTickNumber = mouseTick;
                            } else {
                                // dragging to the left
                                $scope.dragStartTickNumber = mouseTick;
                                $scope.dragEndTickNumber = 
                                    indexToTick($scope.mouseDragStartingInd);
                            }

                            drawRange();
                        });
                    });

                    $scope.bodyElt.on('mouseup', function(/*evt*/) {
                        service.dragInProgress = false;
                        $scope.mousePosSensor.off('mouseenter');
                        $scope.mousePosSensor.off('mouseleave');
                        $scope.$apply(function() {
                            $scope.bodyElt.off('mousemove');
                            $scope.bodyElt.off('mouseup');
                            $scope.setState(states.RANGEDRAGGED);
                            $scope.callback('RANGEDRAGGED', {
                                id: $scope.id,
                                startTick : $scope.dragStartTickNumber,
                                endTick : $scope.dragEndTickNumber
                            });
                        });
                        if (inWindow) {
                            // fire an enter-event on the position sensor so
                            // as to redraw the mouse position indicator
                            $scope.mousePosSensor.mouseenter();
                        }
                    });

                    break;

                case states.RANGEPROGRESS:
                    resetWindows();
                    drawRange();
                    drawRangeCursor();
                    service.dragInProgress = true;
                    break;
                }
            };

            function setBlankMode() {
                resetWindows();
                $scope.setState(states.BLANK);
            }

            function setValidRange(ranges) {
                $scope.validRange.length = 0;
                ranges.forEach(function(range) {
                    $scope.validRange.push([range[0],range[1]]);
                });
            }

            function windowMode(centerTick, tickWidth) {
                resetWindows();
                $scope.windowCenter = centerTick;
                $scope.windowSize = tickWidth;
                $scope.setState(states.DISPLAYWINDOW);
            }

            function rangeDragMode(startTick, endTick) {
                if (startTick !== null && endTick !== null) {
                    resetWindows();
                    $scope.dragStartTickNumber = startTick;
                    $scope.dragEndTickNumber = endTick;
                    drawRange();
                    $scope.setState(states.RANGEDRAGGED);
                } else {
                    $scope.setState(states.DRAGRANGESTART);
                }
            }

            function rangeProgress(startTick, endTick, currentTick) {
                $scope.dragStartTickNumber = startTick;
                $scope.dragEndTickNumber = endTick;
                $scope.mousePosTickNumber = currentTick;
                $scope.setState(states.RANGEPROGRESS);
            }

            function setTicks(ticks) {
                $scope.tickPositions.length = 0;
                ticks.forEach(function(t) {
                    var pos = indexToPx(tickToIndex(t));
                    $scope.tickPositions.push(pos);
                });
            }

            function setHighlightTicks(/*ticks*/) {
                // TODO
            }

            $scope.setState(states.BLANK);
            $scope.callback('CONSTRUCTED', {
                id               : $scope.id,
                setBlankMode     : setBlankMode,
                setValidRange    : setValidRange,
                windowMode       : windowMode,
                rangeDragMode    : rangeDragMode,
                rangeProgress    : rangeProgress,
                setTicks         : setTicks,
                setHighlightTicks: setHighlightTicks
            });

            $scope.$on('$destroy', function() {
                $scope.callback('DESTRUCTED', {
                    id: $scope.id
                });
            });

            gRangeScope.push($scope);
        }
    };
}])
.service('pfkRangeSelectorService', [
function () {
    return {
        dragInProgress : false
    };
}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
