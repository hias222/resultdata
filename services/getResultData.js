const { clearPlaceStandard } = require("../data/reduceResults");

let noresults = {
  eventDefinition:
    { eventNumber: '', name: '' },
  swimmerResults: [
    {
      clubId: '',
      clubName: '',
      swimmerName: 'Unknown',
      endTime: '',
      place: '1'
    },
    {
      clubId: '',
      clubName: '',
      swimmerName: 'Unknown',
      endTime: '',
      place: '2'
    }
  ]
}

module.exports.results = function getResultData(myEvent, event, agegroup, place) {

  console.log('<getResultData:results> Event: ' + event + ' Agegroup: ' + agegroup + ' Place: ' + place)

  if (event === '0' || event === undefined || event === '') {
    var competitionName = myEvent.getCompetitionName();
    noresults.eventDefinition.name = 'Choose Number'
    noresults.eventDefinition.competitionName = competitionName.competition
    noresults.eventDefinition.eventNumber = event
    return noresults
  } else {
    var eventData = myEvent.getResultData(event, agegroup);

    if (parseInt(place) === 0 || place === undefined || place === '') {
      var newJson = eventData
    } else {
      var swimmerdata = clearPlaceStandard(eventData, place)

      var swimmerResults = { swimmerResults: swimmerdata }
      var eventDefinition = { eventDefinition: eventData.eventDefinition }
      var newJson = { ...eventDefinition, ...swimmerResults }
    }


    console.log('<getResultData:results> Event: ' + event + ' Agegroup: ' + agegroup)


    return newJson;
  }

}

module.exports.ageGroups = function getAgeGroups(myEvent, event) {

  const ageGroupsValues = [
    {
      value: '0',
      label: '0-0',
    }
  ];

  if (event === '0' || event === undefined || event === '') {
    return ageGroupsValues
  } else {
    var eventData = myEvent.getAgeGroupIDs(event);
    eventData.unshift({
      "value": "0",
      "label": "choose"
    });

    return eventData;
  }
}

module.exports.downloadList = function getDownloadlist(myEvent) {
  var eventData = myEvent.getDownloadList();
  return eventData;
}

module.exports.combined = function getCombineddata(myEvent, combinedid) {
  var eventData = myEvent.getCombinedData(combinedid);
  return eventData;
}

module.exports.combineddefinition = function getCombineddefinition(myEvent) {
  var eventData = myEvent.getCombineddefinition();
  return eventData;
}

module.exports.eventdefinition = function getEventdefinition(myEvent) {
  var eventData = myEvent.getEventdefinition();
  return eventData;
}



/*
{
    "type": "result",
    "eventDefinition": {
        "name": "400m Freistil weiblich",
        "eventNumber": "1",
        "competition": "Nürnberger Maimeeting mit Bayerischem Schwimm-Mehrkampf"
    },
    "swimmerResults": [
        {
            "order": "1",
            "place": "1",
            "resultid": "3209",
            "firstname": "Anna-Lena",
            "lastname": "Karasek",
            "birthdate": "2012",
            "nation": "GER",
            "athleteid": "3208",
            "points": "222",
            "swimtime": "06:30.00",
            "status": null,
            "name": "SG Mittelfranken",
            "code": "6768"
        },
        {
            "order": "2",
            "place": "2",
            "resultid": "2180",
            "firstname": "Natalie",
            "lastname": "Fenßlein",
            "birthdate": "2012",
            "nation": "GER",
            "athleteid": "2179",
            "points": "191",
            "swimtime": "06:50.00",
            "status": null,
            "name": "SSG Coburg",
            "code": "6695"
        },
        {
            "order": "3",
            "place": "2",
            "resultid": "2194",
            "firstname": "Mia",
            "lastname": "Heider",
            "birthdate": "2012",
            "nation": "GER",
            "athleteid": "2193",
            "points": "191",
            "swimtime": "06:50.00",
            "status": null,
            "name": "SSG Coburg",
            "code": "6695"
        }
    ]
}
*/