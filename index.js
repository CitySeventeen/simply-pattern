const ERRORS = require('./src/errors.js').errors;
const creational = require('./src/creational/');

const patterns = {};
for(let pattern in creational)
  patterns[pattern] = creational[pattern];

module.exports = patterns;
module.exports.ERRORS = ERRORS;


