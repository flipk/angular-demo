'use strict';




// TODO change pfk-rocker-switch, pfk-hover-menu, and pfk-slider-menu
//      to communicate with their parent using $emit and to receive $broadcast.






/**
 * @ngdoc function
 * @name angulardemoApp.controller:ButtonsCtrl
 * @description
 * # ButtonsCtrl
 * Controller of the angulardemoApp
 */
angular.module('angulardemoApp').controller('ButtonsCtrl',
       [ '$scope', '$interval', 'pfkRangeSelectorService',
function ($scope,   $interval,   pfkRangeSelectorService) {

    $scope.showCurrentMessage = 0;
    $scope.currentMessage = '';

    var msgArea = {
        timerPromise : null,
        displayMessage : function (msg) {
            $scope.currentMessage = msg;
            if (this.timerPromise) {
                $interval.cancel(this.timerPromise);
            }
            $scope.showCurrentMessage = 1;
            this.timerPromise = $interval(function(){
                $scope.radioButton.timerPromise = null;
                $scope.showCurrentMessage = 0;
            }, 1000, 1, true);
        }
    };

    $scope.$on('range0.centerChange',function(evt,data) {
        msgArea.displayMessage('new center on 0 ' + data);
    });
    $scope.$on('range0.dragComplete',function(evt,data) {
        msgArea.displayMessage('new range on 0 ' +
                               data[0] + ' ' + data[1]);
    });
    $scope.$on('range1.centerChange',function(evt,data) {
        msgArea.displayMessage('new center on 1 ' + data);
    });
    $scope.$on('range1.dragComplete',function(evt,data) {
        msgArea.displayMessage('new range on 1 ' +
                               data[0] + ' ' + data[1]);
    });

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
                                   $scope.radioButton.selection + ' on the left');
        },
        onChangeRight : function () {
            msgArea.displayMessage('thank you for selecting ' +
                                   $scope.radioButton.selection + ' on the right');
        },
        switchState : false,
        onSwitchChange : function () {
            msgArea.displayMessage(
                'thank you for flipping ' +
                    'the switch ' +
                    ($scope.radioButton.switchState ? 'ON' : 'OFF'));

            var newState =
                $scope.radioButton.switchState ?
                pfkRangeSelectorService.windowState.DISPLAYWINDOW :
                pfkRangeSelectorService.windowState.DRAGRANGESTART;

            $scope.radioButton.rangeConfigs[0].setState(newState);
            $scope.radioButton.rangeConfigs[1].setState(newState);
        },

        dispTicks : false,
        doDispTicks : function () {
            if ($scope.radioButton.dispTicks) {
                $scope.$broadcast('range0.updateTicks', [ 16, 29, 55, 116 ]);
                $scope.$broadcast('range1.updateTicks', [ 750, 755, 770, 800 ]);
            } else {
                $scope.$broadcast('range0.updateTicks', []);
                $scope.$broadcast('range1.updateTicks', []);
            }
        },

        rangeConfigs : [
            new pfkRangeSelectorService.RangeSelectorConfig(
                /*range*/ [[900, 1000], [1, 124]],
                /*windowSize*/ 128, /*windowCenter*/ 3
            ),
            new pfkRangeSelectorService.RangeSelectorConfig(
                /*range*/ [[512, 830]],
                /*windowSize*/ 128, /*windowCenter*/ 725
            )
        ]
    };
}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
