/* global Promise, describe, it, __dirname, process, Reflect*/
const AMBIENTE = process.env.NODE_ENV;

const {expect, assert} = require('chai');

const {injection} = require(`../../index.js`);
const errors = require(`../../index.js`).ERRORS.message;

const t = {right_args: [function entity(dep, ...args){},
                        {apply(args){
                          return [{dep1: 'I am a dependency'}, ...args];
                        }},
                        {dep: 'dependency'}]};
Object.freeze(t);
module.exports.builder = t.right_args;


describe('Injection pattern', () => {
  it('right arguments dont throw error', function () {
    expect(()=>{injection(...t.right_args);}).to.not.throw();
  });
  describe('wrong arguments throws error', () => {
    const non_function_or_object = [0,-5,8,true, false, undefined, 'string'];
    for (let wrong of [...non_function_or_object]) {
      it('entity wrong type throws error', () => {
        let args = replaceArgumentByPosition(t.right_args, 1, wrong);
        expect(()=>{injection(...args);}).to.throw(errors.entity_wrong_type);
      });
      
    }
  });
  describe('injection with apply to function', () => {
    it.skip('inject args dependency', () => {
      
    });
    it.skip('inject this argument', () => {
      
    });
  });
});

function replaceArgumentByPosition(args_list, index, arg){
  assert(Array.isArray(args_list));
  index-=1;
  assert(index >= 0);
  let new_list;
  [...new_list] = args_list;
  new_list[index] = arg;
  return new_list;
  
}
