'use strict';

var https = require('https');
var aggregator = require('./twitter.hourly.stats.aggregator.js')

exports.get = function (req, res) {

  var tweets = [];
  var max_id = "";
  console.info('Number of Tweets ' + tweets.length);

  var callback = function (data) {
    tweets = tweets.concat(data);
    console.info('Number of Tweets ' + tweets.length);

    var lastTweet = tweets[tweets.length - 1];
    var num_of_tweets = lastTweet.user.statuses_count;
    var max_number_of_tweets = 500;

    console.info('num_of_tweets ' + num_of_tweets);
    if (max_number_of_tweets > num_of_tweets) {
      max_number_of_tweets = num_of_tweets;
    }

    console.info(max_number_of_tweets + "________ Callback " + tweets.length);

    if (tweets.length < max_number_of_tweets && max_id != lastTweet.id_str) {
      console.info('GetTwitts' + tweets[tweets.length - 1]);
      max_id = lastTweet.id_str;
      getTweets(req, res, max_id, callback);
    }
    else {
      if (tweets.length > 500) {
        console.info("length - 500 = " + tweets.length - 500);
        tweets.splice(500, (tweets.length - 500));
      }
      console.info('spliced tweets' + tweets.length);
      res.json(aggregator.aggregate(tweets));
    }
  };

  getTweets(req, res, max_id, callback);

};

function getTweets(req, res, max_id, callback) {

  console.info('Get Tweets with max_id ' + max_id);

  function buildOptions(req, max_id) {
    var options = {
      host: 'api.twitter.com',
      method: 'GET',
      headers: {
        'Authorization': req.header('Authorization')
      }
    };

    console.info("max_id" + max_id);
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
      console.info('on Data : ');
      concatenatedData = concatenatedData.concat(d);
    });

    response.on('end', function () {
      var parsedData = JSON.parse(concatenatedData);
      console.info('On End : number of received data' + concatenatedData);
      console.info(JSON.stringify(parsedData.errors));
      console.info(parsedData.errors)
      if (parsedData.errors != undefined) {
        console.info('ERROR');
        res.status(404);
        res.send(parsedData.errors[0].message);
      }
      else {
        console.info('First Item id ' + concatenatedData);
        if (max_id != "" && parsedData[0].id_str == max_id) {
          parsedData.splice(0, 1);
        }
        if (max_id == "" && concatenatedData == "") {
          res.json(aggregator.aggregate([]));
        }

        console.info('On End called back data: ');// + JSON.stringify(parsedData));
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
