'use strict';

angular.module('twitterHourlyStatsApp')
  .factory('twitterService', function ($http) {
    return {
      token: function () {
        return $http.get('/api/twitter/token');
      }
    };
  });
