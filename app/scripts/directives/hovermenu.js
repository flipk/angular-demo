'use strict';

// usage:
//    <pfk-hover-menu id="id" callback="parentCallback">
//
// parentCallback : function(evt,data) where
//    evt = 'SELECTION'     and data = { id, index }
//    evt = 'DESTRUCTED'    and data = { id }
//    evt = 'CONSTRUCTED'   and data = { id, setChoices, setSelection }
//
// where
//    setChoices : function(array)
//    setSelection : function(index)

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
            id: '@',
            callback : '=callback'
        },
        controller : function($scope
                              // ,$element,$attrs,$transclude
                              //,otherInjectables
                             ) {

            $scope.choices = [];
            $scope.value = { selection : 0 };
            $scope.onClick = function() {
                $scope.callback('SELECTION', {
                    id : $scope.id,
                    index : $scope.value.selection
                });
            };

            function setChoices(array) {
                $scope.choices.length = 0;
                array.forEach(function(c) {
                    $scope.choices.push(c);
                });
                $scope.value.selection = 0;
            }

            function setSelection(index) {
                $scope.value.selection = index;
            }

            $scope.callback('CONSTRUCTED', { 
                id : $scope.id,
                setChoices : setChoices,
                setSelection : setSelection
            });

            $scope.$on('$destroy', function() {
                $scope.callback('DESTRUCTED', { id: $scope.id });
            });
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
