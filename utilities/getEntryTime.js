module.exports = function getEntryTime(entrytime) {
    try {
        var res = entrytime.toString().split(":");
        if (res[1] === undefined || res[2] === undefined) {
            return "NT"
        } else {
            var newstring = res[1] + ":" + res[2]
            return newstring
        }
    } catch (e) {
        //console.log(e)
        return "NT";
    }
}