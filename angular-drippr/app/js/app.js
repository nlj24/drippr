'use strict';

/* App Module */

var dripprApp = angular.module('dripprApp', [
  'ngRoute',
  'dripprControllers'
]);

dripprApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/generate', {
        templateUrl: 'partials/generate.html',
        controller: 'generateCtrl'
      }).
      otherwise({
        redirectTo: '/generate'
      });
  }]);