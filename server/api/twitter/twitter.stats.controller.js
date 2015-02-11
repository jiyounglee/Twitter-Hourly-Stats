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

  console.info('Started retriieving timeline ' + req.header('Authorization'));
  var options = {
    host: 'api.twitter.com',
    path: '/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=2',
    method: 'GET',
    headers: {
      'Authorization': req.header('Authorization'),
    }
  };

  var reqGet = https.request(options, function (response) {

    response.on('data', function (d) {

      console.info('Retrieved timeline : ' + d);

      res.json({stats: {}});
    });
  });

  reqGet.on('error', function (e) {
    console.error(e);
    res.status(401);
  });

  reqGet.end();

};
