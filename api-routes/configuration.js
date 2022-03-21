const PropertyReader = require('properties-reader')

var propertyfile = __dirname + "/../resources/" + process.env.PROPERTY_FILE;

module.exports = function configuration(req, res) {
    //console.log(req);
    var properties = PropertyReader(propertyfile)
    var event_type = properties.get("main.event_type")
    var lenex_results = properties.get("main.lenex_results")

    var stringJson = "{ \"event_type\": \"" + event_type + "\", \"lenex_results\": \"" + lenex_results + "\"}"

    res.send(JSON.parse(stringJson));
}