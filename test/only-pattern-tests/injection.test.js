/* global Promise, describe, it, __dirname, process, Reflect*/
const AMBIENTE = process.env.NODE_ENV;
const util = require('util');

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
                                    'dep2'],
              args_for_construct_dependencies: [class user_class{
                                                              constructor(...args){this.arg_construct = args;}
                                                              static method(...args){args;}
                                                          },
                                                          {construct(...args){return ['dip3', 'dip4', ...args];}}
                                                          ],
              args_for_apply_dependencies: [function user_function(...args){
                                                              return args;
                                                          },
                                                          {apply(...args){return ['dip1', 'dip2', ...args];}}
                                                          ],   
              args_for_nested_trap_dependencies: [class user_class{
                                                              constructor(...args){this.arg_construct = args;}
                                                              static method(...args){return args;}
                                                          },
                                                          {construct(...args){return ['dip3', 'dip4', ...args];},
                                                           get: {apply(...args){return ['dip1', 'dip2', ...args];}}}
                                                          ]
          };
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
  it('entity returned by injection function is a proxy', () => {
    expect(util.types.isProxy(injection(...t.args_for_apply_dependencies))).to.be.true;
  });
  it('constructor trap in proxy doesnt return proxy', () => {
    let entity_proxy = injection(...t.args_for_construct_dependencies);
    expect(util.types.isProxy(entity_proxy)).to.be.true;
    expect(util.types.isProxy(new entity_proxy())).to.be.false;
  });
  it('apply trap in proxy doesnt return proxy', () => {
    let entity_proxy = injection(...t.args_for_apply_dependencies);
    expect(util.types.isProxy(entity_proxy)).to.be.true;
    expect(util.types.isProxy(entity_proxy())).to.be.false;
  });
  it('get trap for the specific handler returns a proxy', () => {
     let entity_proxy = injection(...t.args_for_nested_trap_dependencies);
    expect(util.types.isProxy(entity_proxy)).to.be.true;
    expect(util.types.isProxy(entity_proxy.method)).to.be.true;
  });
  it('constructor trap insert args in the order previously specified', () => {
    let entity_proxy = injection(...t.args_for_construct_dependencies);
    let instance = new entity_proxy('arg3', 'arg4');
    expect(instance.arg_construct).to.eql(['dip3', 'dip4', 'arg3', 'arg4']);
  });
  it('apply trap insert args in the order previously specified', () => {
    let entity_proxy = injection(...t.args_for_apply_dependencies);
    expect(entity_proxy('arg1', 'arg2')).to.eql(['dip1', 'dip2', 'arg1', 'arg2']);
  });
  it('nested trap apply after get insert args in the order previously specified', () => {
    let entity_proxy = injection(...t.args_for_nested_trap_dependencies);
    expect(entity_proxy.method('arg1', 'arg2')).to.eql(['dip1', 'dip2', 'arg1', 'arg2']);
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

    it('where_inject wrong type with dependencies presents throw error', () => {
      let args = replaceArgumentByPosition(t.right_args_with_dep, 2, {});
      expect(()=>{injection(...args);}).to.throw(errors.dependency_whereinject_wrong_type);
    });
    describe('wrong value returned by trap in where_inject throws error', () => {
      for(let wrong of [0,-5,8,true, false, {}, 'string', function(){}])
        it('trap in where_inject return ${wrong} -> error', () => {
          const where_inject = {apply(args){return wrong;}};
          const entity_with_dependency_injected = injection(function(){}, where_inject);
          expect(()=>{entity_with_dependency_injected('arg1', 'arg2');}).to.throw(errors.wrong_list_returned_by_trap);
        });
    });
    describe('where inject with wrong element', () => {
      it('trap name that is a sub handler doesnt throw error', () => {
        expect(()=>{injection(function(){}, {get: {apply(...args){return ['dip1', 'dip2', ...args];}}});}).to.not.throw();
      });
      it('callback trap different from apply or construct throws error', () => {
        expect(()=>{injection(function(){}, {thisTrapDoesntExist(...args){return ['dip1', ...args];}});}).to.throw(errors.wrong_trap_name);
        expect(()=>{injection(function(){}, {get(...args){return ['dip1', ...args];}});}).to.throw(errors.wrong_trap_name);
      });
      it.skip('more of one callback customed for trap name throws error', () => {
        
      });
      it.skip('more same subhandler for trap name doesnt throw error', () => {
        
      });
    });
  });
  describe('default callback for wher_inject', () => {
    const returnArguments = function(...args){return args;};
    it('first dep', () => {
      let value_with_injected = injection(returnArguments, injection.FIRSTDEP, 'dep1', 'dep2');
      expect(value_with_injected('arg1', 'arg2', 'arg3')).to.eql(['dep1', 'dep2', 'arg1', 'arg2', 'arg3']);
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
