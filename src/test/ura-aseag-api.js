/* eslint-env node, mocha */

const chai = require('chai');
chai.use(require('chai-string'));
const expect = chai.expect;;
const api = require('../ura-api-aseag');

describe('ura-aseag-api', function() {
  describe('#getStages()', function() {
    it('should return a list of stages with valid stages and no duplicates', function(done) {
      api.getStages((err, stages) => {
        if (err) {
          done(err);
        } else {
          expect(stages).to.be.instanceof(Array);
          let seenIds = [];
          let seenNames = [];
          stages.forEach(function(stage) {
              expect(stage).to.have.property('id');
              expect(stage.id).not.to.be.empty;
              expect(seenIds).not.to.include(stage.id);
              seenIds.push(stage.id);
              expect(stage).to.have.property('name');
              expect(stage.name).not.to.be.empty;
              expect(seenNames).not.to.include(stage.name);
              seenNames.push(seenNames);
              expect(stage).to.have.property('pos');
          });
          done();
        }
      });
    }).timeout(5000);
  });

  describe('#getPredictionsforStage()', function() {
    it('should return a list of predictions with valid predictions ordered by estimatedTime', function(done) {
      api.getPredictionsforStage('100602',(err, predictions) => {
        if (err) {
          done(err);
        } else {
          expect(predictions).to.be.instanceof(Array);
          let prev;
          predictions.forEach(function(prediction) {
              expect(prediction).to.have.property('stopPointIndicator');
              expect(prediction).to.have.property('lineName');
              expect(prediction.lineName).not.to.be.empty;
              expect(prediction).to.have.property('estimatedTime');
              expect(prediction.estimatedTime).to.be.instanceof(Date);
              expect(prediction).to.have.property('destinationName');
              expect(prediction.lineName).not.to.be.empty;
              if(prev) {
                expect(prediction.estimatedTime.getTime()).to.be.above(prev);
              } else {
                prev = prediction.estimatedTime.getTime();
              }
          });
          done();
        }
      });
    }).timeout(5000);
  });
});
