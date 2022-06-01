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
  const handler_for_inject_dep = buildRecursive(chooseTrapWithNewArgsList, handler);
  return handler_for_inject_dep;
}

function buildRecursive(chooseTrap, handler){
  const handler_for_inject_dep = {};

  for(let trap_name in handler){
    handler_for_inject_dep[trap_name] = [];
    let args_list_callback = handler[trap_name];
    if(!Array.isArray(args_list_callback))
       handler_for_inject_dep[trap_name].push(assignCallbackForTrap(args_list_callback, trap_name, chooseTrap, buildRecursive));
    else{
      for(let element of args_list_callback)
        handler_for_inject_dep[trap_name].push(assignCallbackForTrap(element, trap_name, chooseTrap, buildRecursive));
    }
  }
  return handler_for_inject_dep;
}

function assignCallbackForTrap(handler_or_callback, trap_name, chooseTrap, functionRecursive){
  check.assert(!Array.isArray(handler_or_callback));
  if(typeof handler_or_callback === 'object')
     return functionRecursive(chooseTrap, handler_or_callback);
  else if(typeof handler_or_callback === 'function')
    return chooseTrap(trap_name, handler_or_callback);
  else throw errors.wrong_element_in_handler(handler_or_callback);;
}

module.exports = injection;


const where_inject_cb = {
  FIRSTDEP: (...dep)=>{return {    apply(...args){return [...dep, ...args];},
                            construct(...args){return [...dep, ...args];}};}
};

for(let cb_name in where_inject_cb){
  module.exports[cb_name] = where_inject_cb[cb_name];
}
