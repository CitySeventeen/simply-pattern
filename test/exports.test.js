/* global Promise, describe, it, __dirname, process*/
const AMBIENTE = process.env.NODE_ENV;
const {expect, assert} = require('chai');

const errors = require(`../index.js`).ERRORS.message;

const export_patterns = require(`../index.js`).patterns;

const t = {patterns: ['injection'], builders: {}};
t.builders = require('./support.test.js').builder_for_pattern;

Object.freeze(t);


describe('Pattern exported', () => {
  for(let pat of t.patterns){
    it(`There is a ${pat} in the pattern exported`, () => {
      expect(export_patterns).to.have.property(pat);
    });
  }
  for(let pattern of t.patterns){
    let pattern_function = export_patterns[pattern];
    it(`Pattern ${pattern} is a function and doesnt work with new`, () => {
      expect(pattern_function).to.be.a('function');
      expect(()=>{pattern_function(t.builders[pattern]);}).to.throw(errors.pattern_called_with_new);;
    });
    
  }
});