'use strict' ;

let fs = require('fs');
let mocha = require('mocha');
let should = require('should');

let generator = require('./');

describe('compare tests', function() {

  it('convertToJSON', function(done) {
    generator.convertToJSON(fs.createReadStream('./tests/all_element_test.out'), function(err, result) {
      should.not.exist(err) ;
    });
    done() ;
  }) ;

});
