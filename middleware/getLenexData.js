const { results, ageGroups, downloadList, combined, combineddefinition } = require("../services/getResultData");
const { convertToResult } = require('../data/combined')

var swimEvent = require('../data/swim_event')
var mqtt_handler = require('../mqtt/mqtt_handler');

var unzip = require('../utils/unzip')

const PropertyReader = require('properties-reader')

var propertyfile = __dirname + "/../resources/" + process.env.PROPERTY_FILE;
var properties = PropertyReader(propertyfile)

var lenex_results = properties.get("main.lenex_results")
var myEvent = new swimEvent("resources/" + lenex_results);

var mqttInternalClient = new mqtt_handler();

console.log("Competition Name")
console.log(myEvent.getCompetitionName());

module.exports = function getLenexData(request, response, next) {

  var lenexMode = request.query.mode !== undefined ? request.query.mode : 'query'
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
    console.log('<mid:getLenexData:combined> id ' + combinedid);
    var stringJson = combined(myEvent, combinedid)
    response.body = stringJson
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

  if (lenexMode === 'show') {
    console.log('<mid:getLenexData:show> event ' + event + ' agegroup ' + agegroup);
    var typeAttribute = { 'type': 'result' }
    var stringJson = results(myEvent, event, agegroup)
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
    var stringJson = convertToResult(combined(myEvent, combinedid))
    //Todo
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