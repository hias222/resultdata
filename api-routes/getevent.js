const getResultData = require("../services/getResultData");

module.exports = function getevent(req, res) {

    var event = req.body.event !== undefined ? req.body.event : 0
    var agegroup = req.body.agegroup !== undefined ? req.body.agegroup : 0

    var stringJson = getResultData(event,agegroup)

    res.send(stringJson);
}