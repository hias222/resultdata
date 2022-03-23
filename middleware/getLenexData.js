const {results,ageGroups} = require("../services/getResultData");
var swimEvent = require('../data/swim_event')

var unzip = require('../utils/unzip')

const PropertyReader = require('properties-reader')

var propertyfile = __dirname + "/../resources/" + process.env.PROPERTY_FILE;
var properties = PropertyReader(propertyfile)
// var event_type = properties.get("main.event_type")
var lenex_results = properties.get("main.lenex_results")

var myEvent = new swimEvent("resources/" + lenex_results);

console.log("Competition Name")
console.log(myEvent.getCompetitionName());

module.exports = function getLenexData(request, response, next) {

  var lenexMode = request.query.mode !== undefined ? request.query.mode : 'query'
  console.log('mode ' + lenexMode)

  if (lenexMode === 'update') {

    if (request.query.lenexfile !== undefined) {
      var lenexfile =  request.query.lenexfile;
      console.log('<mid:getLenexData:update> ' + lenexfile);

      unzip.unzip(lenexfile)
        .then((fileName) => {
          console.log('<mid:getLenexData:update> extracted to ' + fileName);
          return myEvent.updateFile(fileName)
        })
        .then(() => {
          console.log('<mid:getLenexData:update> updated lenex');
        })
        .catch((error) => {
          console.log('<mid:getLenexData:update> error ' + lenexfile);
          console.log(error)
        });
    }
  }

  if (lenexMode === 'agegroups') {
    var event = request.query.event !== undefined ? request.query.event : 0
    console.log('<mid:getLenexData:agegroups> event ' + event );
    var stringJson = ageGroups(myEvent,event)
    response.body = stringJson
  }

  if (lenexMode === 'query') {

    var event = request.query.event !== undefined ? request.query.event : 0
    var agegroup = request.query.agegroup !== undefined ? request.query.agegroup : 0

    console.log('<mid:getLenexData:query> event ' + event + ' agegroup ' + agegroup);

    var stringJson = results(myEvent,event)
    response.body = stringJson
    
  }

  next();
}