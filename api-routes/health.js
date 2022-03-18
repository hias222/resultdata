
module.exports = function configuration(req, res) {
    //console.log(req);
    var stringJson = JSON.parse("{ \"health\": \"up\" }")

    var configuration = JSON.parse("{ \"configuration\": \"/configuration\" }")

    var stringreturnjson = { ...stringJson, ...configuration}

    console.log(stringreturnjson)

    res.send(stringreturnjson);
}