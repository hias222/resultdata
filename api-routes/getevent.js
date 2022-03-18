module.exports = function getevent(req, res) {
    //console.log(req);
    var stringJson = JSON.parse("{ \"event\": \"1\" }")

    res.send(stringJson);
}