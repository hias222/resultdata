function getSwimStyle(name) {
    switch (name) {
        case "FREE":
            return "Freistil";
        case "FLY":
            return "Schmetterling";
        case "BREAST":
            return "Brust";
        case "BACK":
            return "Rücken";
        case "MEDLEY":
            return "Lagen";
        default:
            return name;

    }
    // The function returns the product of p1 and p2
}

module.exports = { getSwimStyle };