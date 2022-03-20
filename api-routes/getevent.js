const getResultData = require("../services/getResultData");

module.exports = function getevent(req, res) {
    /*
    var event = req.query.event !== undefined ? req.query.event : 0
    var agegroup = req.query.agegroup !== undefined ? req.query.agegroup : 0

    var stringJson = getResultData(event,agegroup)
    */

    res.send(res.body);
}