/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var https = require('https');

exports.get = function (req, res) {

  var consumerKey = encodeURIComponent(process.env.TWITTER_KEY);
  var consumerSecret = encodeURIComponent(process.env.TWITTER_SECRET);
  var credentials = new Buffer(consumerKey + ':' + consumerSecret).toString('base64');

  var options = {
    host: 'api.twitter.com',
    path: '/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'Authorization': 'Basic ' + credentials
    }
  };

  var reqPost = https.request(options, function (response) {

    response.on('data', function (d) {
      var tokenJSONObject = JSON.parse((new Buffer(d, 'base64')).toString());
      var accessToken = tokenJSONObject.access_token;
      var encodedAccessToken = new Buffer(accessToken).toString('base64');

      console.info('Retrieved Access token : ' + encodedAccessToken);

      res.json({access_token: encodedAccessToken});
    });
  });
  reqPost.write("grant_type=client_credentials");

  reqPost.on('error', function (e) {
    console.error(e);
    res.status(401);
  });

  reqPost.end();

};
