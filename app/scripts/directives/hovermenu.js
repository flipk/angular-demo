'use strict';

/**
 * @ngdoc directive
 * @name testappApp.directive:hovermenu
 * @description
 * # hovermenu
 */
angular.module('angulardemoApp')
    .directive('pfkHoverMenu',
function () {
    return {
        templateUrl: 'templates/hovermenu.html',
        restrict: 'E',
        scope: {
            // variables here can be substituted in the template.
            // '@' means look at <pfk-slider-menu> attributes and copy.
            // '=' means set up 2-way binding with variable name in
            // parent scope (controller in this case)
            // '&' means hook for function execution.
            choices: '=choices',
            name: '@name',
            value: '=value',
            onChange : '=onChange'
        },

        controller : function($scope
                              // ,$element,$attrs,$transclude
                              //,otherInjectables
                             ) {

            $scope.notUsed = true; // avoid warning

        }

//      link: function postLink(scope, element, attrs) {
//            element.text('this is the hovermenu directive');
//      }
    };
});

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
