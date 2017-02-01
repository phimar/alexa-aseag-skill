module.exports = {
  // Built in intents:
  'LaunchRequest': function() {
    this.emit(':tell', this.t('SKILL_NAME'));
  },
  'AMAZON.HelpIntent': function() {
    this.emit(':ask', this.t('HELP_MESSAGE'), this.t('HELP_REPROMPT'));
  },
  'AMAZON.CancelIntent': function() {
    this.emit('StopIntent');
  },
  'AMAZON.StopIntent': function() {
    this.emit('StopIntent');
  },
  // Custom Intents
  'TimetableIntent': require('./timetable'),
  'StopIntent': function() {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  }
};
