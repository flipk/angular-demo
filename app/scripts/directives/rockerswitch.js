'use strict';

// usage:
//    <pfk-rocker-switch id="id" callback="parentCallback">
//
// parentCallback : function(evt,data) where
//    evt = 'ON'            and data = { id }
//    evt = 'OFF'           and data = { id }
//    evt = 'DESTRUCTED'    and data = { id }
//    evt = 'CONSTRUCTED'   and data = { id, setOnColor, setOffColor }
//
// where
//   setOnColor(colorName)
//   setOffColor(colorName)

/**
 * @ngdoc directive
 * @name testappApp.directive:rockerswitch
 * @description
 * # rockerswitch
 */
angular.module('angulardemoApp')
    .directive('pfkRockerSwitch',
function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/rockerswitch.html',
        scope: {
            id       : '@id',
            callback : '=callback'
        },
//      link: function postLink(scope, element, attrs) {
//            element.text('this is the rockerswitch directive');
//      }
        controller : function($scope) { // $element $attrs

            $scope.value = false;
            $scope.click = function() {
                if ($scope.value) {
                    $scope.callback('ON', { id : $scope.id });
                } else {
                    $scope.callback('OFF', { id : $scope.id });
                }
            };

            function setOnColor() {
                // not implemented
            }
            function setOffColor() {
                // not implemented
            }

            $scope.callback('CONSTRUCTED', {
                id : $scope.id,
                setOnColor: setOnColor,
                setOffColor: setOffColor,
            });
            $scope.$on('$destroy',function() {
                $scope.callback('DESTRUCTED', { id : $scope.id });
            });
        }
    };
});

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
