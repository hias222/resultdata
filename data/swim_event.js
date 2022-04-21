const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
const jmespath = require('jmespath');

const { addResultsToSwimerList, addPlaceToCombinedList, getAgeGroupIdWithAge, getDefininitions } = require('./combined')

var PropertyReader = require('properties-reader')
require('dotenv').config();

var event_debug = process.env.MQTT_EVENT_DEBUG === 'true' ? true : false;

var propertyfile = __dirname + "/../resources/" + process.env.PROPERTY_FILE;
var properties = PropertyReader(propertyfile)

var event_all = null
var event_sessions = null;
var event_heatid = null;
var event_swimmer = null;
var event_results = null;
var event_clubs = null;

var event_type = properties.get("main.event_type")
var combined_definition = properties.get("main.combined_file")

var internalheadID = "1";
var actual_heat = "1";
var actual_event = "1";
var relay_count = "1";

const event_type_values = {
    FINALE: 'FIN',
    VORLAEUFE: 'PRE',
    DIREKT: 'TIM',
    ALL: 'ALL'
}

class swimevent {

    constructor(filename) {
        this.filename = filename
        this.success_load = false;
        try {
            this.xml_string = fs.readFileSync(filename, "utf8");

            this.readFile()
            this.success_load = true;

            var combined_file = __dirname + '/../resources/' + combined_definition
            this.combined_data = JSON.parse(fs.readFileSync(combined_file, "utf8"))

        } catch (Exception) {
            console.log(Exception)
        }
        console.log("<swim_event> Event type " + event_type)
    }

    async updateFile(filename) {
        return new Promise((resolve, reject) => {
            this.filename = __dirname + '/../resources/' + filename
            try {
                const data = fs.readFileSync(this.filename, 'utf8')
                console.log('<swim_event> read ' + filename)
                this.xml_string = data;
                this.readFile();
            } catch (Exception) {
                console.log(Exception)
                reject(Exception)
            }
            // update file name
            var lenex_file = properties.get("main.lenex_results")
            console.log("<swim_event> property old file " + lenex_file)
            properties.set("main.lenex_results", filename);
            properties.save(propertyfile)
            lenex_file = properties.get("main.lenex_results")
            console.log("<swim_event> property new file " + lenex_file)
            resolve('success load')
        })
    }

    readFile() {
        console.log("<swim_event> read " + this.filename)
        try {
            parser.parseString(this.xml_string, function (error, result) {
                if (error === null) {
                    event_all = result;
                    event_swimmer = jmespath.search(result.LENEX.MEETS[0].MEET[0], "CLUBS[].CLUB[].ATHLETES[].ATHLETE[]")
                    event_clubs = result.LENEX.MEETS[0].MEET[0].CLUBS[0].CLUB
                    event_heatid = jmespath.search(result.LENEX.MEETS[0].MEET[0].SESSIONS, "[].SESSION[].EVENTS[].EVENT[]");
                    event_sessions = jmespath.search(result.LENEX.MEETS[0].MEET[0].SESSIONS, "[].SESSION[].EVENTS[].EVENT[]")

                    //event_results = jmespath.search(result.LENEX.MEETS[0].MEET[0].SESSIONS, "[].SESSION[].EVENTS[].EVENT[].AGEGROUPS[].AGEGROUP[]");
                    /*
                                        var lenex_file = properties.get("main.lenex_results")
                                        var debug_filename = __dirname + '/../resources/' + lenex_file + '.json'
                                        console.log(debug_filename)
                                        fs.writeFile(debug_filename, JSON.stringify(event_swimmer), err => {
                                            if (err) {
                                                console.error(err)
                                                return
                                            }
                                            //file written successfully
                                        })
                    */

                } else {
                    console.log(error);
                }
            });
        } catch (Exception) {
            console.log(Exception)
        }
    }


    getCompetitionName() {
        if (this.success_load) {
            try {
                var shortname = "{ \"competition\": \"" + event_all.LENEX.MEETS[0].MEET[0].ATTR.name + "\"}"
                return JSON.parse(shortname);
            } catch (Exception) {
                console.log(Exception)
                return null;
            }
        }
    }

