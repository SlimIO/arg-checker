// CONSTANTS
const RE_IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
const RESERVED = new Set([
    "undefined",
    "null",
    "true",
    "false",
    "super",
    "this",
    "Infinity",
    "NaN"
]);

module.exports = function isValidIdentifier(string) {
    return string && !RESERVED.has(string) && RE_IDENTIFIER.test(string);
};
