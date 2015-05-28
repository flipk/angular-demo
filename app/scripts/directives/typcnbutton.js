'use strict';

// usage:
//    <pfk-typcn-button typcn="name" click="clickFunc">

angular.module('angulardemoApp').directive('pfkTypcnButton',
         [
function () {
    return {
        templateUrl: 'templates/typcnbutton.html',
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
            typcn: '@',
            click: '&'
        },
        controller : function($scope
                              // ,$element,$attrs,$transclude
                              //,otherInjectables
                             ) {
            $scope.doClick = function() {
                $scope.click();
            };
            $scope.$on('$destroy', function() {
                // xxx
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
