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
      when('/inbox', {
        templateUrl: 'partials/inbox.html',
        controller: 'inboxCtrl'
      }).
      otherwise({
        redirectTo: '/inbox'
      });
  }]);