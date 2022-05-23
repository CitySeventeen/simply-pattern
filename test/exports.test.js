/* global Promise, describe, it, __dirname, process*/
const AMBIENTE = process.env.NODE_ENV;

const {expect, assert} = require('chai');

const export_patterns = require(`../index.js`);

const t = {patterns: ['injection']};
Object.freeze(t);


describe('Pattern exported', () => {
  for(let pat of t.patterns){
    it(`There is a ${pat} in the pattern exported`, () => {
      expect(export_patterns).to.have.property(pat);
    });
  }
});