module.exports = {
  'LaunchRequest': function() {
    this.emit(':tell', this.t('SKILL_NAME'));
  },
  'TimetableIntent': require('./timetable'),
  'AMAZON.HelpIntent': function() {
    var speechOutput = this.t('HELP_MESSAGE');
    var reprompt = this.t('HELP_REPROMPT');
    this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function() {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'AMAZON.StopIntent': function() {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  }
};
