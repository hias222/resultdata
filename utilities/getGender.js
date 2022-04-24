function getGender(name) {
    switch (name) {
        case "M":
            return "männlich";
        case "F":
            return "weiblich";
        default:
            return name;

    }
    // The function returns the product of p1 and p2
}

module.exports = { getGender };