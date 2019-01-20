const path = require('path')
const Stream = require('stream')

const mocha = require('mocha')
const should = require('should')

const jsonGenerator = require(path.resolve(__dirname + '/lib/jsonGenerator'))

describe.skip('JSONGenerator Tests', function() { 

    it('Valid Dockerfile - FROM ', async function() {

        let buf = Buffer.from('FROM nginx:latest\n');
        let bufferStream = new Stream.PassThrough();
        bufferStream.end(buf);

        let generateResult = await jsonGenerator.generateJSON(bufferStream)
        generateResult.should.eql({ from: 'nginx:latest' })
    })

    it('Valid JSON - FROM, CMD Array', async function() {
        
        let buf = Buffer.from('FROM nginx:latest\nCMD [ "test.cmd", "-b" ]\nCMD [ "test2.cmd", "-b2" ]\n');
        let bufferStream = new Stream.PassThrough();
        bufferStream.end(buf);

        let generateResult = await jsonGenerator.generateJSON(bufferStream)
        generateResult.should.eql({from: 'nginx:latest', cmd: ["test.cmd", "-b", "test2.cmd", "-b2"]})
    })

    it('Valid JSON - FROM, ENV', async function() {
        
        let buf = Buffer.from('FROM nginx:latest\nENV env1=value1\nENV env2=value2\n');
        let bufferStream = new Stream.PassThrough();
        bufferStream.end(buf);

        let generateResult = await jsonGenerator.generateJSON(bufferStream)
        
        let env = {}
        env['env1'] = 'value1'
        env['env2'] = 'value2'

        let resp = {}
        resp['from'] = 'nginx:latest'
        resp['env'] = env

        generateResult.should.eql(resp)
    })
})