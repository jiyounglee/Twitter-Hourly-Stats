'use strict';

var https = require('https');
var aggregator = require('./twitter.hourly.stats.aggregator.js')

exports.get = function (req, res) {

  console.info('Started retriieving timeline ' + req.header('Authorization'));
  var twitts = [];

  console.info('GetTwitts');

  var callback = function (data) {
    twitts = twitts.concat(data);
    console.info("________ Callback " + twitts.length);
    if (twitts.length < 500) {
      console.info('GetTwitts' + twitts[twitts.length - 1]);
      getTwitts(req, res, data[data.length - 1].id_str, callback);
    }
    else {
      if (twitts.length > 500) {
        console.info("length - 500 = " + twitts.length - 500)
        twitts.splice(500, (twitts.length - 500));
      }
      console.info('spliced twitts' + twitts.length);
      res.json(aggregator.aggregate(twitts));
    }
  };

  getTwitts(req, res, "", callback);

};

function getTwitts(req, res, max_id, callback) {

  function buildOptions(req, max_id) {
    var options = {
      host: 'api.twitter.com',
      method: 'GET',
      headers: {
        'Authorization': req.header('Authorization')
      }
    };

    if (max_id != "") {
      options.path = '/1.1/statuses/user_timeline.json?trim_user=true&screen_name=twitterapi&count=200&max_id=' + max_id;
    }
    else {
      options.path = '/1.1/statuses/user_timeline.json?trim_user=true&screen_name=twitterapi&count=200';
    }

    return options;
  }

  var options = buildOptions(req, max_id);

  var reqGet = https.request(options, function (response) {
    var concatenatedData = "";

    response.on('data', function (d) {
      console.info('Retrieved timeline : ' + d);
      concatenatedData = concatenatedData.concat(d);
    });

    response.on('end', function () {
      console.info('Retrieved timeline : ' + concatenatedData);
      var parsedData = JSON.parse(concatenatedData);
      if (max_id != "" && parsedData[0].id_str == max_id) {
        parsedData.splice(0, 1);
      }
      callback(parsedData);
    });
  });

  reqGet.on('error', function (e) {
    console.error(e);
    res.status(401);
  });

  reqGet.end();
};
