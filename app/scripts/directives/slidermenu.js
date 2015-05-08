'use strict';

/**
 * @ngdoc directive
 * @name testappApp.directive:slidermenu
 * @description
 * # slidermenu
 */
angular.module('angulardemoApp')
    .directive('pfkSliderMenu',
function () {
    return {
        templateUrl: 'templates/slidermenu.html',
        restrict: 'E',
        scope : {
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

        // TODO learn what   require:'sibling'  or require:'^parent'  means

        controller : function($scope
                              // ,$element,$attrs,$transclude
                              //,otherInjectables
                             ) {

            $scope.notUsed = true; // make warnings go away

        }

        //      link: function postLink(scope, element, attrs) {
        //            element.text('this is the slidermenu directive');
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
