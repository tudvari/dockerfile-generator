const path = require('path');

const processor = require(path.resolve(__dirname + '/lib/dockerProcessor'));

describe('DockerProcessorTests - Fragments', () => {
  it('FROM test', () => {
    processor.processFrom({ baseImage: 'testFrom' }).should.equal('FROM testFrom');
  });

  it('FROM test with alias', () => {
    processor.processFrom({ baseImage: 'testFrom', alias: 'myalias' }).should.equal('FROM testFrom AS myalias');
  });

  it('RUN - string', () => {
    processor.processRun('test.run').should.equal('RUN [ "test.run" ]');
  });

  it('RUN - array', () => {
    processor.processRun(['test.run', '-b', 'testparam']).should.equal('RUN [ "test.run", "-b", "testparam" ]');
  });

  it('CMD - string', () => {
    processor.processCmd('test.cmd').should.equal('CMD [ "test.cmd" ]');
  });

  it('RUN - array', () => {
    processor.processCmd(['test.cmd', '-b', 'testparam']).should.equal('CMD [ "test.cmd", "-b", "testparam" ]');
  });

  it('LABEL - array', () => {
    const params = [];
    params.key1 = 'value1';
    params.key2 = 'value2';
    processor.processLabels(params).should.equal('LABEL key1=value1\nLABEL key2=value2');
  });

  it('LABEL - object', () => {
    const params = {
      key1: 'value1',
      key2: 'value2',
    };
    processor.processLabels(params).should.equal('LABEL key1=value1\nLABEL key2=value2');
  });

  it('ENV - array', () => {
    const params = [];
    params.key1 = 'value1';
    params.key2 = 'value2';
    processor.processEnvs(params).should.equal('ENV key1=value1\nENV key2=value2');
  });

  it('ENV - object', () => {
    const params = {
      key1: 'value1',
      key2: 'value2',
    };
    processor.processEnvs(params).should.equal('ENV key1=value1\nENV key2=value2');
  });

  it('EXPOSE - test', () => {
    processor.processExposes(['80/tcp', '8080']).should.equal('EXPOSE 80/tcp\nEXPOSE 8080');
  });

  it('ADD - array', () => {
    const params = [];
    params.src1 = 'dest1';
    params.src2 = 'dest2';
    processor.processAdd(params).should.equal('ADD src1 dest1\nADD src2 dest2');
  });

  it('COPY - array', () => {
    const params = [];
    params.src1 = 'dest1';
    params.src2 = 'dest2';
    processor.processCopy(params).should.equal('COPY src1 dest1\nCOPY src2 dest2');
  });

  it('COPY - array with from', () => {
    const params = [];
    params.src1 = 'dest1';
    params.src2 = 'dest2';
    params.from = '1';
    processor.processCopy(params).should.equal('COPY --from=1 src1 dest1\nCOPY --from=1 src2 dest2');
  });

  it('ENTRYPOINT - string', () => {
    processor.processEntryPoint('test.entrypoint').should.equal('ENTRYPOINT [ "test.entrypoint" ]');
  });

  it('ENTRYPOINT - array', () => {
    processor.processEntryPoint(['test.entrypoint', '-b', 'testparam']).should.equal('ENTRYPOINT [ "test.entrypoint", "-b", "testparam" ]');
  });

  it('USER test', () => {
    processor.processUser('testuser').should.equal('USER testuser');
  });

  it('WORKDIR test', () => {
    processor.processWorkDir('/home/work').should.equal('WORKDIR /home/work');
  });

  it('STOPSIGNAL test', () => {
    processor.processStopSignal('signal').should.equal('STOPSIGNAL signal');
  });

  it('ARG - test', () => {
    processor.processArgs(['arg1', 'arg2']).should.equal('ARG arg1\nARG arg2');
  });

  it('VOLUME - test', () => {
    processor.processVolumes(['/volume1', '/volume2']).should.equal('VOLUME /volume1\nVOLUME /volume2');
  });

  it('SHELL - array', () => {
    processor.processShell(['test.shell', '-b', 'testparam']).should.equal('SHELL [ "test.shell", "-b", "testparam" ]');
  });

  it('COMMENT - string', () => {
    processor.processComment('Some Value').should.equal('# Some Value');
  });
});

describe('DockerProcessorTests - determineTests', () => {
  it('determine - FROM', () => {
    const resp = processor.determineFunction('from');
    resp.name.should.equal('processFrom');
  });

  it('determine - FROM with counter', () => {
    const resp = processor.determineFunction('from-1');
    resp.name.should.equal('processFrom');
  });

  it('determine - RUN', () => {
    const resp = processor.determineFunction('run');
    resp.name.should.equal('processSingleRun');
  });

  it('determine - CMD', () => {
    const resp = processor.determineFunction('cmd');
    resp.name.should.equal('processSingleCmd');
  });

  it('determine - LABELS', () => {
    const resp = processor.determineFunction('labels');
    resp.name.should.equal('processLabels');
  });

  it('determine - ENV', () => {
    const resp = processor.determineFunction('env');
    resp.name.should.equal('processEnvs');
  });

  it('determine - EXPOSE', () => {
    const resp = processor.determineFunction('expose');
    resp.name.should.equal('processExposes');
  });

  it('determine - ADD', () => {
    const resp = processor.determineFunction('add');
    resp.name.should.equal('processAdd');
  });

  it('determine - COPY', () => {
    const resp = processor.determineFunction('copy');
    resp.name.should.equal('processCopy');
  });

  it('determine - ENTRYPOINT', () => {
    const resp = processor.determineFunction('entrypoint');
    resp.name.should.equal('processEntryPoint');
  });

  it('determine - VOLUMES', () => {
    const resp = processor.determineFunction('volumes');
    resp.name.should.equal('processVolumes');
  });

  it('determine - USER', () => {
    const resp = processor.determineFunction('user');
    resp.name.should.equal('processUser');
  });

  it('determine - WORKING_DIR', () => {
    const resp = processor.determineFunction('working_dir');
    resp.name.should.equal('processWorkDir');
  });

  it('determine - ARGS', () => {
    const resp = processor.determineFunction('args');
    resp.name.should.equal('processArgs');
  });

  it('determine - STOPSIGNAL', () => {
    const resp = processor.determineFunction('stopsignal');
    resp.name.should.equal('processStopSignal');
  });

  it('determine - SHELL', () => {
    const resp = processor.determineFunction('shell');
    resp.name.should.equal('processShell');
  });

  it('determine - COMMENT', () => {
    const resp = processor.determineFunction('comment');
    resp.name.should.equal('processComment');
  });
});
