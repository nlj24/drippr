'use strict';

/* Controllers */

var dripprControllers = angular.module('dripprControllers', []);

dripprControllers.controller('generateCtrl', ['$scope', '$http',
	function($scope, $http) {
		$http.get('json/articles.json').success(function(data) {
			$scope.articles = data;
   		});

	var like = 0;
   	$scope.like = function() {
		like = like + 1;
		console.log(like);  //link to database
	};

	var dislike = 0;
	$scope.dislike = function() {
		dislike = dislike + 1;
		console.log(dislike);  //link to database
	};
}]);
