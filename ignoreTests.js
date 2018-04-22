const fs = require('fs')
const mocha = require('mocha')
const should = require('should')

const generator = require('./')

describe('.dockerignore generate tests', function () {

  it('Empty Array', async function () {
    let resp = await generator.generateIgnoreFile([])
		should.equal(resp,'')
	})
	
	it('One Item in the Array', async function () {
		let resp = await generator.generateIgnoreFile(['node_modules'])
		should.equal(resp,'node_modules\n')
	})

	it('Multiple Item in the Array', async function () {
		let resp = await generator.generateIgnoreFile(['node_modules','.git'])
		should.equal(resp,'node_modules\n.git\n')
	})

})
