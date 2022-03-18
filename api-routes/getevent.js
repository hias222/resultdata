module.exports = function getevent(req, res) {
    //console.log(req);
    var stringJson = JSON.parse(" [ { \"event\": \"99\" } ]")

    res.send(stringJson);
}