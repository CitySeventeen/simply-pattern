/* global Reflect */
const {errors, check} = require('./errors.js');

function chooseTrapWithNewArgsList(metodo, args_list_callback){
  const ending_of_trap_list = {
     apply(target, thisArg, args){
       let args_list = args_list_callback(...args);
       check.error(Array.isArray(args_list), errors.wrong_list_returned_by_trap(args_list));
       return Reflect.apply(target, thisArg, args_list);},
     construct(target, args, newtarget){
       let args_list = args_list_callback(...args);
       check.error(Array.isArray(args_list), errors.wrong_list_returned_by_trap(args_list));
       return Reflect.construct(target, args_list, newtarget);}
  };
  let ending_trap = ending_of_trap_list[metodo];
  check.error(ending_trap !== undefined, errors.wrong_trap_name(metodo));
  return ending_trap;
}

module.exports = chooseTrapWithNewArgsList;
