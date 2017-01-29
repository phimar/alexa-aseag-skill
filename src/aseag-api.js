var request = require('request');
var moment = require('moment');


var BASE_URL = "http://ifa.aseag.de/index.php?id=344&eID=mbient_ifa"

exports.getTimetableForStage = function(stageId, limit, locale, callback) {
    request.get(BASE_URL + '&res=timetable&stage=' + stageId, function(err, response, body) {
        if (err || response.status != 200) {
            callback("Request failed.");
        } else {
            var departures = [];
            try {
                departures = JSON.parse(body);
            } catch (ignored) {}

            var limited = departures.slice(0, limit - 1);

            moment.locale(locale);

            var sanitized = limited.map(function(departure) {
              return {
                'route': departure.route.name,
                'destination': departure.departureStage.name,
                'fromNow': moment(departure.expectedTime).toNow()
              };
            });
            callback(null, sanitized);
        }
    });
}
