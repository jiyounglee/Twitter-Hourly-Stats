'use strict';

angular.module('twitterHourlyStatsApp')
  .controller('MainCtrl', function ($scope, $http, twitterService) {
    $scope.hasToken = false;
    $scope.processing = false;
    $scope.stats;

    $scope.canDisplayChart = function () {
      return $scope.stats != undefined && !$scope.processing;
    };

    twitterService.getToken()
      .success(function (data, status, headers) {
        if (status == 200) {
          console.log('success' + data.access_token);
          $http.defaults.headers.common['Authorization'] = "Bearer " + data.access_token;
          $scope.hasToken = true;
        }
        else {
          console.log('error' + error);
          $scope.hasToken = false;

        }
      });

    $scope.show = function () {
      console.log("show " + $scope.twitterScreenName);
      $scope.processing = true;

      twitterService.getStats($scope.twitterScreenName)
        .success(function (data, status, headers) {
          if(status == 200){
            console.log('success' + JSON.stringify(data));
            $scope.stats = data;
            $scope.processing = false;
          }
          else{
            $scope.processing = false;
            console.log('error' + error);
          }
        });
    };
  });
