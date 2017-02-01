/* eslint-env node, mocha */

var chai = require('chai');
chai.use(require('chai-string'));
chai.use(require('chai-spies'));
var expect = chai.expect;

var alexaAseagSkill = require('../index');

describe('alexa-aseag-skill', function() {
  const locales = ['en-GB', 'de-DE'];
  locales.forEach(function(locale) {
    describe('#TimetableIntent - ' + locale, function() {
      it('should work for Kuckelkorn', function(done) {
        this.timeout(5000);
        fakeIntentRequest({
          locale,
          intent: {
            name: 'TimetableIntent',
            slots: {
              Stage: {
                value: 'Kuckelkorn'
              }
            }
          }
        }, function(err, response) {
          if (err) {
            done(err);
          } else {
            // console.log(response);
            done();
          }
        });
      });
      it('should work for kuckelkorn', function(done) {
        this.timeout(5000);
        fakeIntentRequest({
          locale,
          intent: {
            name: 'TimetableIntent',
            slots: {
              Stage: {
                value: 'Kuckelkorn'
              }
            }
          }
        }, function(err, response) {
          if (err) {
            done(err);
          } else {
            // console.log(response);
            done();
          }
        });
      });
    });
  });

  describe('#TimetableIntent - empty Stage slot', function() {
    it('should emit HelpIntent if Stage slot has no value', function(done) {
      let skill = fakeIntentRequest({
        intent: {
          name: 'TimetableIntent',
          slots: {
            Stage: {
              name: 'Stage'
            }
          }
        }
      }, function(err, response) {
        if(err) {
          done(err);
        } else {
          done();
        }
      });

      let spyEmit = chai.spy(skill.emit);

      expect(spyEmit).to.be.called.with('AMAZON.HelpIntent');
    });
  });

  describe('Built in intents', function() {
    it('should emit :tell on LaunchRequest', function(done) {
      let skill = fakeIntentRequest({
        intent: {
          name: 'AMAZON.CancelIntent',
        }
      }, function(err, response) {
        if(err) {
          done(err);
        } else {
          done();
        }
      });

      let spyEmit = chai.spy(skill.emit);

      expect(spyEmit).to.be.called.with(':tell');
    });

    it('should emit StopIntent on AMAZON.CancelIntent', function(done) {
      let skill = fakeIntentRequest({
        intent: {
          name: 'AMAZON.CancelIntent',
        }
      }, function(err, response) {
        if(err) {
          done(err);
        } else {
          done();
        }
      });

      let spyEmit = chai.spy(skill.emit);

      expect(spyEmit).to.be.called.with('StopIntent');
    });

    it('should emit StopIntent on AMAZON.StopIntent', function(done) {
      let skill = fakeIntentRequest({
        intent: {
          name: 'AMAZON.StopIntent',
        }
      }, function(err, response) {
        if(err) {
          done(err);
        } else {
          done();
        }
      });

      let spyEmit = chai.spy(skill.emit);

      expect(spyEmit).to.be.called.with('StopIntent');
    });

    it('should emit :ask on AMAZON.HelpIntent', function(done) {
      let skill = fakeIntentRequest({
        intent: {
          name: 'AMAZON.HelpIntent',
        }
      }, function(err, response) {
        if(err) {
          done(err);
        } else {
          done();
        }
      });

      let spyEmit = chai.spy(skill.emit);

      expect(spyEmit).to.be.called.with(':ask');
    });
  });
});

function fakeIntentRequest(options, callback) {
  var intent = options.intent || {};
  var locale = options.locale || 'en-GB';
  return alexaAseagSkill.handler({
    request: {
      locale: locale,
      type: options.intent
        ? 'IntentRequest'
        : LaunchRequest,
      intent: intent
    },
    session: {
      application: {
        applicationId: process.env['APP_ID']
      },
      user: {
        userId: 'testUser'
      }
    }
  }, {
    fail: callback,
    succeed: function(response) {
      callback(null, response);
    }
  });
}
