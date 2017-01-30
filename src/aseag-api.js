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

            // Filter Departures less than a minute in the future
            var nowInOneMinute = moment().add(1, 'minute');

            var filtered = departures.filter(function(departure) {
                return moment.parseZone(departure.expectedTime).isAfter(nowInOneMinute);
            });

            // Limit the response accodring to the limit parameter
            var limited = filtered.slice(0, limit)

            // Format the response to required values and a readable toNow value
            var formatted = limited.map(function(departure) {
                return {
                    'route': departure.route.name,
                    'destination': departure.destinationStage.name,
                    'toNow': moment.parseZone(departure.expectedTime).locale(locale).fromNow(),
                    'realtime': !!departure.realtime
                };
            });
            callback(null, formatted);
        }
    });
}
