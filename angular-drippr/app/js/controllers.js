'use strict';

/* Controllers */

var dripprControllers = angular.module('dripprControllers', []);

dripprControllers.controller('generateCtrl', ['$scope', '$http',
  function($scope, $http) {
  	console.log("nate");
    $http.get('json/articles.json').success(function(data) {
      $scope.articles = data;
      console.log(data);

    });
    // $scope.orderProp = 'age';
  }]);