    getAgeGroupIDs(eventnumber) {

        try {
            var searchstring = "[?ATTR.number == '" + eventnumber + "'].AGEGROUPS[].AGEGROUP[]"
            var tmp = jmespath.search(event_sessions, searchstring);
            var attributsearch = "[].{value: ATTR.agegroupid, label: join('-', [ATTR.agemin, ATTR.agemax])}"
            var searcharray = jmespath.search(tmp, attributsearch);
            return searcharray
        } catch (err) {
            console.log("<swim_events> getAgeGroupID crash " + eventnumber + " mode " + event_type)
            console.log("<swim_events> nothing found !!!")
            internalheadID = 0;
            return new Object();
        }
    }

    getResults(eventnumber, agegroup) {

        try {
            var searchstring = "[?ATTR.number == '" + eventnumber + "'].AGEGROUPS[].AGEGROUP[]"
            var tmp = jmespath.search(event_sessions, searchstring);
            var attributsearch = "[?ATTR.agegroupid == '" + agegroup + "'].RANKINGS[].RANKING[].{order: ATTR.order, place: ATTR.place , resultid: ATTR.resultid}"
            var searcharray = jmespath.search(tmp, attributsearch);
            return searcharray
        } catch (err) {
            console.log("<swim_events> getAgeGroupID crash " + eventnumber + " mode " + event_type)
            console.log("<swim_events> nothing found !!!")
            internalheadID = 0;
            return new Object();
        }
    }

    getResultID(resultid) {

        try {
            var searchstring = "[?RESULTS[?RESULT[?ATTR.resultid == '" + resultid + "']]]"
            var tmp = jmespath.search(event_swimmer, searchstring);

            var resultattributsearch = "[].RESULTS[].RESULT[?ATTR.resultid == '" + resultid + "']"
            var resultarray = jmespath.search(tmp, resultattributsearch);

            var resultattributsearch2 = "[].{points: ATTR.points, swimtime: ATTR.swimtime }"
            var searcharray = jmespath.search(resultarray, resultattributsearch2);

            var resultswimmersearch = "[].{firstname: ATTR.firstname,lastname: ATTR.lastname, birthdate: ATTR.birthdate, nation: ATTR.nation, athleteid: ATTR.athleteid }"
            var swimmerarray = jmespath.search(tmp, resultswimmersearch);

            var club = this.getSwimmerClub(swimmerarray[0].athleteid)

            var alltogether = { ...swimmerarray[0], ...searcharray[0], ...club[0] }

            return alltogether;

        } catch (err) {
            console.log("<swim_events> getAgeGroupID crash " + resultid + " mode " + event_type)
            console.log("<swim_events> nothing found !!!")
            internalheadID = 0;
            return new Object();
        }
    }

    getResultDataList(resultids) {
        var swimmerResults = []

        resultids.map(result => {
            if (result.place !== '-1') {
                var resultSwimmer = this.getResultID(result.resultid)
                var resultplace = { ...result, ...resultSwimmer }
                swimmerResults.push(resultplace)
            }
        })

        return swimmerResults
    }

    getInternalHeatId(eventnumber, heatnumber) {
        console.log("<swim_events> getInternalHeatId " + eventnumber + " " + heatnumber)
        try {
            actual_event = eventnumber;
            actual_heat = heatnumber;
            if (event_type === event_type_values.ALL) {
                var searchstring = "[?ATTR.number == '" + eventnumber + "'].HEATS[*].HEAT[*]"
                var tmp_heats = jmespath.search(event_heatid, searchstring)[0][0];
                var searchheat = "[?ATTR.number == '" + heatnumber + "'].ATTR.heatid"
                var newid = jmespath.search(tmp_heats, searchheat).toString()
                internalheadID = newid
                console.log("<swim_event> number heats " + newid)
                return newid;
            } else {
                console.log("<swim_events> mode " + event_type)
                var searchstring = "[?ATTR.number == '" + eventnumber + "' && ATTR.round == '" + event_type + "'].HEATS[*].HEAT[*]"
                //var myarray = jmespath.search(event_heatid, searchstring);
                var tmp_heats = jmespath.search(event_heatid, searchstring)[0][0];
                var searchheat = "[?ATTR.number == '" + heatnumber + "'].ATTR.heatid"
                var newid = jmespath.search(tmp_heats, searchheat).toString()
                internalheadID = newid
                console.log("<swim_event> number round heat " + newid)
                return newid;
            }
        } catch (err) {
            console.log("<swim_events> getInternalHeatId crash " + eventnumber + " " + heatnumber + " mode " + event_type)
            console.log("<swim_events> nothing found !!!")
            //console.log(err)
            internalheadID = 0;
            return new Object();
        }
    }

