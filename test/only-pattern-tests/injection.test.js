/* global Promise, describe, it, __dirname, process*/
const AMBIENTE = process.env.NODE_ENV;

const {expect, assert} = require('chai');

const export_patterns = require(`../../index.js`);

const t = {arg_builder: []};
Object.freeze(t);
module.exports.builder = t.arg_builder;


describe('Injection pattern', () => {

});
