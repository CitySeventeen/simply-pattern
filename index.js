const creational = require('./src/creational/');

const patterns = {};
for(let pattern in creational)
  patterns[pattern] = creational[pattern];
  
module.exports = patterns;


