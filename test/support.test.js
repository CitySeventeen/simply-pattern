/* global Promise, describe, it, __dirname, process*/
const AMBIENTE = process.env.NODE_ENV;

const {expect, assert} = require('chai');

const DIRNAME_PATTER_TEST = __dirname.concat('/only-pattern-tests/');
const t = {list_test_files: retrieveFilesName(DIRNAME_PATTER_TEST), builder_for_pattern: {}};
for(let file of t.list_test_files){
  let pattern_name = retrievePatternNameFromFileTestName(file);
  t.builder_for_pattern[pattern_name] = require(DIRNAME_PATTER_TEST.concat(file));
}
module.exports.builder_for_pattern = t.builder_for_pattern;
Object.freeze(t);


describe('Assurance that test settings are ok', () => {
  it('Each test exports a setting for build a pattern', () => {
    expect(t.builder_for_pattern).to.not.eql({});
    for(let test in t.builder_for_pattern){
      let exports_file = t.builder_for_pattern[test];
      expect(exports_file).to.have.property('builder');
      expect(exports_file.builder).to.be.an('array');
    }
  });
  it('Each test file in only-pattern-tests has a <name-pattern>.test.js format', () => {
    expect(t.list_test_files).to.not.eql([]);
    for(let file of t.list_test_files){
      expect(file).to.have.string('.test.js');
      expect(file.replace('.test.js', '')).to.not.have.string('.');
    }
  });
});

function retrieveFilesName(path){
  const fs = require('fs');
  const list_all = fs.readdirSync(path, {withFileTypes: true});
  const list_files = list_all.filter(elem => {
    let type = Object.getOwnPropertySymbols(elem)[0]; return elem[type] === 1;
  });
  const only_names = list_files.map(elem => {return elem.name;});
  return only_names;
}

function retrievePatternNameFromFileTestName(test_file_name){
  return test_file_name.replace('.test.js', '');
}
