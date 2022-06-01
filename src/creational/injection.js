/*
 * Based on Dependency Injection pattern of Nodejs Design pattern
 * A dependency is a variable passed to a function or class, and the injection function return the same type of entity like one
 * 
 */

/* global new.target */
const {ProxyExtension} = require('proxy-tracker');

const {errors, check} = require('../errors.js');

function injection(entity, where_inject, ...dependencies){
  check.error(new.target === undefined, errors.pattern_called_with_new({newtarget: new.target}).message);
  checkArgs(entity, where_inject, dependencies);
  
  const handler = buildHandlerForProxy(where_inject, dependencies); 
  
  return new ProxyExtension(entity, handler);
}
function checkArgs(entity, where_inject, dependencies){
  check.error(typeof entity === 'object' || typeof entity === 'function', errors.entity_wrong_type(entity));  
  check.error(typeof where_inject === 'function' || typeof where_inject === 'object' && !Array.isArray(where_inject), errors.whereinject_wrong_type(where_inject));
  check.error(    isArrayEmpty(dependencies) && typeof where_inject === 'object'
              || !isArrayEmpty(dependencies) && typeof where_inject === 'function', errors.dependency_whereinject_wrong_type(where_inject));
}
function isArrayEmpty(array){
  return array.length === 0;
}
function buildHandlerForProxy(where_inject, dependencies){
  const chooseTrapWithNewArgsList = require('../traps_list.js');
  let handler;
  if(isArrayEmpty(dependencies)) handler = where_inject;
  else handler = where_inject(...dependencies);
  const handler_for_inject_dep = {};
  for(let trap_name in handler){
    let args_list_callback = handler[trap_name];
    handler_for_inject_dep[trap_name] = chooseTrapWithNewArgsList(trap_name, args_list_callback);
  }
  return handler_for_inject_dep;
}

module.exports = injection;
