'use strict';

angular.module('twitterHourlyStatsApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.hasToken = false;
    $scope.processing = false;

    $http.get('/api/twitter/token')
      .success(function (token) {
        console.log('success' + token);
        console.log('success' + token.access_token);
        $http.defaults.headers.common['Authorization'] = "Bearer " + token.access_token;
        $scope.hasToken = true;
      })
      .error(function (error) {
        console.log('error' + error);
        $scope.hasToken = false;
      });

    $scope.show = function () {
      console.log("show");
      console.log($scope.twitterScreenName);
      $scope.processing = true;
      $http.get('/api/twitter/stats', {params: {twitterScreenName: $scope.twitterScreenName}})
        .success(function (stats) {
          console.log('success' + JSON.stringify(stats));
          $scope.processing = false;
        })
        .error(function (error) {
          $scope.processing = false;
          console.log('error' + error);
        })
    };
  });
