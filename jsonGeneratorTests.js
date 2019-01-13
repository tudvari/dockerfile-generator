const path = require('path')
const Stream = require('stream')

const mocha = require('mocha')
const should = require('should')

const jsonGenerator = require(path.resolve(__dirname + '/lib/jsonGenerator'))

describe('JSONGenerator Tests', function() { 

    it('Valid Dockerfile - FROM ', async function() {

        let buf = Buffer.from('FROM nginx:latest\n');
        let bufferStream = new Stream.PassThrough();
        bufferStream.end(buf);

        let generateResult = await jsonGenerator.generateJSON(bufferStream)
        generateResult.should.eql({ from: 'nginx:latest' })
    })

    it.skip('Valid JSON - FROM, ARG', function() {
        let generateResult = jsonGenerator.generateDockerFile({ from: 'nginx:latest', args:["arg1", "arg2"] })
        generateResult.should.equal('FROM nginx:latest\nARG arg1\nARG arg2\n')
    })

    it.skip('Valid JSON - FROM, CMD', function() {
        let generateResult = jsonGenerator.generateDockerFile({ from: 'nginx:latest', cmd:["test.cmd", "-b"] })
        generateResult.should.equal('FROM nginx:latest\nCMD [ "test.cmd", "-b" ]\n')
    })
})