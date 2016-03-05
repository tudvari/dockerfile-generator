'use strict' ;

let fs = require('fs');
let mocha = require('mocha');
let should = require('should');

let generator = require('./');

describe('dockerfile-generator', function() {

  it('Empty Array', function(done) {
    generator.generateIgnoreFile([], function(err, result) {
			should.not.exist(err) ;
			should.equal(result,'') ;
    });
    done() ;
  }) ;
	it('One Item in the Array', function(done) {
		generator.generateIgnoreFile(['node_modules'], function(err, result) {
			should.equal(result,'node_modules\n') ;
		});
		done() ;
	}) ;
	it('Multiple Item in the Array', function(done) {
		generator.generateIgnoreFile(['node_modules','.git'], function(err, result) {
			should.equal(result,'node_modules\n.git\n') ;
		});
		done() ;
	}) ;
});