    getEventName(number) {
        console.log("<swim_event> search for number " + number)
        var emptyevent = "{ \"type\": \"header\", \"relaycount\": \"1\", \"event\": \"" + actual_event + "\", \"heat\": \"" + actual_heat + "\" }"
        try {
            var searchstring = "[?ATTR.number == '" + number + "']"
            var tmp = jmespath.search(event_sessions, searchstring);
            var attributsearch = "[].{event: ATTR.number, gender: ATTR.gender, round: ATTR.round, relaycount: SWIMSTYLE[0].ATTR.relaycount, swimstyle: SWIMSTYLE[0].ATTR.stroke, distance: SWIMSTYLE[0].ATTR.distance, name: SWIMSTYLE[0].ATTR.name }"
            var searcharray = jmespath.search(tmp, attributsearch);
            if (searcharray.length > 1 && event_type !== event_type_values.ALL) {
                console.log("<swim_event> wir müssen nochmal filtern " + event_type)
                for (let eventnames of searcharray) {
                    if (eventnames.round.toString() === event_type) {
                        console.log("<swim_event> geteventname found " + eventnames.round);
                        var eventdata = eventnames;
                        relay_count = typeof eventdata !== "undefined" ? eventdata.relaycount : "1";
                        var eventresult = typeof eventdata !== "undefined" ? eventdata : JSON.parse(emptyevent);
                        return { ...JSON.parse(emptyevent), ...eventresult, ...this.getCompetitionName() };
                    }
                }
            } else {
                console.log("<swim_event> single event")
                var eventdata = jmespath.search(tmp, attributsearch)[0];
                relay_count = typeof eventdata !== "undefined" ? eventdata.relaycount : "1";
                var eventresult = typeof eventdata !== "undefined" ? eventdata : JSON.parse(emptyevent);
                return { ...JSON.parse(emptyevent), ...eventresult, ...this.getCompetitionName() };
            }
        } catch (err) {
            console.log("<swim_event> eemptyevent")
            console.log(err)
            try {
                return JSON.parse(emptyevent);
            } catch (err) {
                console.log("<swim_event> error return nullevent")
                var nullevent = "{\"type\":\"header\",\"event\":\"0\",\"heat\":\"0\"}"
                return JSON.parse(nullevent);
            }
        }
    }

    getEventList(){
        console.log("<swim_event> getEventList ")
        try {
            var searchstring = "[].{event: ATTR.number, gender: ATTR.gender, SWIMSTYLE: SWIMSTYLE[0].{stroke: ATTR.stroke, distance: ATTR.distance}}"
            var tmp = jmespath.search(event_sessions, searchstring);
            return tmp
        } catch (err) {
            console.log("<swim_event> eemptyevent")
            console.log(err)
            return null
        }
    }

