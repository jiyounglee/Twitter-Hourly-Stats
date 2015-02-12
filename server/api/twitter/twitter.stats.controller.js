'use strict';

var https = require('https');
var aggregator = require('./twitter.hourly.stats.aggregator.js')

exports.get = function (req, res) {

  console.info('Started retriieving timeline ' + req.header('Authorization'));
  var tweets = [];

  console.info('GetTwitts');

  var callback = function (data) {
    tweets = tweets.concat(data);
    var lastTweet = tweets[tweets.length - 1];
    var num_of_tweets = lastTweet.statuses_count;
    var max_number_of_tweets = 500;
    if (max_number_of_tweets > num_of_tweets) {
      max_number_of_tweets = num_of_tweets;
    }

    console.info("________ Callback " + tweets.length + ' ' + req.param('twitterScreenName'));

    if (tweets.length < max_number_of_tweets) {
      console.info('GetTwitts' + tweets[tweets.length - 1]);
      getTwitts(req, res, lastTweet.id_str, callback);
    }
    else {
      if (tweets.length > max_number_of_tweets) {
        console.info("length - 500 = " + tweets.length - 500)
        tweets.splice(500, (tweets.length - 500));
      }
      console.info('spliced tweets' + tweets.length);
      res.json(aggregator.aggregate(tweets));
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

    console.info(req.header('twitterScreenName'));
    var path = '/1.1/statuses/user_timeline.json?' +
      '&count=200' +
      '&screen_name=' + req.param('twitterScreenName');

    if (max_id != "") {
      path = path + '&max_id=' + max_id;
    }

    options.path = path;

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
      if (parsedData.errors) {
        res.status(401, parsedData.errors.message);
      }
      else {
        if (max_id != "" && parsedData[0].id_str == max_id) {
          parsedData.splice(0, 1);
        }
        callback(parsedData);
      }
    });
  });

  reqGet.on('error', function (e) {
    console.error(e);
    res.status(401);
  });

  reqGet.end();
};
