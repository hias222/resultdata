const jmespath = require('jmespath');

var PropertyReader = require('properties-reader')
require('dotenv').config();
var propertyfile = __dirname + "/../resources/" + process.env.PROPERTY_FILE;
var properties = PropertyReader(propertyfile)
var combined_max_results = properties.get("main.combined_max_results") !== null ? properties.get("main.combined_max_results") : 999

function addResultsToSwimerList(swimmerList, swimmerResults, event, eventdetails, combined_name) {

    swimmerResults.map(result => {
        var factor = event.factor !== undefined ? event.factor : 1
        var correctpoints = +factor * +result.points
        var swimmerdata = {
            'athleteid': result.athleteid,
            'firstname': result.firstname,
            'lastname': result.lastname,
            'birthdate': result.birthdate,
            'clubname': result.name,
            'combined_name': combined_name.name,
            'title': combined_name.title,
            'nation': result.nation,
            'clubid': result.code,
            'combinedpoints': correctpoints, 'data': [{
                'event': event.number,
                'distance': eventdetails.distance,
                'swimstyle': eventdetails.swimstyle,
                'points': correctpoints,
                'place': result.place,
                'factor': factor,
                'swimtime': result.swimtime
            }]
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

    console.log("<combined.js> max results " + combined_max_results)
    var searchstring2 = "[?place.to_number(@) <= '" + combined_max_results + "']"
    var reduced = jmespath.search(orderpoints, searchstring2);
    return reduced
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

function getDefininitions(combindedData) {

    try {
        var searchstring = "[].{value: combinedid, label: name}"
        var tmp = jmespath.search(combindedData, searchstring);
        return tmp
    } catch (err) {
        console.log(err)
        var newDefinition = [
            { value: 1, label: 'Fehler' },
            { value: 2, label: 'Fehler' }
        ]
        return newDefinition;
    }
}

function convertToResult(combindedData, competition) {
    console.log('<combined> max_results>')

    var eventDefinition = {
        eventDefinition: {
            name: combindedData[0].title,
            eventNumber: '',
            competition: competition
        }
    }

    var swimmerdata = []


    combindedData.map(data => {
        var result = {
            order: data.place,
            place: data.place,
            resultid: "",
            firstname: data.firstname,
            lastname: data.lastname,
            birthdate: data.birthdate,
            nation: data.nation,
            athleteid: data.athleteid,
            points: data.combinedpoints,
            swimtime: data.combinedpoints,
            name: data.clubname,
            code: data.clubid
        }
        swimmerdata.push(result)
    })

    var swimmerResults = { swimmerResults: swimmerdata }
    var reesultMessage = { ...eventDefinition, ...swimmerResults }

    return reesultMessage
}


module.exports = { addResultsToSwimerList, addPlaceToCombinedList, getAgeGroupIdWithAge, getDefininitions, convertToResult }
