'use strict';

/* Controllers */

var dripprControllers = angular.module('dripprControllers', []);

dripprControllers.controller('generateCtrl', ['$scope', '$http',
	function($scope, $http) {
		$http.get('json/articles.json').success(function(data) {
			$scope.articles = data;
   		});

	var like = 0;
   	$scope.like = function(article) {
   		//actually be database
   		article.numLikes++;
		console.log(article.numLikes);  //link to database
	};

	$scope.dislike = function(article) {
   		//actually be database
   		article.numDislikes++;
		console.log(article.numDislikes);  //link to database
	};
	
	$scope.login = function() {
		console.log("login");  //link to database
	};
	
	$scope.signup = function() {
		console.log("signup");  //link to database
	};
}]);


dripprControllers.controller('inboxCtrl', ['$scope', '$http',
	function($scope, $http) {
		$http.get('json/inbox.json').success(function(data) {
			$scope.articles = data;
   		});

	var like = 0;
   	$scope.like = function(article) {
   		//actually be database
   		article.numLikes++;
		console.log(article.numLikes);  //link to database
	};

	$scope.dislike = function(article) {
   		//actually be database
   		article.numDislikes++;
		console.log(article.numDislikes);  //link to database
	};
	
	$scope.login = function() {
		console.log("login");  //link to database
	};
	
	$scope.signup = function() {
		console.log("signup");  //link to database
	};
}]);