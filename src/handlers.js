var find = require('lodash.find');

var api = require('./aseag-api.js');

var stages = require('./resources/stages.json');

module.exports = {
    'LaunchRequest': function() {
        this.emit(':tell', this.t('SKILL_NAME'));
    },
    'TimetableIntent': function() {
        var stageName = this.event.request.intent.slots.Stage;

        var stage = find(stages, function(s) {
            return s.town.name === 'Aachen' && s.name === stageName.value;
        });

        if (stage) {
            // 1. Request Departures with the stage id
            api.getTimetableForStage(stage.id, 5, this.event.request.locale, function(err, departures) {
                var speechOutput = this.t('STAGE_DEPARTURES_START', stage.name);

                departures.forEach(function(departure) {
                    speechOutput += this.t('STAGE_DEPARTURE', departure.route, departure.destination, departure.toNow);
                }.bind(this));

                this.emit(':tell', speechOutput);
            }.bind(this));
        } else {
            var speechOutput = this.t('STAGE_NOT_FOUND_MESSAGE');
            var repromptSpeech = this.t('STAGE_NOT_FOUND_REPROMPT');

            if (stageName) {
                speechOutput += this.t('STAGE_NOT_FOUND_WITH_STAGE_NAME', stageName);
            } else {
                speechOutput += this.t('STAGE_NOT_FOUND_WITHOUT_STAGE_NAME');
            }

            speechOutput += repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }

    },
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
