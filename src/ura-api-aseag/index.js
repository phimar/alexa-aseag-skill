const http = require('http');
const qs = require('querystring');
const readline = require('readline');

import Stage from './model/stage';
import Prediction from './model/prediction';

const BASE_URL = 'http://ivu.aseag.de/interfaces/ura/instant_V1?';

const STAGES_QUERY_PARAMS = {
  'ReturnList': 'StopPointName,StopID,Latitude,Longitude'
};

const PREDICTION_QUERY_PARAMS = {
  'ReturnList': 'StopPointIndicator,LineName,EstimatedTime,DestinationName'
};

// http://ivu.aseag.de/interfaces/ura/instant_V1?ReturnList=StopPointName,StopID,Latitude,Longitude
exports.getStages = function(callback) {
  queryAndParse(BASE_URL + qs.stringify(STAGES_QUERY_PARAMS), Stage, callback);
};

// http://ivu.aseag.de/interfaces/ura/instant_V1?StopAlso=false&ReturnList=StopPointIndicator,linename,estimatedtime,DestinationName&StopId=<id>
exports.getPredictionsforStage = function(stageId, callback) {
  queryAndParse(BASE_URL + qs.stringify(Object.assign({'StopId': stageId}, PREDICTION_QUERY_PARAMS)), Prediction, function(err, predictions) {
    if(err) {
      callback(err);
    } else {
      // Sort predictions by estimatedTime;
      predictions.sort(function(a,b) {
        return a.estimatedTime.getTime() - b.estimatedTime.getTime();
      });

      callback(null, predictions);
    }
  });
};

function queryAndParse(url, model, callback) {
  http.get(url, (res) => {
    const statusCode = res.statusCode;

    if (statusCode !== 200) {
      callback(new Error(`Request failed. Status Code: ${statusCode}`));
      res.resume();
      return;
    }

    res.setEncoding('utf8');

    let result = [];
    readline.createInterface({input: res}).on('line', (line) => {
      let parsed;
      try {
        parsed = JSON.parse(line);
      } catch (e) {
        console.error(e);
      }
      if (parsed) {
        const instance = model.fromJSONArray(parsed);
        if (instance) {
          result.push(instance);
        }
      }
    }).on('close', () => {
      callback(null, result);
    });
  }).on('error', callback);
}
