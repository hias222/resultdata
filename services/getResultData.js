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

module.exports.results = function getResultData(myEvent, event, agegroup) {

  console.log('<getResultData:results> Event: ' + event + ' Agegroup: ' + agegroup)

  if (event === '0' || event === undefined || event === '') {
    var competitionName = myEvent.getCompetitionName();
    noresults.eventDefinition.name = 'Choose Number'
    noresults.eventDefinition.competitionName = competitionName.competition
    noresults.eventDefinition.eventNumber = event
    return noresults
  } else {
    var eventData = myEvent.getResultData(event, agegroup);
    console.log('<getResultData:results> Event: ' + event + ' Agegroup: ' + agegroup)
    return eventData;
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
