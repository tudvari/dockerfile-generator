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

    it('EXPOSE - test', function() {
        processor.processExposes(["80/tcp", "8080"]).should.equal('EXPOSE 80/tcp\nEXPOSE 8080\n')
    })

    it('ADD - array', function() {
        let params = []
        params['src1'] = 'dest1'
        params['src2'] = 'dest2'
        processor.processAnd(params).should.equal('ADD src1 dest1\nADD src2 dest2\n')
    })

    it('COPY - array', function() {
        let params = []
        params['src1'] = 'dest1'
        params['src2'] = 'dest2'
        processor.processCopy(params).should.equal('COPY src1 dest1\nCOPY src2 dest2\n')
    })

    it('ENTRYPOINT - string', function() {
        processor.processEntryPoint('test.entrypoint').should.equal('ENTRYPOINT [ "test.entrypoint" ]')
    })

    it('ENTRYPOINT - array', function() {
        processor.processEntryPoint(['test.entrypoint', '-b', 'testparam']).should.equal('ENTRYPOINT [ "test.entrypoint", "-b", "testparam" ]')
    })

    it('USER test', function() {
        processor.processUser('testuser').should.equal('USER testuser')
    })

    it('WORKDIR test', function() {
        processor.processWorkDir('/home/work').should.equal('WORKDIR /home/work')
    })

    it('STOPSIGNAL test', function() {
        processor.processStopSignal('signal').should.equal('STOPSIGNAL signal')
    })

    it('ARG - test', function() {
        processor.processArgs(["arg1", "arg2"]).should.equal('ARG arg1\nARG arg2\n')
    })
})
