const jmespath = require('jmespath');

function addResultsToSwimerList(swimmerList, swimmerResults, event, combined_name) {

    swimmerResults.map(result => {
        var factor = event.factor !== undefined ? event.factor : 1
        var correctpoints = +factor * +result.points
        var swimmerdata = {
            'athleteid': result.athleteid,
            'firstname': result.firstname,
            'lastname': result.lastname,
            'birthdate': result.birthdate,
            'clubname': result.name,
            'combined_name': combined_name,
            'combinedpoints': correctpoints, 'data': [{ 'event': event.number, 'points': correctpoints, 'place': result.place, 'swimtime': result.swimtime }]
        }

        var item = swimmerList.find(x => x.athleteid == result.athleteid);
        if (item) {
            var points = +result.points + +item.combinedpoints
            item.combinedpoints = points.toString();
            var newdata = [...swimmerdata.data, ...item.data]
            item.data = newdata;
        } else {
            swimmerList.push(swimmerdata)
        }
    })
    return swimmerList;
}

function addPlaceToCombinedList(swimmerList) {
    var searchstring = "reverse(sort_by([*],&combinedpoints.to_number(@)))"
    var orderpoints = jmespath.search(swimmerList, searchstring);
    var endplace = 1
    orderpoints.map(result => {
        result.place = endplace.toString()
        endplace++
    })
    return orderpoints
}

function getAgeGroupIdWithAge(event_sessions, event_number, agemin, agemax) {

    try {
        var searchstring = "[?ATTR.number == '" + event_number + "'].AGEGROUPS[].AGEGROUP[]"
        var tmp = jmespath.search(event_sessions, searchstring);
        var searchstring2 = "[?ATTR.agemax.to_number(@) >= '" + +agemax + "'] || [?ATTR.agemax == '-1']"
        var tmp2 = jmespath.search(tmp, searchstring2);
        var searchstring3 = "[?ATTR.agemin.to_number(@) <= '" + +agemin + "'] || [?ATTR.agemin == '-1']"
        var tmp3 = jmespath.search(tmp2, searchstring3);
        if (tmp3.length == 1) {
            console.log('<combined> found id ' + tmp3[0].ATTR.agegroupid + ' ' + event_number + ' from ' + agemin + ' to ' + agemax)
            return tmp3[0].ATTR.agegroupid
        } else {
            console.log('<combined> error on find agegroup id ' + event_number + ' from ' + agemin + ' to ' + agemax)
            console.log(tmp2)
            console.log(tmp3)
            return undefined;
        }
    } catch (err) {
        console.log(err)
        return new Object();
    }
}

module.exports = { addResultsToSwimerList, addPlaceToCombinedList, getAgeGroupIdWithAge }
