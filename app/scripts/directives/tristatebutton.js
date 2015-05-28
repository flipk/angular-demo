'use strict';

// usage:
//    <pfk-tristate-button id="SOMESTRING" callback="parentCallback">
//
//  parentCallback : function (evt, data)  where
//   evt = 'CLICKED'      and data = { id, oldValue, newValue }
//   evt = 'DESTRUCTED'   and data = { id }
//   evt = 'CONSTRUCTED'  and data = { id, setState } 
//
// where
//   currentValue : state before clicked, 0, 1, 2 or true, false
//   setState(value) :  value is false, true, 0, 1, or 2

angular.module('angulardemoApp')
    .directive('pfkTristateButton',
        [
function () {
    return {
        templateUrl: 'templates/tristatebutton.html',
        restrict: 'E',
//        link: function (scope, element, attrs,controllers) {
//            scope.buttonsCtrl = controllers[0];
//            console.log('controllers[0] is',controllers[0]);
//        },
        transclude: true,
        replace:false,
        scope: {
            // variables here can be substituted in the template.
            // '@' means look at <pfk-slider-menu> attributes and copy.
            // '=' means set up 2-way binding with variable name in
            // parent scope (controller in this case)
            // '&' means hook for function execution.
            id: '@',
            size: '@',
            labelWidth: '@',
            callback: '='
        },
        controller : function($scope
                              // ,$element,$attrs,$transclude
                              //,otherInjectables
                             ) {
            $scope.value = 0;
            $scope.wholeSize = Number($scope.size) + Number($scope.labelWidth);
            $scope.buttonSize = Number($scope.size);
            $scope.click = function() {
                var after = null;
                switch ($scope.value) {
                case true:
                    after = false;
                    break;
                case false:
                    after = true;
                    break;
                case 0:
                    after = 1;
                    break;
                case 1:
                case 2:
                    after = 0;
                    break;
                }
                $scope.callback('CLICKED', {
                    id : $scope.id,
                    oldValue : $scope.value,
                    newValue : after
                });
                $scope.value = after;
            };

            function setState(newValue) {
                $scope.value = newValue;
            }

            $scope.callback('CONSTRUCTED', {
                id : $scope.id,
                setState : setState
            });

            $scope.$on('$destroy', function() {
                $scope.callback('DESTRUCTED', {
                    id : $scope.id
                });
            });
        }
    };
}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
