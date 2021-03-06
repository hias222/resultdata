const { results, ageGroups, downloadList, combined, combineddefinition, eventdefinition } = require("../services/getResultData");
const { convertToResult } = require('../data/combined')

var swimEvent = require('../data/swim_event')
var mqtt_handler = require('../mqtt/mqtt_handler');

var unzip = require('../utils/unzip')

const PropertyReader = require('properties-reader');
const { clearPlaceAbove } = require("../data/reduceResults");

var propertyfile = __dirname + "/../resources/" + process.env.PROPERTY_FILE;
var properties = PropertyReader(propertyfile)

var lenex_results = properties.get("main.lenex_results")
var myEvent = new swimEvent("resources/" + lenex_results);

var mqttInternalClient = new mqtt_handler();

console.log("Competition Name")
console.log(myEvent.getCompetitionName());

module.exports = function getLenexData(request, response, next) {

  var lenexMode = request.query.mode !== undefined ? request.query.mode : 'query'
  var place = request.query.place !== undefined ? request.query.place : 0
  var event = request.query.event !== undefined ? request.query.event : 0
  var combinedid = request.query.combinedid !== undefined ? request.query.combinedid : 1
  var agegroup = request.query.agegroup !== undefined ? request.query.agegroup : 0
  console.log('<getLenexData.js> mode ' + lenexMode)

  if (lenexMode === 'update') {

    if (request.query.lenexfile !== undefined) {
      var lenexfile = request.query.lenexfile;
      console.log('<mid:getLenexData:update> ' + lenexfile);

      unzip.unzip(lenexfile)
        .then((fileName) => {
          console.log('<mid:getLenexData:update> extracted to ' + fileName);
          return myEvent.updateFile(fileName)
        })
        .then(() => {
          console.log('<mid:getLenexData:update> updated lenex');
          process.exit(0)
        })
        .catch((error) => {
          console.log('<mid:getLenexData:update> error ' + lenexfile);
          console.log(error)
        });
    }
  }

  if (lenexMode === 'agegroups') {
    console.log('<mid:getLenexData:agegroups> event ' + event);
    var stringJson = ageGroups(myEvent, event)
    response.body = stringJson
  }

  if (lenexMode === 'downloadlist') {
    console.log('<mid:getLenexData:downloadlist> event ');
    var stringJson = downloadList(myEvent)
    response.body = stringJson
  }

  if (lenexMode === 'combined') {
    console.log('<mid:getLenexData:combined> id ' + combinedid + ' place ' + place);
    var stringJson = combined(myEvent, combinedid)
    console.log(stringJson)
    var newJson = clearPlaceAbove(stringJson, place)
    console.log(newJson)
    response.body = newJson
  }

  if (lenexMode === 'combineddefinition') {
    console.log('<mid:getLenexData:combineddefinition> event ');
    var stringJson = combineddefinition(myEvent)
    response.body = stringJson
  }

  if (lenexMode === 'query') {
    console.log('<mid:getLenexData:query> event ' + event + ' agegroup ' + agegroup);
    var stringJson = results(myEvent, event, agegroup)
    response.body = stringJson
  }

  if (lenexMode === 'eventdefinition') {
    console.log('<mid:getLenexData:eventdefinition> event ');
    var stringJson = eventdefinition(myEvent)
    response.body = stringJson
  }

  if (lenexMode === 'show') {
    console.log('<mid:getLenexData:show> event ' + event + ' agegroup ' + agegroup);
    var typeAttribute = { 'type': 'result' }
    var stringJson = results(myEvent, event, agegroup, place)
    var reesultMessage = { ...typeAttribute, ...stringJson }
    mqttInternalClient.getStatus()
      .then(() => {
        console.log('<mid:getenexData:show> MQTT connected')
        return mqttInternalClient.sendRawMessage(JSON.stringify(reesultMessage))
      })
      .then(() => console.log('<mid:getenexData:show> send'))
      .catch(() => console.log('<mid:getenexData:show> error connect mqtt'));
    //console.log(mqttInternalClient.getStatus())
    response.body = reesultMessage
  }

  if (lenexMode === 'showcombined') {
    console.log('<mid:getLenexData:combined> id ' + combinedid);
    var competion = myEvent.getCompetitionName()
    var stringJson = combined(myEvent, combinedid)
    var newJson = clearPlaceAbove(stringJson, place)
    var stringJson = convertToResult(newJson, competion.competition)
    var typeAttribute = { 'type': 'result' }
    var reesultMessage = { ...typeAttribute, ...stringJson }
    mqttInternalClient.getStatus()
      .then(() => {
        console.log('<mid:getenexData:show> MQTT connected')
        return mqttInternalClient.sendRawMessage(JSON.stringify(reesultMessage))
      })
      .then(() => console.log('<mid:getenexData:show> send'))
      .catch(() => console.log('<mid:getenexData:show> error connect mqtt'));
    //console.log(mqttInternalClient.getStatus())
    response.body = reesultMessage
  }

  next();
}