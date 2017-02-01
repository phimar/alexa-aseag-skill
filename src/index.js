const Alexa = require('alexa-sdk');

const languageStrings = require('./resources/languageStrings.json');

const handlers = require('./handlers');
exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = process.env['APP_ID'];

  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();

  return alexa;
};
