'use strict';

var https = require('https');
var aggregator = require('./twitter.hourly.stats.aggregator.js')

exports.get = function (req, res) {
  var tweets = [];
  var max_id = "";

  var callback = function (data) {
    tweets = tweets.concat(data);
    var lastTweet = tweets[tweets.length - 1];
    var num_of_tweets = lastTweet.user.statuses_count;
    var max_number_of_tweets = 500;
    if (max_number_of_tweets > num_of_tweets) {
      max_number_of_tweets = num_of_tweets;
    }

    if (tweets.length < max_number_of_tweets && max_id != lastTweet.id_str) {
      max_id = lastTweet.id_str;
      getTweets(req, res, max_id, callback);
    }
    else {
      if (tweets.length > 500) {
        tweets.splice(500, (tweets.length - 500));
      }
      res.json(aggregator.aggregate(tweets));
    }
  };

  getTweets(req, res, max_id, callback);

};

function getTweets(req, res, max_id, callback) {
  console.log('Get Tweets of ' + req.param('twitterScreenName') + " max_id " + max_id);

  function buildOptions(req, max_id) {
    var path = '/1.1/statuses/user_timeline.json?' +
      '&count=200' +
      '&screen_name=' + req.param('twitterScreenName');

    if (max_id != "") {
      path = path + '&max_id=' + max_id;
    }

    var options = {
      host: 'api.twitter.com',
      method: 'GET',
      path: path,
      headers: {
        'Authorization': req.header('Authorization')
      }
    };

    return options;
  }

  var options = buildOptions(req, max_id);
  var reqGet = https.request(options, function (response) {
    var concatenatedData = "";

    response.on('data', function (d) {
      concatenatedData = concatenatedData.concat(d);
    });

    response.on('end', function () {
      var parsedData = JSON.parse(concatenatedData);

      if (parsedData.errors != undefined) {
        res.status(404);
        res.send(parsedData.errors[0].message);
      }
      else {
        if (max_id == "" && (concatenatedData == "[]" || concatenatedData == "")) {
          res.json(aggregator.aggregate([]));
        }
        else {
          if (max_id != "" && parsedData[0].id_str == max_id) {
            parsedData.splice(0, 1);
          }
          callback(parsedData);
        }
      }
    });
  });

  reqGet.on('error', function (e) {
    console.error(e);
    res.status(401);
  });

  reqGet.end();
};
