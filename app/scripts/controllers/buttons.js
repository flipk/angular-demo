'use strict';

var gButtonsScope = null;

/**
 * @ngdoc function
 * @name angulardemoApp.controller:ButtonsCtrl
 * @description
 * # ButtonsCtrl
 * Controller of the angulardemoApp
 */
angular.module('angulardemoApp').controller('ButtonsCtrl',
       [ '$scope', '$interval',
function ($scope,   $interval) {

    $scope.showCurrentMessage = 0;
    $scope.currentMessage = '';

    var msgArea = {
        timerPromise : null,
        displayMessage : function (msg) {
            $scope.currentMessage = msg;
            if (msgArea.timerPromise) {
                $interval.cancel(msgArea.timerPromise);
            }
            $scope.showCurrentMessage = 1;
            msgArea.timerPromise = $interval(function(){
                msgArea.timerPromise = null;
                $scope.showCurrentMessage = 0;
            }, 1000, 1, true);
        }
    };

    // note the choice of making an object.
    // this is because ng-repeat makes a new scope, so when
    // the <input> tries to assign a new value to 'selection',
    // it assigns it in the child scope. but referencing it
    // through the object shares memory with this $scope here,
    // so it modifies this one.

    $scope.radioButton = {
        choices : [
            'First Option',
            'Second Option',
            'Third Option',
            'Fourth Option',
            'Fifth Option',
        ],
        selection : 1,
        onChangeLeft : function () {
            msgArea.displayMessage('thank you for selecting ' +
                                   $scope.radioButton.selection +
                                   ' on the left');
        },
        onChangeRight : function () {
            msgArea.displayMessage('thank you for selecting ' +
                                   $scope.radioButton.selection +
                                   ' on the right');
        }
    }; // $scope.radioButton

    $scope.switchState = false;
    $scope.switchClick = function () {
        msgArea.displayMessage(
            'thank you for flipping ' +
                'the switch ' +
                ($scope.switchState ? 'ON' : 'OFF'));

        if ($scope.switchState) {
            $scope.ranges.range0.windowMode(3,128);
            $scope.ranges.range1.windowMode(725,128);
        } else {
            $scope.ranges.range0.rangeDragMode();
            $scope.ranges.range1.rangeDragMode();
        }
    };
    $scope.dispTicks = false;
    $scope.doDispTicks = function () {
        if ($scope.dispTicks) {
            $scope.ranges.range0.setTicks([ 16, 29, 55, 116 ]);
            $scope.ranges.range1.setTicks([ 750, 755, 770, 800 ]);
        } else {
            $scope.ranges.range0.setTicks([]);
            $scope.ranges.range1.setTicks([]);
        }
    };

    $scope.ranges = {};
    $scope.handleRangeEvent = function(evt,data) {
        switch (evt) {
        case 'CONSTRUCTED':
            $scope.ranges[data.id] = data;
            if (data.id === 'range0') {
                data.setValidRange([[900, 1000], [1, 124]]);
            }
            if (data.id === 'range1') {
                data.setValidRange([[512,830]]);
            }
            break;
        case 'DESTRUCTED':
            // 
            break;
        case 'WINDOWMOVED':
            msgArea.displayMessage('window moved '+JSON.stringify(data));
            break;
        case 'RANGEDRAGGED':
            msgArea.displayMessage('range dragged '+JSON.stringify(data));
            if (data.startTick < data.endTick) {
                var startPos = data.startTick;
                var endPos = data.endTick;
                var currentPos = data.startTick;
                var whichRange = data.id;
                var promise = $interval(function() {
                    $scope.ranges[whichRange].rangeProgress(
                        startPos, endPos, currentPos
                    );
                    currentPos ++;
                    if (currentPos >= endPos) {
                        $interval.cancel(promise);
                        $scope.ranges[whichRange].rangeDragMode(
                            startPos, endPos);
                    }
                }, 100, 0, true);
            }
            break;
        }
    };

    gButtonsScope = $scope;
    $scope.$on('$destroy',function() {
        gButtonsScope = null;
    });
}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
