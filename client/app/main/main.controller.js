'use strict';

angular.module('twitterHourlyStatsApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function (awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $http.get('/api/twitter/token')
      .success(function (token) {
        console.log('success' + token);
        console.log('success' + token.access_token);
        $http.defaults.headers.common['Authorization'] = "Bearer " + token.access_token;

        $http.get('/api/twitter/stats')
          .success(function (stats) {
            console.log('success' + JSON.stringify(stats));

          })
          .error(function (error) {
            console.log('error' + error);
          })
      })
      .error(function (error) {
        console.log('error' + error);
      });

  });
