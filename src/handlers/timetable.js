import {getPredictionsforStage} from '../ura-api-aseag';

const find = require('lodash.find');
const moment = require('moment');

const stages = require('../resources/stages.json');
const PREDICTION_LIMIT = 5;

module.exports = function() {
  const stageSlot = this.event.request.intent.slots.Stage;
  const userLocale = this.event.request.locale;
  const translate = this.t.bind(this);
  const emit = this.emit.bind(this);

  if (stageSlot.value) {
    // Find Stage
    const stageName = stageSlot.value.trim().toLowerCase();
    const stage = find(stages, {name: stageName});

    if (stage) {
      // 1. Request Departures with the stage id
      getPredictionsforStage(stage.id, function(err, predictions) {
        // 2.a Only predictions with more than a minute in the future
        const nowInOneMinute = moment().add(1, 'minute');
        const filtered = predictions.filter(function(prediction) {
          return moment(prediction.estimatedTime).isAfter(nowInOneMinute);
        });

        // 2.b Limit the predictions accodring to the limit parameter
        const limited = filtered.slice(0, PREDICTION_LIMIT);

        let speechOutput = translate('STAGE_DEPARTURES_START', stage.name);

        limited.forEach(function(prediction) {
          speechOutput += translate('STAGE_DEPARTURE', prediction.lineName, prediction.destinationName, moment(prediction.estimatedTime).locale(userLocale).fromNow());
        });

        emit(':tell', speechOutput);
      });
    } else {
      let speechOutput = translate('STAGE_NOT_FOUND_MESSAGE');
      const repromptSpeech = translate('STAGE_NOT_FOUND_REPROMPT');

      if (stageName) {
        speechOutput += translate('STAGE_NOT_FOUND_WITH_STAGE_NAME', stageName);
      } else {
        speechOutput += translate('STAGE_NOT_FOUND_WITHOUT_STAGE_NAME');
      }

      speechOutput += repromptSpeech;

      emit(':ask', speechOutput, repromptSpeech);
    }
  } else {
    emit('AMAZON.HelpIntent');
  }

};
