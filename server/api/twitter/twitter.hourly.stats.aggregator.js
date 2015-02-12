'use strict';

exports.aggregate = function (twitts) {

  function createInitialHourlyStats() {
    var stats = {};
    for (var i = 0; i < 24; i++) {
      stats[i] = 0;
    }
    return stats;
  }

  console.log('Started aggregating' + twitts.length);
  var aggregatedStats = createInitialHourlyStats();

  for (var i = 0 in twitts) {
    var date = new Date(twitts[i].created_at);
    var hourlyCount = aggregatedStats[date.getUTCHours()] + 1;
    aggregatedStats[date.getUTCHours()] = hourlyCount;
  }

  console.log('Finished aggregating' + JSON.stringify(aggregatedStats));
  var total = 0;
  for (var i = 0; i < 24; i++) {
    total = total + aggregatedStats[i];
  }
  console.log('total ' + total);
  return aggregatedStats;
}
