module.exports = function checkUndefined(value) {
    try {
        if (value !== 'undefined' && value !== undefined) {
            return value;
        }
        else {
            return "";
        }
    }
    catch {
        return "";
    }
}
