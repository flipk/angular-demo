'use strict';

/**
 * @ngdoc function
 * @name angulardemoApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the angulardemoApp
 */
angular.module('angulardemoApp').controller('NavbarCtrl',
       [ '$scope', //'utilities',
function ($scope  /*,utilities*/) {

    $scope.views = [
        {
            view: 'home',
            path: 'views/main.html',
            left: '0%'
        }, {
            view: 'buttons',
            path: 'views/buttons.html',
            left: '100%'
        }, {
            view: 'starfield',
            path: 'views/starfield.html',
            left: '200%'
        }, {
            view: 'about',
            path: 'views/about.html',
            left: '300%'
        },
    ];

    $scope.currentView = $scope.views[0];

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
        $scope.currentView = $scope.views[index];
    };

}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
