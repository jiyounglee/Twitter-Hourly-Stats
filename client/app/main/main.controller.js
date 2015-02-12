'use strict';

angular.module('twitterHourlyStatsApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.hasToken = false;
    $scope.processing = false;
    $scope.stats;

    $scope.canDisplayChart = function () {
      return $scope.stats != undefined && !$scope.processing;
    };

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
          $scope.stats = stats;
          $scope.processing = false;
          $scope.chartConfig = {
            options: {
              xAxis: {
                categories: Object.keys(stats),
                title: {
                  enabled: true,
                  text: 'Hours',
                  style: {
                    fontWeight: 'normal'
                  }
                }
              },
              yAxis: {
                title: {
                  enabled: true,
                  text: 'Tweets',
                  style: {
                    fontWeight: 'normal'
                  }
                }
              },
              chart: {
                type: 'column'
              },
              navigation: {
                buttonOptions: {
                  enabled: false
                }
              },
              tooltip: {
                enabled: false
              }
            },
            series: [{
              data: Object.keys(stats).map(function (key) {
                return stats[key];
              }),
              showInLegend: false,
              color: 'rgb(67, 147, 185)'
            }],
            credits: {
              enabled: false
            },
            title: {
              text: $scope.twitterScreenName
            },
            loading: false
          };
        })
        .error(function (error) {
          $scope.processing = false;
          console.log('error' + error);
        })
    };
  });
