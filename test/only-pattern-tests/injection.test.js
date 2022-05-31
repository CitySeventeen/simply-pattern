/* global Promise, describe, it, __dirname, process, Reflect*/
const AMBIENTE = process.env.NODE_ENV;

const {expect, assert} = require('chai');

const {injection} = require(`../../index.js`);
const errors = require(`../../index.js`).ERRORS.message;

const t = {right_args_without_dep: [function entity(dep, ...args){},
                                    {apply(args){
                                      return [{dep1: 'I am a dependency'}, ...args];
                                    }}],
              right_args_with_dep:  [function entity(dep, ...args){},
                                    function whereInject(dep){return {apply(args){
                                      return [...dep, ...args];
                                    }};},
                                    {dep: 'dependency'},
                                    'dep2']};
Object.freeze(t);
module.exports.builder = t.right_args_without_dep;


describe('Injection pattern', () => {
  it('right arguments without dep dont throw error', function () {
    expect(()=>{injection(...t.right_args_without_dep);}).to.not.throw();
  });
  it('right arguments with dep dont throw error', function () {
    expect(()=>{injection(...t.right_args_with_dep);}).to.not.throw();
  });
  it('right arguments with dep of any types dont throw error', () => {
    const any_types = [0,-5,8,true, false, undefined, 'string', function(){}, [], String, Number, {}, Object, Array];
    for(let arg_dep of any_types){
      let args = replaceArgumentByPosition(t.right_args_with_dep, 3, arg_dep);
      expect(()=>{injection(...args);}).to.not.throw();
    }
  });
  describe('wrong arguments throws error', () => {
    const non_function_or_object = [0,-5,8,true, false, undefined, 'string'];
    for (let wrong of [...non_function_or_object]) {
      it('entity wrong type throws error', () => {
        let args = replaceArgumentByPosition(t.right_args_without_dep, 1, wrong);
        expect(()=>{injection(...args);}).to.throw(errors.entity_wrong_type);
      });
    }
    for (let wrong of [...non_function_or_object]) {
      it('where_inject wrong type with dependencies not present throws error', () => {
        let args = replaceArgumentByPosition(t.right_args_without_dep, 2, wrong);
        expect(()=>{injection(...args);}).to.throw(errors.whereinject_wrong_type);
      });
    }

    it('where_inject wrong type with dependencies present throws error', () => {
      let args = replaceArgumentByPosition(t.right_args_with_dep, 2, {});
      expect(()=>{injection(...args);}).to.throw(errors.dependency_whereinject_wrong_type);
    });
    
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
