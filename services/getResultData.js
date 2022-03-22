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

module.exports = function getResultData(myEvent, event, agegroup) {

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