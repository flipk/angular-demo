'use strict';

var gNavCtrlScope = null;

/**
 * @ngdoc function
 * @name angulardemoApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the angulardemoApp
 */
angular.module('angulardemoApp').controller('NavbarCtrl',
       [ '$scope', '$interval', //'utilities',
function ($scope ,  $interval /*,utilities*/) {

    function View(view,path,leftIndex) {
        this.view = view;
        this.path = 'views/' + path;
        this.show = false;
        this.left = (leftIndex * 100) + '%';
    }

    $scope.homeView      = new View('home',      'main.html',      0);
    $scope.buttonsView   = new View('buttons',   'buttons.html',   1);
    $scope.starfieldView = new View('starfield', 'starfield.html', 2);
    $scope.aboutView     = new View('about',     'about.html',     3);

    $scope.views = [
        $scope.homeView,
        $scope.buttonsView,
        $scope.starfieldView,
        $scope.aboutView,
    ];

    $scope.currentView = $scope.views[0];
    $scope.currentView.show = true;

/*
    var urlView = utilities.getView();
    for (var ind in $scope.views) {
        var v = $scope.views[ind];
        if (v.path === urlView) {
            $scope.viewNum = ind;
        }
    }
*/

    var promiseHolder = {
        promiseFunc : null,
        promise : null
    };

    $scope.updateView = function (index) {
        var oldView = $scope.currentView;
        $scope.currentView = $scope.views[index];
        if (promiseHolder.promise) {
            // if a timer is running, cancel it and 
            // do its work now.
            $interval.cancel(promiseHolder.promise);
            promiseHolder.promiseFunc();
        }
        // construct a new closure for the new timer.
        // we do this every time because the closure's
        // values may change.
        promiseHolder.promiseFunc = function() {
            oldView.show = false;
            promiseHolder.promise = null;
        };
        // and set the timer.
        promiseHolder.promise = $interval(
            promiseHolder.promiseFunc,
            /*delay*/1000, 1, true);
        // set the new view's show last, just
        // in case the new view's show flag 
        // is what just got cleared in the 
        // above promise cancel.
        $scope.views[index].show = true;
    };

    gNavCtrlScope = $scope;
    $scope.$on('$destroy', function() {
        gNavCtrlScope = null;
    });

}]);

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
