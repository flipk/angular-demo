'use strict';

/**
 * @ngdoc function
 * @name angulardemoApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the angulardemoApp
 */
angular.module('angulardemoApp').controller('AboutCtrl',
       [ '$scope',
function ($scope) {

    $scope.$on('$destroy', function() {
    });

}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
