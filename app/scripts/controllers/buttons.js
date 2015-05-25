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
            $scope.rightDemoMenu.setSelection($scope.radioButton.selection);
        }
    }; // $scope.radioButton

    $scope.rightDemoMenu = null;
    $scope.hoverCallback = function(evt,data) {
        switch (evt) {
        case 'CONSTRUCTED':
            $scope.rightDemoMenu = data;
            $scope.rightDemoMenu.setChoices($scope.radioButton.choices);
            $scope.rightDemoMenu.setSelection(1);
            break;
        case 'DESTRUCTED':
            break;
        case 'SELECTION':
            msgArea.displayMessage('thank you for selecting ' +
                                   data.index +
                                   ' on the right');
            $scope.radioButton.selection = data.index;
            break;
        }
    };

    $scope.do25 = false;

    var tickWidth = 1; //25
    $scope.do25Click = function() {
        if ($scope.do25) {
            tickWidth = 25;
        } else {
            tickWidth = 1;
        }
    };

    $scope.switchData = {};
    $scope.switchCallback = function(evt,data) {
        switch (evt) {
        case 'CONSTRUCTED':
            $scope.switchData[data.id] = data;
            break;
        case 'DESTRUCTED':
            delete $scope.switchData[data.id];
            break;
        case 'ON':
            msgArea.displayMessage(
                'thank you for flipping ' +
                    'the switch ON');
            $scope.ranges.range0.windowMode(3,128);
            $scope.ranges.range1.windowMode(725,128);
            break;
        case 'OFF':
            msgArea.displayMessage(
                'thank you for flipping ' +
                    'the switch OFF');
            $scope.ranges.range0.rangeDragMode(null,null,tickWidth);
            $scope.ranges.range1.rangeDragMode(null,null,tickWidth);
            break;
        }
    };

    $scope.dispTicks = false;
    $scope.doDispTicks = function () {
        if ($scope.dispTicks) {
            if ($scope.radioButton.selection === 1) {
                $scope.ranges.range0.setTicks([ 16, 29, 55, 116 ], 1);
            } else {
                $scope.ranges.range0.setTicks([ 1, 77 ], 25);
            }
            $scope.ranges.range1.setTicks([ 750, 755, 770, 800 ], 5);
            if ($scope.radioButton.selection === 3) {
                $scope.ranges.range0.setHighlightTicks([ 1, 77 ], 25);
                $scope.ranges.range1.setHighlightTicks(
                    [750, 755, 770, 800], 5);
            }
        } else {
            $scope.ranges.range0.setTicks([]);
            $scope.ranges.range1.setTicks([]);
            $scope.ranges.range0.setHighlightTicks([]);
            $scope.ranges.range1.setHighlightTicks([]);
        }
    };

    $scope.ranges = {};

    var group1 = [];
    var cnt;
    for (cnt = 900; cnt <= 1000; cnt++) {
        group1.push(cnt);
    }
    for (cnt = 1; cnt <= 124; cnt++) {
        group1.push(cnt);
    }

    var group2 = [];
    for (cnt = 512; cnt <= 830; cnt++) {
        group2.push(cnt);
    }

    $scope.handleRangeEvent = function(evt,data) {
        switch (evt) {
        case 'CONSTRUCTED':
            $scope.ranges[data.id] = data;
            if (data.id === 'range0') {
                data.setValidTicks(group1);
                data.ticks = group1;
            }
            if (data.id === 'range1') {
                data.setValidTicks(group2);
                data.ticks = group2;
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

            var startInd = data.startInd;
            var endInd = data.endInd;
            var currentInd = data.startInd;
            var whichRange = data.id;
            var promise = $interval(function() {
                $scope.ranges[whichRange].rangeProgress(
                    $scope.ranges[whichRange].ticks[startInd],
                    $scope.ranges[whichRange].ticks[endInd],
                    $scope.ranges[whichRange].ticks[currentInd],
                    tickWidth
                );
                currentInd ++;
                if (currentInd >= endInd) {
                    $interval.cancel(promise);
                    $scope.ranges[whichRange].rangeDragMode(
                        $scope.ranges[whichRange].ticks[startInd],
                        $scope.ranges[whichRange].ticks[endInd],
                        tickWidth
                    );
                }
            }, 100, 0, true);

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
