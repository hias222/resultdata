function getRaceType(name) {
    switch (name) {
        case "FIN":
            return "Finale";
        case "PRE":
            return "Vorlauf";
        default:
            return "Lauf";

    }
    // The function returns the product of p1 and p2
}

module.exports = getRaceType;