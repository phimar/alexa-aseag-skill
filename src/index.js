'use strict';

var Alexa = require('alexa-sdk');

var languageStrings = require('resources/languageStrings.json');

var handlers = require('./handlers');

// TODO Add AppId here
var APP_ID = undefined

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;

  alexa.resources = languageStrings;
  alexa.registerHandlers(handlers);
  alexa.execute();
}
