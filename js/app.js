"use strict";

var parse = "https://api.parse.com/1/classes/comments";
var appID = "84NMKhKR76mcnLznIr7GMChwVc2YFRC3q9y1YrOF";
var RESTAPIKey = "wZhyYrhuSjxTm6uVxIbs0ljKTeO1MRzclKbyLuu3";

angular.module("CommentApp", [])
    .config(function($httpProvider) {
        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = appID;
        $httpProvider.defaults.headers.common['X-Parse-REST-Api-Key'] = RESTAPIKey;
    })
    .controller("CommentController", function($scope, $http) {
        $scope.refreshComments = function() {
            $scope.loading = true;
            $http.get(parse + "?order=-score")
                .success(function(responseData) {
                    $scope.comments = responseData.results;
                    console.log($scope.comments);
                })
                .error(function(err) {
                    console.log($scope.tasks);
                })
                .finally(function() {
                    $scope.loading = false;
                    $scope.voted = false;
                });
        };

        $scope.refreshComments();

        $scope.newComment = {score: 0};

        $scope.addComment = function(comment) {
            //all fields required
            if (comment.rating == undefined || comment.name == undefined ||
                comment.title == undefined || comment.comment == undefined) {
                return;
            }

            $http.post(parse, comment)
                .success(function(responseData) {
                    comment.objectId = responseData.objectId;
                    $scope.comments.push(comment);
                    $scope.newComment = {score: 0};
                });
        };

        $scope.updateComment = function(comment) {
            $http.delete(parse + '/' + comment.objectId)
                .success(function(responseData) {
                    $scope.refreshComments();
                })
                .error(function(err) {
                    console.log(err);
                });
        };

        $scope.updateScore = function(comment, num) {
            //score cannot go below 0
            if (comment.score == 0 && num == -1) {
                return;
            }

            $scope.voted = true;

            comment.score = comment.score + num;
            $http.put(parse + '/' + comment.objectId, comment)
                .success(function(responseData) {
                })
                .error(function(err) {
                    console.log(err);
                });
        };
    });