const path = require('path')

const mocha = require('mocha')
const should = require('should')

const Generator = require(path.resolve(__dirname + '/lib/generator'))

describe('GeneratorTests', function() { 

    it('Invalid JSON', function() {
        try {
            let generateResult = Generator.generateDockerFile({})
        }
        catch(error) {
            should.exists(error)
            should.equal(error.message, 'Input Validation error')
        }
    })

    it('Valid JSON', function() {
        let generateResult = Generator.generateDockerFile({ from: 'nginx:latest' })
        generateResult.should.equal('FROM nginx:latest\n')
    })

    it('Valid JSON - FROM, ARG', function() {
        let generateResult = Generator.generateDockerFile({ from: 'nginx:latest', args:["arg1", "arg2"] })
        generateResult.should.equal('FROM nginx:latest\nARG arg1\nARG arg2\n')
    })

    it('Valid JSON - FROM, CMD', function() {
        let generateResult = Generator.generateDockerFile({ from: 'nginx:latest', cmd:["test.cmd", "-b"] })
        generateResult.should.equal('FROM nginx:latest\nCMD [ "test.cmd", "-b" ]\n')
    })
})