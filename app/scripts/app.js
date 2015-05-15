'use strict';

/**
 * @ngdoc overview
 * @name angulardemoApp
 * @description
 * # angulardemoApp
 *
 * Main module of the application.
 */
angular
  .module('angulardemoApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
/*
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/buttons', {
        templateUrl: 'views/buttons.html',
        controller: 'ButtonsCtrl'
      })
      .when('/starfield', {
          templateUrl: 'views/starfield.html',
          controller: 'StarfieldCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
*/
;

/*
  Local Variables:
  mode: javascript
  indent-tabs-mode: nil
  tab-width: 8
  End:
*/
