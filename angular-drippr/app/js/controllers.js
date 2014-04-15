'use strict';

/* Controllers */

var dripprControllers = angular.module('dripprControllers', []);

dripprControllers.controller('generateCtrl', ['$scope', '$http',
  function($scope, $http) {
    $http.get('json/articles.json').success(function(data) {
      $scope.articles = data;
    });
    // $scope.orderProp = 'age';
  }]);
