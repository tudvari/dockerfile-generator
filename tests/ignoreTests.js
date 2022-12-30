const should = require('should')
const { describe, it } = require('mocha')

const generator = require('../index.js')

describe('.dockerignore generate tests', () => {
	it('Empty Array', async () => {
		const resp = await generator.generateIgnoreFile([])
		should.equal(resp, '')
	})

	it('One Item in the Array', async () => {
		const resp = await generator.generateIgnoreFile(['node_modules'])
		should.equal(resp, 'node_modules\n')
	})

	it('Multiple Item in the Array', async () => {
		const resp = await generator.generateIgnoreFile(['node_modules', '.git'])
		should.equal(resp, 'node_modules\n.git\n')
	})
})
