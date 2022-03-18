module.exports = function showevent(req, res) {
    console.log("Message: " + JSON.stringify(req.body));
    res.status(200).send(req.body);
}