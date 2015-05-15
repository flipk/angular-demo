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
        { index: 0, view: 'home'     , path: '/views/main.html'     , left:0   },
        { index: 1, view: 'buttons'  , path: '/views/buttons.html'  , left:100 },
        { index: 2, view: 'starfield', path: '/views/starfield.html', left:200 },
        { index: 3, view: 'about'    , path: '/views/about.html'    , left:300 },
    ];

    $scope.viewPath = $scope.views[0].path;
    $scope.viewNum = 0;
    $scope.viewTranslate = 0;

/*
    var urlView = utilities.getView();
    for (var ind in $scope.views) {
        var v = $scope.views[ind];
        if (v.path === urlView) {
            $scope.viewNum = ind;
        }
    }
*/

    $scope.updateView = function (index) {
        $scope.viewNum = index;
        $scope.viewPath = $scope.views[index].path;
        $scope.viewTranslate = $scope.views[index].left;
    };

}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
