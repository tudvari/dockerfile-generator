const path = require('path')

const mocha = require('mocha')
const should = require('should')

const processor = require(path.resolve(__dirname + '/lib/processor'))

describe('ProcessorTests', function() {

    it('FROM test', function() {
        processor.processFrom('testFrom').should.equal('FROM testFrom')
    })

    it('RUN - string', function() {
        processor.processRun('test.run').should.equal('RUN [ "test.run" ]')
    })

    it('RUN - array', function() {
        processor.processRun(['test.run', '-b', 'testparam']).should.equal('RUN [ "test.run", "-b", "testparam" ]')
    })

    it('CMD - string', function() {
        processor.processCmd('test.cmd').should.equal('CMD [ "test.cmd" ]')
    })

    it('RUN - array', function() {
        processor.processCmd(['test.cmd', '-b', 'testparam']).should.equal('CMD [ "test.cmd", "-b", "testparam" ]')
    })

    it('LABEL - array', function() {
        let params = []
        params['key1'] = 'value1'
        params['key2'] = 'value2'
        processor.processLabels(params).should.equal('LABEL key1=value1\nLABEL key2=value2\n')
    })

    it('LABEL - object', function() {
        let params = {
            key1: 'value1',
            key2: 'value2'
        }
        processor.processLabels(params).should.equal('LABEL key1=value1\nLABEL key2=value2\n')
    })

    it('ENV - array', function() {
        let params = []
        params['key1'] = 'value1'
        params['key2'] = 'value2'
        processor.processEnvs(params).should.equal('ENV key1=value1\nENV key2=value2\n')
    })

    it('ENV - object', function() {
        let params = {
            key1: 'value1',
            key2: 'value2'
        }
        processor.processEnvs(params).should.equal('ENV key1=value1\nENV key2=value2\n')
    })

})
