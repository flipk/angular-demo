'use strict';

// usage:
//  <pfk-view-size-selector
//     large-width-threshold="1040"   large-path="fullsize.html"
//     medium-width-threshold="500"   medium-path="mediumsize.html"
//                                    small-path="smallsize.html"
//  >
//  </pfk-view-size-selector>

var gViewSizeSelector = null;

/**
 * @ngdoc directive
 * @name testappApp.directive:rockerswitch
 * @description
 * # rockerswitch
 */
angular.module('angulardemoApp')
    .directive('pfkViewSizeSelector',
        ['utilities',
function (utilities) {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="fullsizePage"' +
            'ng-include="selectedPath"></div>',
        scope: {
            largeWidthThreshold : '@largeWidthThreshold',
            largePath : '@largePath',
            mediumWidthThreshold : '@mediumWidthThreshold',
            mediumPath : '@mediumPath',
            smallPath : '@smallPath'
        },
//      link: function postLink(scope, element, attrs) {
//            element.text('this is the rockerswitch directive');
//      }
        controller : function($scope) { // $element $attrs

            var bodyElement = angular.element('body');

            $scope.selectedPath = null;

            function _handleResize() {
                var width = bodyElement.width();
                var selected = null;

                if (width > $scope.largeWidthThreshold)
                {
                    selected = $scope.largePath;
                }
                else if (width > $scope.mediumWidthThreshold)
                {
                    selected = $scope.mediumPath;
                }
                else
                {
                    selected = $scope.smallPath;
                }

                if ($scope.selectedPath !== selected) {
                    $scope.selectedPath = selected;
                }
            }

            function handleResize() {
                $scope.$apply(_handleResize);
            }

            gViewSizeSelector = $scope;
            utilities.onWindowSize(handleResize);
            _handleResize();

            $scope.$on('$destroy', function() {
                utilities.offWindowSize(handleResize);
                gViewSizeSelector = null;
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
