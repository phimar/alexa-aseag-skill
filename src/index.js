'use strict';

var Alexa = require('alexa-sdk');

var languageStrings = require('resources/languageStrings.json');

var handlers = require('./handlers');

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.appId = process.env['APP_ID'];

  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
}
