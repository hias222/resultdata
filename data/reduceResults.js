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

    resultJson.map(result => {
        if (parseInt(result.place) < parseInt(place)) {
            console.log(getEmptyResult(result.place))
            newResult.push(getEmptyResult(result.place))
        } else {
           newResult.push(result)
        }
    })
    return newResult
}

module.exports = { clearPlaceAbove };