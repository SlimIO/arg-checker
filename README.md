# arg-checker
![version](https://img.shields.io/badge/version-0.1.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

SlimIO Argument Checker. This package is inspired by [ow](https://github.com/sindresorhus/ow#readme) to retrieve the callsites but doesn't include any built-in predicates.

## Requirements
- [Node.js](https://nodejs.org/en/) v10 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i @slimio/arg-checker
# or
$ yarn add @slimio/arg-checker
```

## Usage example
```js
const argc = require("@slimio/arg-checker");
const is = require("@slimio/is");

function sayHello(name, age) {
    argc(name, [is.string, is.symbol]); // <-- Array stand for "OR" condition
    argc(age, is.number);
}
sayHello("fraxken", 24);
```

## API

<details><summary>argc(arg: any, ...predicates: (argc.predicate | argc.predicate[])[]): void</summary>
<br />

TBC
</details>

## Roadmap
- Custom Error message ?
- Improve predicates detection ?

## License
MIT
