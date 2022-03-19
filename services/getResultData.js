module.exports = function getResultData(event, agegroup) {
    let noresults = {
        eventDefinition:
          { eventNumber: '123' , name: 'RestData' },
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

    var stringJson = noresults
    // var stringJson = JSON.parse(" [ { \"event\": \"99\" } ]")

    return stringJson;

}