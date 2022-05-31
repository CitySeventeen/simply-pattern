/*
 * Based on Dependency Injection pattern of Nodejs Design pattern
 * A dependency is a variable passed to a function or class, and the injection function return the same type of entity like one
 * 
 */

/* global new.target */

const {errors, check} = require('../errors.js');

function injection(entity, where_inject, dependencies){
  check.error(new.target === undefined, errors.pattern_called_with_new({newtarget: new.target}).message);
  checkArgs(entity, where_inject, dependencies);
}

function checkArgs(entity, where_inject, dependencies){
  check.error(typeof entity === 'object' || typeof entity === 'function', errors.entity_wrong_type(entity));  
  check.error(typeof where_inject === 'object' && !Array.isArray(where_inject), errors.whereinject_wrong_type(where_inject));
  check.error(typeof dependencies === 'object' && !Array.isArray(dependencies), errors.dependency_wrong_type(dependencies));
}
module.exports = injection;
