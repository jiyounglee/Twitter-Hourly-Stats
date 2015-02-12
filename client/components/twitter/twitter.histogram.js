'use strict';

angular.module('twitterHourlyStatsApp')
  .directive('histogram', function () {
    return {
      scope: false,
      restrict: 'E',
      template: '<highchart ng-show="canDisplayChart()" config="chartConfig" class="span10"></highchart>',
      controller: function ($scope) {
        $scope.$watch('stats', function(stats) {
          if (stats != undefined) {
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
          }
        });
      }
    };
  });
