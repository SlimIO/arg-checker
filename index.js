"use strict";

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
 * @param {*} functionCallStackFrame functionCallStackFrame (V8 stack trace)
 * @returns {string}
 *
 * @see Method inspired by infer-label.ts in https://github.com/sindresorhus/ow package
 */
function inferLabel(functionCallStackFrame) {
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
 * @augments Error
 */
class ArgumentError extends Error {
    /**
     * @class
     * @param  {...any} args args
     */
    constructor(...args) {
        super(...args);
        this.name = "ArgumentError";
        this.stack = cleanStack(this.stack);
    }
}

/**
 * @function argc
 * @param {any} arg any kind of JavaScript primitives or Objects values
 * @param {any[]} predicates predicates function (rest functions or rest array of functions)
 * @returns {boolean}
 */
function argc(arg, ...predicates) {
    const callStackFrames = callsites();

    for (const predicate of predicates) {
        if (Array.isArray(predicate)) {
            const ret = predicate.some((fn) => fn(arg));
            if (!ret) {
                const fnNames = predicate.map((fn) => fn.name || "anonymous");
                const argumentLabel = inferLabel(callStackFrames[1]) || inferLabel(callStackFrames[2]) || "arg";

                throw new ArgumentError(`'${argumentLabel}' doesn't match one or many of: ${fnNames.join(", ")} predicate(s)`);
            }
        }
        else if (typeof predicate !== "function") {
            continue;
        }
        else if (!predicate(arg)) {
            const fnName = predicate.name || "anonymous";
            const argumentLabel = inferLabel(callStackFrames[1]) || inferLabel(callStackFrames[2]) || "arg";

            throw new ArgumentError(`'${argumentLabel}' doesn't match ${fnName} predicate`);
        }
    }

    return true;
}

module.exports = argc;
