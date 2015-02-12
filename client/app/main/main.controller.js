'use strict';

angular.module('twitterHourlyStatsApp')
  .controller('MainCtrl', function ($scope, $http, twitterService) {
    $scope.hasToken = false;
    $scope.processing = false;
    $scope.stats;
    $scope.hasError = false;

    $scope.canDisplayChart = function () {
      return $scope.stats != undefined && !$scope.processing && $scope.hasError == false;
    };

    twitterService.getToken()
      .success(function (data, status, headers) {
        console.log('Authenticaticated');
        $http.defaults.headers.common['Authorization'] = "Bearer " + data.access_token;
        $scope.hasToken = true;
      })
      .error(function (data, status, headers) {
        console.log('Authenticatication Failed' + error);
        $scope.hasToken = false;
      });

    $scope.show = function () {
      console.log("show " + $scope.twitterScreenName);
      $scope.processing = true;
      $scope.hasError = false;

      twitterService.getStats($scope.twitterScreenName)
        .success(function (data, status, headers) {
          console.log('Retrieved Stats' + JSON.stringify(data));
          $scope.stats = data;
          $scope.processing = false;
          $scope.hasError = false;
        })
        .error(function (data, status, headers) {
          $scope.error = data;
          $scope.processing = false;
          $scope.hasError = true;

          console.log('Failed to retrieve stats ' + data);
        });
    };
  });
