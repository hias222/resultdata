const getResultData = require("../services/getResultData");
var swimEvent = require('../data/swim_event')

var unzip = require('../utils/unzip')

var event = 2;
var heat = 1;

var myEvent = new swimEvent("resources/bayerische_2016_meldungen.lef");
//var myEvent = new swimEvent("resources/170114-Schwandorf-ME.lef");
//var myEvent = new swimEvent("resources/bayerische_2016_meldungen.lef");

console.log("Competition Name")
console.log(myEvent.getCompetitionName());

module.exports = function getLenexData(request, response, next) {

  var lenexMode = request.query.mode !== undefined ? request.query.mode : 'query'

  if (lenexMode === 'update') {
    console.log('<mid:getLenexData:update> Message to do');

    var lenexfile = __dirname + '/../' + process.env.LENEX_LXF_FILE_NAME;

    
    unzip.unzip(lenexfile)
      .then((res) =>  {
        console.log(res);
        console.log('success');
      })
      .catch((error) => {
        console.log(error)
      });

      
    //console.log(unzipinfo)

    //let leffilepathname = __dirname + '/../' + process.env.LENEX_LEF_FILE_NAME;
    //myEvent.updateFile(leffilepathname);

  }

  if (lenexMode === 'query') {

    var event = request.query.event !== undefined ? request.query.event : 0
    var agegroup = request.query.agegroup !== undefined ? request.query.agegroup : 0

    var stringJson = getResultData(event, agegroup)
    response.body = stringJson

    console.log('<mid:getLenexData:query> Message to do');
  }

  next();
}