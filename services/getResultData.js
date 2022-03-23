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

  if (event === '0' || event === undefined || event === '') {
    var competitionName = myEvent.getCompetitionName();
    noresults.eventDefinition.name = 'Choose Number'
    noresults.eventDefinition.competitionName = competitionName.competition
    noresults.eventDefinition.eventNumber = event
    return noresults
  } else {
    var eventData = myEvent.getEventData(event, agegroup);
    console.log(eventData)
    results = { ...noresults, eventDefinition: { ...eventData } }
    return results;
  }

}

module.exports.ageGroups = function getAgeGroups(myEvent, event) {

  const ageGroupsValues = [
    {
        value: '1',
        label: '0-0',
    }
];

  if (event === '0' || event === undefined || event === '') {    
    return ageGroupsValues
  } else {
    var eventData = myEvent.getAgeGroupIDs(event);
    return eventData;
  }

}
