const { parseString } = require("xml2js")

function getEmptyResult(place) {
    var emptyResult = {
        athleteid: '',
        firstname: '',
        lastname: '',
        birthdate: '',
        clubname: '',
        combined_name: '',
        title: 'Bayerischer Schwimm-Mehrkampf Brust 2010',
        nation: '',
        clubid: '',
        combinedpoints: '',
        data: [
        ],
        place: place
    }

    return emptyResult
}

function getEmptyStandardResult(place) {

    var emptyResult = {
        athleteid: '',
        firstname: '',
        lastname: '',
        birthdate: '',
        clubname: '',
        nation: '',
        points: '',
        code: '',
        resultid: '',
        status: null,
        name: '',
        swimtime: '',
        data: [
        ],
        place: place,
        order: place
    }

    return emptyResult
}


function clearPlaceAbove(resultJson, place) {

    var newResult = []
    var numberresults = 0

    var actualplace = 0

    resultJson.map(result => {

        if (numberresults < result.data.length) {
            numberresults = result.data.length
            console.log('<reduceResults> number results ' + result.data.length)
        }

        if (parseInt(result.place) < parseInt(place)) {
            actualplace++
            newResult.push(getEmptyResult(result.place))
        } else {
            if (result.data.length > +numberresults - 1) {
                actualplace++
                if (actualplace < parseInt(result.place)) {
                    result.place = '' + actualplace
                    console.log('<reduceResult.js> missing')
                    newResult.push(result)
                } else {
                    newResult.push(result)
                }
            }
        }
    })
    return newResult
}

function clearPlaceStandard(resultJson, place) {

    var newResult = []
    var numberresults = 0

    var actualplace = 0

    if (numberresults < resultJson.swimmerResults.length) {
        numberresults = resultJson.swimmerResults.length
        console.log('<reduceResults> number results ' + resultJson.swimmerResults.length + ' (place ' + place + ')')
    }

    resultJson.swimmerResults.map(result => {

        if (parseInt(result.place) < parseInt(place)) {
            actualplace++
            newResult.push(getEmptyStandardResult(result.place))
        } else {
            newResult.push(result)
        }

    })
    return newResult
}

module.exports = { clearPlaceAbove, clearPlaceStandard };