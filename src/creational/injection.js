/*
 * Based on Dependency Injection pattern of Nodejs Design pattern
 * A dependency is a variable passed to a function or class, and the injection function return the same type of entity like one
 * 
 */

const {errors, check} = require('../errors.js');

function injection(entity){
  check.error(new.target === true, errors.pattern_called_with_new({newtarget: new.target}).message);
  
}
module.exports = injection;
