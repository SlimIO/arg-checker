// Require Node.js Dependencies
const { readFileSync } = require("fs");

// Require Third-party Dependencies
const callsites = require("callsites");
const cleanStack = require("clean-stack");

// Require Internal Dependencies
const isValidIdentifier = require("./src/isValidIdentifier");

// CONSTANTS
const RE_LABEL = /^.*?\((.*?)[,)]/;

/**
 * @function inferLabel
 * @param {*} callsites callsites (V8 stack trace)
 * @returns {string}
 *
 * @see Method inspired by infer-label.ts in https://github.com/sindresorhus/ow package
 */
function inferLabel(callsites) {
    const functionCallStackFrame = callsites[1];
    const fileName = functionCallStackFrame.getFileName();
    const lineNumber = functionCallStackFrame.getLineNumber();
    const columnNumber = functionCallStackFrame.getColumnNumber();

    if (!fileName || lineNumber === null || columnNumber === null) {
        return void 0;
    }

    try {
        const content = readFileSync(fileName, "utf8").split("\n");
        const line = content[lineNumber - 1];
        if (!line) {
            return void 0;
        }

        const match = RE_LABEL.exec(line.slice(columnNumber - 1));
        if (!match || !match[1]) {
            return void 0;
        }

        const token = match[1];
        if (isValidIdentifier(token) || isValidIdentifier(token.split(".").pop())) {
            return token;
        }

        return void 0;
    }
    catch (err) {
        return void 0;
    }
}

/**
 * @class ArgumentError
 * @extends Error
 */
class ArgumentError extends Error {
    /**
     * @constructor
     * @param  {...any} args args
     */
    constructor(...args) {
        super(...args);
        this.name = "ArgumentError";
        this.stack = cleanStack(this.stack);
    }
}

function argc(arg, ...predicates) {
    const callStackFrames = callsites();
    const argumentLabel = inferLabel(callStackFrames) || "arg";
    const functionName = callStackFrames[1].getFunctionName();

    for (const predicate of predicates) {
        if (Array.isArray(predicate)) {
            const ret = predicate.some((fn) => fn(arg));
            if (!ret) {
                throw new ArgumentError(`'${argumentLabel}' of '${functionName}' function doesn't match his predicate(s)`);
            }
        }
        else if (typeof predicate !== "function") {
            continue;
        }
        else if (!predicate(arg)) {
            throw new ArgumentError(`'${argumentLabel}' of '${functionName}' function doesn't match his predicate(s)`);
        }
    }
}

module.exports = argc;
