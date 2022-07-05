function getAgeYear(age) {
    var curretnTime = new Date();
    var year = curretnTime.getFullYear();
    
    var ageYear = +year - age

    return ageYear
}

module.exports = { getAgeYear };