'use strict';

/**
 * @ngdoc function
 * @name angulardemoApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the angulardemoApp
 */
angular.module('angulardemoApp').controller('NavbarCtrl',
       [ '$scope', 'utilities',
function ($scope,   utilities) {

    $scope.views = [
        { index: 0, view: 'home'     , path: '/'          },
        { index: 1, view: 'buttons'  , path: '/buttons'   },
        { index: 2, view: 'starfield', path: '/starfield' },
        { index: 3, view: 'about'    , path: '/about'     },
    ];

    $scope.viewNum = 0;

    var urlView = utilities.getView();
    for (var ind in $scope.views) {
        var v = $scope.views[ind];
        if (v.path === urlView) {
            $scope.viewNum = ind;
        }
    }

    $scope.updateView = function (index) {
        $scope.viewNum = index;
    };

}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
