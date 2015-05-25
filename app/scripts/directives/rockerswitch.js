'use strict';

// usage:
//    <pfk-rocker-switch id="id" callback="parentCallback">
//
// parentCallback : function(evt,data) where
//    evt = 'ON'            and data = { id }
//    evt = 'OFF'           and data = { id }
//    evt = 'DESTRUCTED'    and data = { id }
//    evt = 'CONSTRUCTED'   and data = { id, setOnStuff, setOffStuff }
//
// where
//   setState(value)
//   setOnStuff(text,color) WAIT, OK, red, green
//   setOffStuff(text) BUSY, FREE

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
	replace:true,
        scope: {
            id       : '@id',
            callback : '=callback'
        },
//      link: function postLink(scope, element, attrs) {
//            element.text('this is the rockerswitch directive');
//      }
        controller : function($scope) { // $element $attrs

            $scope.onText = 'ON';
            $scope.onColorGreen = true;
            $scope.onColorRed = false;
            $scope.offText = 'OFF';
            $scope.value = false;
            $scope.click = function() {
                if ($scope.value) {
                    $scope.callback('ON', { id : $scope.id });
                } else {
                    $scope.callback('OFF', { id : $scope.id });
                }
            };

	    function setState(value) {
		$scope.value = value;
	    }
            function setOnStuff(text,color) {
                $scope.onText = text;
                if (color === 'red') {
                    $scope.onColorRed = true;
                    $scope.onColorGreen = false;
                } else {
                    $scope.onColorRed = false;
                    $scope.onColorGreen = true;
                }
            }
            function setOffStuff(text) {
                $scope.offText = text;
            }

            $scope.callback('CONSTRUCTED', {
                id : $scope.id,
                setState: setState,
                setOnStuff: setOnStuff,
                setOffStuff: setOffStuff,
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
