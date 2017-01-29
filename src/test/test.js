var chai = require('chai');
chai.use(require('chai-string'));
var expect = chai.expect;

var aseag = require('../aseag-api');

describe('aseag-api', function() {
    describe('#getTimetableForStage()', function() {
        it('should not return an error for a valid stageId', function(done) {
            // Stage 253 is Kuckelkorn
            aseag.getTimetableForStage(253, 5, "en_GB", done);
        });
        it('should return an array with expected length and format for a valid stageId', function(done) {
            var LIMIT = 5;
            // Stage 253 is Kuckelkorn
            aseag.getTimetableForStage(253, LIMIT, "en_GB", function(err, departures) {
                if (err) {
                    done(err);
                } else {
                    expect(departures).to.be.instanceof(Array);
                    expect(departures).to.have.length.within(0, LIMIT);
                    departures.forEach(function(departure) {
                        expect(departure).to.have.property('route');
                        expect(departure).to.have.property('destination');
                        expect(departure).to.have.property('toNow');
                        expect(departure.toNow).to.startsWith('in');
                        expect(departure.toNow).to.contain('minute');
                    });
                    done();
                }
            });
        });
    });
});