    getActualSwimmer(lane, time, place) {
        var emptylane = "{ \"type\": \"lane\", \"lane\": \"" +
            lane + "\", \"event\": \"" +
            actual_event + "\", \"place\": \"" +
            place + "\", \"finishtime\": \"" +
            time + "\", \"heat\": \"" +
            actual_heat + "\" }"
        try {
            var lastswimmer = this.getSwimmerHeat(internalheadID, lane);
            if (event_debug) console.log("<swim_event> lastswimmer")
            //console.log(lastswimmer)
            //var searchstring = "[?lane == '" + lane + "']"
            //var tmp = jmespath.search(lastswimmers, searchstring);
            //[].relay[][].RELAYPOSITION[].ATTR
            var swimmer = typeof lastswimmer[0] !== "undefined" ? lastswimmer[0] : JSON.parse(emptylane);
            if (typeof swimmer.athleteid !== "undefined") {
                if (event_debug) console.log("<swim_event> type single")
                var club = this.getSwimmerClub(lastswimmer[0].athleteid)
                return { ...swimmer, ...club[0], ...JSON.parse(emptylane) };
            } else if (typeof swimmer.round !== "undefined") {
                console.log("<swim_event> type relay")
                return { ...JSON.parse(emptylane), ...swimmer };
            } else {
                if (event_debug) console.log("<swim_event> type nothing")
                return swimmer;
            }
        } catch (err) {
            console.log(err)
            try {
                return JSON.parse(emptylane);
            } catch (err) {
                var nulllane = "{\"type\":\"lane\",\"lane\":\"0\",\"event\":\"0\",\"place\":\"0\",\"finishtime\":\"0\",\"heat\":\"0\"}"
                return JSON.parse(nulllane);
            }
        }
    }


    getRelayHeat(internalHeatID, lane) {
        console.log("<swim_event> get relay for internalheatid " + internalHeatID + " no relay lane " + lane)
        var emptylane = "{ \"round\": \"4\"}"

        var searchstring = "[?RELAYS[?RELAY[?ENTRIES[?ENTRY[?ATTR.heatid == '" + internalHeatID + "' && ATTR.lane == '" + lane + "' ]]]]]"
        var tmp = jmespath.search(event_clubs, searchstring);

        var all_entries_only = jmespath.search(event_clubs, "[].RELAYS[].RELAY[].ENTRIES[].ENTRY[?ATTR.heatid == '" + internalHeatID + "' && ATTR.lane == '" + lane + "']")
        var single_entry = jmespath.search(all_entries_only, "[]")
        var cleared_entry = jmespath.search(single_entry, "[].{entrytime: ATTR.entrytime, lane: ATTR.lane, RELAYPOSTIONS: RELAYPOSITIONS[].RELAYPOSITION}")

        var get_club_Search = "[].{code: ATTR.code, name: ATTR.name}"
        var club_per_lane = jmespath.search(tmp, get_club_Search);

        var complete_entry = [{ ...JSON.parse(emptylane), ...club_per_lane[0], ...cleared_entry[0] }]

        //console.log(JSON.stringify(complete_entry))

        return complete_entry;

    }

    getSingleSwimmerHeat(internalHeatID, lane) {
        if (event_debug) console.log("<swim_event> get swimmer for internalheatid " + internalHeatID + " no relay lane " + lane)
        var searchstring = "[?ENTRIES[?ENTRY[?ATTR.heatid == '" + internalHeatID + "']]] " // | [?ENTRIES[?ENTRY[?ATTR.lane == '" + lane + "']]]"
        var tmp = jmespath.search(event_swimmer, searchstring);
        //console.log(tmp[0].ENTRIES[0].ENTRY)
        //console.log("getswimmerheate number swimmers " +  tmp.length)
        var searchstring2 = "[].{athleteid: ATTR.athleteid, birthdate: ATTR.birthdate, firstname: ATTR.firstname, lastname: ATTR.lastname, birthdate: ATTR.birthdate , \
            lane: ENTRIES[0].ENTRY[?ATTR.heatid == '" + internalHeatID + "'].ATTR.lane , \
            entrytime: ENTRIES[0].ENTRY[?ATTR.heatid == '" + internalHeatID + "'].ATTR.entrytime}"
        var tmp2 = jmespath.search(tmp, searchstring2);

        var searchstring3 = "[].{athleteid: athleteid, birthdate: birthdate, firstname: firstname, lastname: lastname, lane: lane[0], entrytime: entrytime[0] }"
        var tmp3 = jmespath.search(tmp2, searchstring3);

        var searchstring4 = "[?lane == '" + lane + "']"
        var tmp4 = jmespath.search(tmp3, searchstring4);

        return tmp4
    }

    getSwimmerHeat(internalHeatID, lane) {
        if (relay_count === "1") {
            return this.getSingleSwimmerHeat(internalHeatID, lane)
        } else {
            return this.getRelayHeat(internalHeatID, lane)
        }
    }

