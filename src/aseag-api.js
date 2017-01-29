var request = require('request');
var moment = require('moment');

var BASE_URL = "http://ifa.aseag.de/index.php?id=344&eID=mbient_ifa"

exports.getTimetableForStage = function(stageId, limit, locale, callback) {
    request.get(BASE_URL + '&res=timetable&stage=' + stageId, function(err, response, body) {
        if (err || response.statusCode != 200) {
            callback(err || new Error("Request finished with status " + response.status));
        } else {
            var departures = [];
            try {
                departures = JSON.parse(body);
            } catch (ignored) {}

            var limited = departures.slice(0, limit)

            var sanitized = limited.map(function(departure) {
                return {
                    'route': departure.route.name,
                    'destination': departure.destinationStage.name,
                    'toNow': moment.parseZone(departure.expectedTime).locale(locale).fromNow(),
                    'realtime': !!departure.realtime
                };
            });
            callback(null, sanitized);
        }
    });
}
