/* eslint-env node, mocha */

var chai = require('chai');
chai.use(require('chai-string'));
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
});

function fakeIntentRequest(options, callback) {
  var intent = options.intent || {};
  var locale = options.locale || 'en-GB';
  alexaAseagSkill.handler({
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
