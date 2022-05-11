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


function clearPlaceAbove(resultJson, place) {

    var newResult = []
    var numberresults = 0

    resultJson.map(result => {
        if (numberresults < result.data.length) {
            numberresults = result.data.length
            console.log('<reduceResults> number results' + result.data.length)
        }

        if (parseInt(result.place) < parseInt(place)) {
            console.log(result.data.length)
            newResult.push(getEmptyResult(result.place))
        } else {
            if (result.data.length > +numberresults - 1) {
                newResult.push(result)
            }
        }
    })
    return newResult
}

module.exports = { clearPlaceAbove };