    getSwimmerClub(swimmerid) {
        var searchstring = "[?ATHLETES[?ATHLETE[?ATTR.athleteid == '" + swimmerid + "']]]"
        var tmp = jmespath.search(event_clubs, searchstring);
        var searchstring2 = "[].{name: ATTR.name, code: ATTR.code}"
        return jmespath.search(tmp, searchstring2);
    }

    setEventType(type) {
        if (Object.values(event_type_values).includes(type)) {
            properties.set("main.event_type", type);
            properties.save(propertyfile);
            event_type = type
            return true;
        }
        return false;
    }

    getEventType() {
        return event_type;
    }

    getResultData(event, agegroup) {

        console.log('<swim_event:getEventData> Event: ' + event + ' Agegroup: ' + agegroup)

        var eventName = this.getEventName(event)
        var competion = this.getCompetitionName()
        var results = this.getResults(event, agegroup)
        //console.log(results)

        var swimmerResults = this.getResultDataList(results)

        /*
        var swimmerResults = []

        results.map(result => {
            if (result.place !== '-1') {
                var resultSwimmer = this.getResultID(result.resultid)
                var resultplace = { ...result, ...resultSwimmer }
                swimmerResults.push(resultplace)
            }
        })
        */

        var searchstring = "sort_by([*],&place.to_number(@))"
        var orderbyplace = jmespath.search(swimmerResults, searchstring);

        var competitionName = competion.competition !== undefined ? competion.competition : ''
        //console.log(eventName)
        var style = eventName.distance + 'm ' + eventName.swimstyle + ' ' + eventName.gender + ' (' + event_type + ') '

        let eventData = {
            eventDefinition: {
                name: style,
                eventNumber: event,
                competition: competitionName
            },
            swimmerResults: orderbyplace
        }

        return eventData

    }

    getDownloadList(eventnumber) {
        // event_clubs
        try {
            var searchstring = "[?ATTR.name != null]"
            var tmp = jmespath.search(event_clubs, searchstring);
            var attributsearch = "[].{code: ATTR.code, name: ATTR.name, nation: ATTR.nation, region: ATTR.region}"
            var searcharray = jmespath.search(tmp, attributsearch);
            var searchstring2 = "sort_by([*],&name)"
            var searcharray2 = jmespath.search(searcharray, searchstring2);
            return searcharray2
        } catch (err) {
            console.log("<swim_events> nothing found getDownloadList !!!")
            return new Object();
        }

    }

    getEventdefinition() {
        console.log('<getEventdefinition> for result dropdown')
        var eventlist = this.getEventList()
        var attributsearch = "[].{value: event, label: join(' ', [event, gender.to_string(@), SWIMSTYLE.distance, SWIMSTYLE.stroke ])}"
        var searcharray = jmespath.search(eventlist, attributsearch);
        return searcharray;
    }

    getCombineddefinition() {
        console.log('<getCombineddefinition>')
        var definintions = getDefininitions(this.combined_data)
        return definintions;
    }

    getCombinedData(combinedid) {
        console.log('<swim_event:combined> id ' + combinedid)
        try {
            var swimmerList = [];
            var found_age = true;
            var combined_data = this.combined_data.find(x => x.combinedid == +combinedid);
            var error_data

            if (combined_data) {
                combined_data.events.map(event => {
                    var agegroupID = getAgeGroupIdWithAge(event_sessions, event.number, combined_data.agemin, combined_data.agemax)
                    if (agegroupID !== undefined) {
                        var results = this.getResults(event.number, agegroupID)
                        var eventdetails = this.getEventName(event.number)
                        var swimmerResults = this.getResultDataList(results)
                        swimmerList = addResultsToSwimerList(swimmerList, swimmerResults, event, eventdetails, combined_data);
                    } else {
                        found_age = false
                        error_data = event
                    }
                })
            }
            if (found_age) return addPlaceToCombinedList(swimmerList)
            return { ...error_data, ...{ "agemin": combined_data.agemin, "agemax": combined_data.agemax } }
        } catch (err) {
            console.log("<swim_events> nothing found getCombinedData !!!")
            console.log(err)
            return new Object();
        }
    }
}

module.exports = swimevent;