'use strict';

exports.aggregate = function (twitts) {

  function createInitialHourlyStats() {
    var stats = {};
    for (var i = 0; i < 24; i++) {
      stats[i] = 0;
    }
    return stats;
  }

  console.log('Started aggregating');
  var aggregatedStats = createInitialHourlyStats();

  for (var i = 0 in twitts) {
    var date = new Date(twitts[i].created_at);
    var hourlyCount = aggregatedStats[date.getUTCHours()] + 1;
    aggregatedStats[date.getUTCHours()] = hourlyCount;
  }

  console.log('Finished aggregating ' + JSON.stringify(aggregatedStats));
  return aggregatedStats;
}
