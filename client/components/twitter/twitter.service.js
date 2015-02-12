'use strict';

angular.module('twitterHourlyStatsApp')
  .factory('twitterService', function ($http) {
    return {
      getToken: function () {
        return $http.get('/api/twitter/token');
      },
      getStats: function (screenName) {
        return $http.get('/api/twitter/stats', {params: {twitterScreenName: screenName}})
      }
    };
  });
