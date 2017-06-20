const Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context, callback);
  alexa.appId = process.env['APP_ID'];

  alexa.resources = require('./resources/languageStrings.json');
  alexa.registerHandlers(require('./handlers'));
  alexa.execute();

  return alexa;
};
