// Require Third-party Dependencies
const callsites = require("callsites");

function argc(arg, ...predicates) {
    const cs = callsites()[1];
    console.log(cs.getFileName());
    console.log(cs.getFunctionName());
    console.log(cs.getMethodName());
    console.log(cs.getLineNumber());
    console.log(cs.getColumnNumber());
}

module.exports = argc;
