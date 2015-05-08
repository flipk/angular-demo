'use strict';

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
        scope: {
            value : '=value',
            onChange : '=onChange'
        },
//      link: function postLink(scope, element, attrs) {
//            element.text('this is the rockerswitch directive');
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
