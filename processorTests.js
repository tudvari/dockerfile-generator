const path = require('path')

const mocha = require('mocha')
const should = require('should')

const processor = require(path.resolve(__dirname + '/lib/processor'))

describe('ProcessorTests - Fragments', function() {

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
        processor.processAdd(params).should.equal('ADD src1 dest1\nADD src2 dest2\n')
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

    it('VOLUME - test', function() {
        processor.processVolumes(["/volume1", "/volume2"]).should.equal('VOLUME /volume1\nVOLUME /volume2\n')
    })

    it('SHELL - array', function() {
        processor.processShell(['test.shell', '-b', 'testparam']).should.equal('SHELL [ "test.shell", "-b", "testparam" ]')
    })
})

describe('ProcessorTests - determineTests', function(){

    it('determine - FROM', function(){
        let resp = processor.determineFunction('from')
        resp.name.should.equal('processFrom')
    })

    it('determine - RUN', function(){
        let resp = processor.determineFunction('run')
        resp.name.should.equal('processSingleRun')
    })

    it('determine - CMD', function(){
        let resp = processor.determineFunction('cmd')
        resp.name.should.equal('processSingleCmd')
    })

    it('determine - LABELS', function(){
        let resp = processor.determineFunction('labels')
        resp.name.should.equal('processLabels')
    })

    it('determine - ENV', function(){
        let resp = processor.determineFunction('env')
        let respType = typeof resp
        resp.name.should.equal('processEnvs')
    })

    it('determine - EXPOSE', function(){
        let resp = processor.determineFunction('expose')
        resp.name.should.equal('processExposes')
    })

    it('determine - ADD', function(){
        let resp = processor.determineFunction('add')
        resp.name.should.equal('processAdd')
    })

    it('determine - COPY', function(){
        let resp = processor.determineFunction('copy')
        resp.name.should.equal('processCopy')
    })

    it('determine - ENTRYPOINT', function(){
        let resp = processor.determineFunction('entrypoint')
        resp.name.should.equal('processEntryPoint')
    })

    it('determine - VOLUMES', function(){
        let resp = processor.determineFunction('volumes')
        resp.name.should.equal('processVolumes')
    })

    it('determine - USER', function(){
        let resp = processor.determineFunction('user')
        resp.name.should.equal('processUser')
    })

    it('determine - WORKING_DIR', function(){
        let resp = processor.determineFunction('working_dir')
        resp.name.should.equal('processWorkDir')
    })

    it('determine - ARGS', function(){
        let resp = processor.determineFunction('args')
        resp.name.should.equal('processArgs')
    })

    it('determine - STOPSIGNAL', function(){
        let resp = processor.determineFunction('stopsignal')
        resp.name.should.equal('processStopSignal')
    })

    it('determine - SHELL', function(){
        let resp = processor.determineFunction('shell')
        resp.name.should.equal('processShell')
    })
    
})
