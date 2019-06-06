// Require Third-party Dependencies
const avaTest = require("ava");
const is = require("@slimio/is");

// Require Internal Dependencies
const argc = require("../");

avaTest("argc must be a function", (assert) => {
    assert.true(typeof argc === "function");
});

avaTest("argc valid assertion", (assert) => {
    const myArg = "fraxken";

    assert.is(argc(myArg, is.string), void 0);
    assert.is(argc(myArg, is.string, (str) => str.length > 3), void 0);
    assert.is(argc(myArg, [is.string, is.number]), void 0);
});

avaTest("argc must be string", (assert) => {
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
        assert.is(err.message, "'input' doesn't match his predicate(s)");
    }
});
