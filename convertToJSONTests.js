'use strict' ;

let fs = require('fs');
let mocha = require('mocha');
let should = require('should');

let generator = require('./');

describe('convertToJSON', function() {

  it('convertToJSON', function(done) {
    let expected = fs.readFileSync('./tests/all_element_test_input.json');
    generator.convertToJSON(fs.createReadStream('./tests/all_element_test.out'), function(err, result) {
      should.not.exist(err) ;      
      should.equal(JSON.stringify(JSON.parse(expected.toString())),JSON.stringify(result));
      done() ;
    });
  }) ;
});
