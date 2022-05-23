/* global Promise, describe, it, __dirname, process*/
const AMBIENTE = process.env.NODE_ENV;

const {expect, assert} = require('chai');

const DIRNAME_PATTER_TEST = __dirname.concat('/only-pattern-tests/');
const t = {list_files: retrieveFilesName(DIRNAME_PATTER_TEST), pattern: {}};
for(let file of t.list_files){
  t.pattern[file] = require(DIRNAME_PATTER_TEST.concat(file));
}
console.dir(t);
Object.freeze(t);


describe('Assurance that test settings are ok', () => {
  it('Each test exports a setting for build a pattern', () => {
    expect(t.pattern).to.not.eql({});
    for(let test in t.pattern){
      let exports_file = t.pattern[test];
      expect(exports_file).to.have.property('builder');
      expect(exports_file.builder).to.be.an('array');
    }
  });
});

function retrieveFilesName(path){
  const fs = require('fs');
  const list_all = fs.readdirSync(path, {withFileTypes: true});
  const list_files = list_all.filter(elem => {
    let type = Object.getOwnPropertySymbols(elem)[0]; return elem[type] === 1;
  });
  console.dir(list_files);
  const only_names = list_files.map(elem => {return elem.name;});
  return only_names;
}
