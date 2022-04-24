function getBirthYear(brithdate) {
    try {
        var res = brithdate.toString().substring(0, 4);
        return res
    } catch {
        return null
    }
   
    // The function returns the product of p1 and p2
}

module.exports = { getBirthYear};