"use strict";

// Require Third-party Dependencies
const avaTest = require("ava");
const is = require("@slimio/is");

// Require Internal Dependencies
const argc = require("../");

avaTest("argc must be a function", (assert) => {
    assert.true(typeof argc === "function");
});

// avaTest("argc valid assertion", (assert) => {
//     const myArg = "fraxken";

//     assert.is(argc(myArg, is.string), void 0);
//     assert.is(argc(myArg, is.string, (str) => str.length > 3), void 0);
//     assert.is(argc(myArg, [is.string, is.number]), void 0);
// });

avaTest("argc must be string (return anonymous)", (assert) => {
    assert.plan(2);

    try {
        // eslint-disable-next-line
        function myInput(input) {
            argc(input, is.string);
        }
        myInput(10);
    }
    catch (err) {
        assert.is(err.name, "ArgumentError");
        assert.is(err.message, "'input' doesn't match anonymous predicate");
    }
});

avaTest("argc must be string (return string predicate)", (assert) => {
    assert.plan(2);
    /**
     * @function isString
     * @param {any} val *
     * @returns {!boolean}
     */
    function isString(val) {
        return typeof val === "string";
    }

    try {
        // eslint-disable-next-line
        function myInput(input) {
            argc(input, isString);
        }
        myInput(10);
    }
    catch (err) {
        assert.is(err.name, "ArgumentError");
        assert.is(err.message, "'input' doesn't match isString predicate");
    }
});

avaTest("argc with multiple predicates", (assert) => {
    assert.plan(2);
    /**
     * @function isString
     * @param {any} val *
     * @returns {!boolean}
     */
    function isString(val) {
        return typeof val === "string";
    }
    /**
     * @function isNumber
     * @param {any} val *
     * @returns {!boolean}
     */
    function isNumber(val) {
        return typeof val === "number";
    }

    try {
        // eslint-disable-next-line
        function myInput(input) {
            argc(input, [isString, isNumber]);
        }
        myInput(true);
    }
    catch (err) {
        assert.is(err.name, "ArgumentError");
        assert.is(err.message, "'input' doesn't match one or many of: isString, isNumber predicate(s)");
    }
});
