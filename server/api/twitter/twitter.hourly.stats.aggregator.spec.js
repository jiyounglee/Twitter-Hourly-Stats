'use strict';

var should = require('should');
var aggregator = require('./twitter.hourly.stats.aggregator.js')
var request = require('supertest');

describe('Aggregate list of twitter timeline', function() {

  it('should respond with JSON object with hourly stats when data is provided', function(done) {
    var twitterTimeline = [{"created_at":"Mon Feb 02 23:13:24 +0000 2015","id":562388344962052100,"id_str":"562388344962052096","text":"Potential adjustment to public Streaming API volumes https://t.co/kQhoIWGoyZ - always intended to be 1% of current Tweet levels.","source":"<a href=\"http://itunes.apple.com/us/app/twitter/id409789998?mt=12\" rel=\"nofollow\">Twitter for Mac</a>","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":6253282,"id_str":"6253282","name":"Twitter API","screen_name":"twitterapi","location":"San Francisco, CA","profile_location":null,"description":"The Real Twitter API. I tweet about API changes, service issues and happily answer questions about Twitter and our API. Don't get an answer? It's on my website.","url":"http://t.co/78pYTvWfJd","entities":{"url":{"urls":[{"url":"http://t.co/78pYTvWfJd","expanded_url":"http://dev.twitter.com","display_url":"dev.twitter.com","indices":[0,22]}]},"description":{"urls":[]}},"protected":false,"followers_count":2740044,"friends_count":48,"listed_count":12892,"created_at":"Wed May 23 06:01:13 +0000 2007","favourites_count":27,"utc_offset":-28800,"time_zone":"Pacific Time (US & Canada)","geo_enabled":true,"verified":true,"statuses_count":3533,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"C0DEED","profile_background_image_url":"http://pbs.twimg.com/profile_background_images/656927849/miyt9dpjz77sc0w3d4vj.png","profile_background_image_url_https":"https://pbs.twimg.com/profile_background_images/656927849/miyt9dpjz77sc0w3d4vj.png","profile_background_tile":true,"profile_image_url":"http://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png","profile_image_url_https":"https://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png","profile_banner_url":"https://pbs.twimg.com/profile_banners/6253282/1347394302","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"default_profile":false,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":54,"favorite_count":34,"entities":{"hashtags":[],"symbols":[],"user_mentions":[],"urls":[{"url":"https://t.co/kQhoIWGoyZ","expanded_url":"https://twittercommunity.com/t/potential-adjustments-to-streaming-api-sample-volumes/31628","display_url":"twittercommunity.com/t/potential-ad…","indices":[53,76]}]},"favorited":false,"retweeted":false,"possibly_sensitive":false,"lang":"en"},{"created_at":"Wed Jan 28 19:43:14 +0000 2015","id":560523514248450050,"id_str":"560523514248450049","text":"Thank you for your patience, media entities in the streaming API should be returning to normal.","source":"<a href=\"http://itunes.apple.com/us/app/twitter/id409789998?mt=12\" rel=\"nofollow\">Twitter for Mac</a>","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":6253282,"id_str":"6253282","name":"Twitter API","screen_name":"twitterapi","location":"San Francisco, CA","profile_location":null,"description":"The Real Twitter API. I tweet about API changes, service issues and happily answer questions about Twitter and our API. Don't get an answer? It's on my website.","url":"http://t.co/78pYTvWfJd","entities":{"url":{"urls":[{"url":"http://t.co/78pYTvWfJd","expanded_url":"http://dev.twitter.com","display_url":"dev.twitter.com","indices":[0,22]}]},"description":{"urls":[]}},"protected":false,"followers_count":2740044,"friends_count":48,"listed_count":12892,"created_at":"Wed May 23 06:01:13 +0000 2007","favourites_count":27,"utc_offset":-28800,"time_zone":"Pacific Time (US & Canada)","geo_enabled":true,"verified":true,"statuses_count":3533,"lang":"en","contributors_enabled":false,"is_translator":false,"is_translation_enabled":false,"profile_background_color":"C0DEED","profile_background_image_url":"http://pbs.twimg.com/profile_background_images/656927849/miyt9dpjz77sc0w3d4vj.png","profile_background_image_url_https":"https://pbs.twimg.com/profile_background_images/656927849/miyt9dpjz77sc0w3d4vj.png","profile_background_tile":true,"profile_image_url":"http://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png","profile_image_url_https":"https://pbs.twimg.com/profile_images/2284174872/7df3h38zabcvjylnyfe3_normal.png","profile_banner_url":"https://pbs.twimg.com/profile_banners/6253282/1347394302","profile_link_color":"0084B4","profile_sidebar_border_color":"C0DEED","profile_sidebar_fill_color":"DDEEF6","profile_text_color":"333333","profile_use_background_image":true,"default_profile":false,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":null,"contributors":null,"retweet_count":43,"favorite_count":39,"entities":{"hashtags":[],"symbols":[],"user_mentions":[],"urls":[]},"favorited":false,"retweeted":false,"lang":"en"}];
    var result = aggregator.aggregate(twitterTimeline);
    console.log(result);
    for (var i = 0; i < 24; i++) {
      if (i == 19 || i == 23) {
        result[i].should.equal(1);
      }
      else {
        result[i].should.equal(0);
      }
    }
    result['19'].should.equal(1);
    result['23'].should.equal(1);
    done();
  });

  it('should respond with JSON object with hourly stats when data is empty', function (done) {
    var twitterTimeline = [];
    var result = aggregator.aggregate(twitterTimeline);
    console.log(result);
    for (var i = 0; i < 24; i++) {
      result[i].should.equal(0);
    }
    done();
  });
});
