// Node requires
var twitter = require('twitter');
var json = require('json-stringify-safe');
var tessel = require('tessel');
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['A']);
var ambientlib = require('ambient-attx4');

var ambient = ambientlib.use(tessel.port['A']);

// The status to tweet
var status = 'HELLO WORLD';

// These OAuth credentials are for the dummy @TesselTweet account
// Paste in your own OAuth details if you want to tweet from your own account
var twit = new twitter({
  consumer_key: 'RqvExcDPdJWWNFX2CfFEmu8xI',
  consumer_secret: 'c2ebYulZucjehGoCKpA3PFodgORh4WsOqgbohwCugmspAU9VkJ',
  access_token_key: '800794297008201728-I5ZsEul7ZAMk72NyfRpzNK0MugGng9p',
  access_token_secret: 'niInnM2h8wGVq5VU5oBFRHinuVoHrM1zTUtSgnm8n1BbZ'
});


climate.on('ready', function() {

  setInterval(function() {

    climate.readHumidity(function (err, humid) {
      climate.readTemperature('f', function (err, temp) {
        let status = null;
        if (temp.toFixed(4) > 80) {
          status = temp.toFixed(2) + 'degrees?! It\'s too hot in here!! >:(  ';
        } else if (temp.toFixed(4) < 70) {
          status = temp.toFixed(2) + 'degrees! Come and hug me! I\'m cold. ';
        }
        if (humid < 30) {
          status += ' And I need water!!';
        } else if (humid > 40) {
          status += ' Thanks for the drink tho!!! I feel better';
        }
        console.log('Degrees:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
        if (status) {
          twit.post('statuses/update', {status: status}, function(error, tweet, response){
          if (error) {
            console.log('error sending tweet:', error);
          } else {
            console.log('Successfully tweeted! Tweet text:', tweet.text);
          }
        });
        }
      });
    });
  }, 5000);
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});

// // Make a tweet!
// twit.post('statuses/update', {status: status}, function(error, tweet, response){
//   if (error) {
//     console.log('error sending tweet:', error);
//   } else {
//     console.log('Successfully tweeted! Tweet text:', tweet.text);
//   }
// });
