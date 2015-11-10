'use strict' ;

let fs = require('fs');
let mocha = require('mocha');
let should = require('should');

let generator = require('./');

describe('dockerfile-generator', function() {

  it('Invalid JSON', function(done) {
    generator.generate(fs.readFileSync('./tests/1_unparsable_input.json'), function(err, result) {
      should.exist(err) ;
    });
    done() ;
  }) ;
  it('ImageName and imageVersion exist', function(done) {
    generator.generate(fs.readFileSync('./tests/2_parsable_input_from.json'), function(err, result) {
      should.not.exist(err) ;
      should.equal(result, 'FROM node:4.1.2') ;
    });
    done() ;
  }) ;
  it('ImageName does not exist', function(done) {
    generator.generate(fs.readFileSync('./tests/3_parsable_input_imagename_missing.json'), function(err, result) {
      should.exist(err) ;
    });
    done() ;
  }) ;
  it('ImageVersion does not exist', function(done) {
    generator.generate(fs.readFileSync('./tests/4_parsable_input_imageversion_missing.json'), function(err, result) {
      should.exist(err) ;
    });
    done() ;
  }) ;
  it('ImageName and imageVersion are missing', function(done) {
    generator.generate(fs.readFileSync('./tests/5_parsable_input_imageinfos_missing.json'), function(err, result) {
      should.exist(err) ;
      should.equal(err.message, 'Input JSON has a semantic error!') ;
    });
    done() ;
  }) ;
});
