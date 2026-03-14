/* eslint-disable max-len */
const {describe, it, expect} = require('@jest/globals');

const processor = require('../lib/dockerProcessor');

describe('DockerProcessorTests - Fragments', () => {
  it('FROM test', () => {
    expect(processor.processFrom({baseImage: 'testFrom'})).toEqual('FROM testFrom');
  });

  it('FROM test with alias', () => {
    expect(processor.processFrom({baseImage: 'testFrom', alias: 'myalias'})).toEqual('FROM testFrom AS myalias');
  });

  it('RUN - string', () => {
    expect(processor.processRun('test.run')).toEqual('RUN [ "test.run" ]');
  });

  it('RUN - array', () => {
    expect(processor.processRun(['test.run', '-b', 'testparam'])).toEqual('RUN [ "test.run", "-b", "testparam" ]');
  });

  it('CMD - string', () => {
    expect(processor.processCmd('test.cmd')).toEqual('CMD [ "test.cmd" ]');
  });

  it('RUN - array', () => {
    expect(processor.processCmd(['test.cmd', '-b', 'testparam'])).toEqual('CMD [ "test.cmd", "-b", "testparam" ]');
  });

  it('LABEL - array', () => {
    const params = [];
    params.key1 = 'value1';
    params.key2 = 'value2';
    expect(processor.processLabels(params)).toEqual('LABEL key1=value1\nLABEL key2=value2');
  });

  it('LABEL - object', () => {
    const params = {
      key1: 'value1',
      key2: 'value2',
    };
    expect(processor.processLabels(params)).toEqual('LABEL key1=value1\nLABEL key2=value2');
  });

  it('ENV - array', () => {
    const params = [];
    params.key1 = 'value1';
    params.key2 = 'value2';
    expect(processor.processEnvs(params)).toEqual('ENV key1=value1\nENV key2=value2');
  });

  it('ENV - object', () => {
    const params = {
      key1: 'value1',
      key2: 'value2',
    };
    expect(processor.processEnvs(params)).toEqual('ENV key1=value1\nENV key2=value2');
  });

  it('EXPOSE - test', () => {
    expect(processor.processExposes(['80/tcp', '8080'])).toEqual('EXPOSE 80/tcp\nEXPOSE 8080');
  });

  it('ADD - array', () => {
    const params = [];
    params.src1 = 'dest1';
    params.src2 = 'dest2';
    expect(processor.processAdd(params)).toEqual('ADD src1 dest1\nADD src2 dest2');
  });

  it('ADD - object', () => {
    const params = {};
    params.src1 = 'dest1';
    params.src2 = 'dest2';
    expect(processor.processAdd(params)).toEqual('ADD src1 dest1\nADD src2 dest2');
  });

  it('COPY - array', () => {
    const params = [];
    params.src1 = 'dest1';
    params.src2 = 'dest2';
    expect(processor.processCopy(params)).toEqual('COPY src1 dest1\nCOPY src2 dest2');
  });

  it('COPY - array with from', () => {
    const params = [];
    params.src1 = 'dest1';
    params.src2 = 'dest2';
    params.from = '1';
    expect(processor.processCopy(params)).toEqual('COPY --from=1 src1 dest1\nCOPY --from=1 src2 dest2');
  });

  it('ENTRYPOINT - string', () => {
    expect(processor.processEntryPoint('test.entrypoint')).toEqual('ENTRYPOINT [ "test.entrypoint" ]');
  });

  it('ENTRYPOINT - array', () => {
    expect(processor.processEntryPoint(['test.entrypoint', '-b', 'testparam'])).toEqual('ENTRYPOINT [ "test.entrypoint", "-b", "testparam" ]');
  });

  it('USER test', () => {
    expect(processor.processUser('testuser')).toEqual('USER testuser');
  });

  it('WORKDIR test', () => {
    expect(processor.processWorkDir('/home/work')).toEqual('WORKDIR /home/work');
  });

  it('STOPSIGNAL test', () => {
    expect(processor.processStopSignal('signal')).toEqual('STOPSIGNAL signal');
  });

  it('ARG - test', () => {
    expect(processor.processArgs(['arg1', 'arg2'])).toEqual('ARG arg1\nARG arg2');
  });

  it('VOLUME - test', () => {
    expect(processor.processVolumes(['/volume1', '/volume2'])).toEqual('VOLUME /volume1\nVOLUME /volume2');
  });

  it('SHELL - array', () => {
    expect(processor.processShell(['test.shell', '-b', 'testparam'])).toEqual('SHELL [ "test.shell", "-b", "testparam" ]');
  });

  it('COMMENT - string', () => {
    expect(processor.processComment('Some Value')).toEqual('# Some Value');
  });
});

describe('DockerProcessorTests - determineTests', () => {
  it('determine - FROM', () => {
    expect(processor.determineFunction('from').name).toEqual('processFrom');
  });

  it('determine - FROM with counter', () => {
    expect(processor.determineFunction('from-1').name).toEqual('processFrom');
  });

  it('determine - RUN', () => {
    expect(processor.determineFunction('run').name).toEqual('processSingleRun');
  });

  it('determine - CMD', () => {
    expect(processor.determineFunction('cmd').name).toEqual('processSingleCmd');
  });

  it('determine - LABELS', () => {
    expect(processor.determineFunction('labels').name).toEqual('processLabels');
  });

  it('determine - ENV', () => {
    expect(processor.determineFunction('env').name).toEqual('processEnvs');
  });

  it('determine - EXPOSE', () => {
    expect(processor.determineFunction('expose').name).toEqual('processExposes');
  });

  it('determine - ADD', () => {
    expect(processor.determineFunction('add').name).toEqual('processAdd');
  });

  it('determine - COPY', () => {
     expect(processor.determineFunction('copy').name).toEqual('processCopy');
  });

  it('determine - ENTRYPOINT', () => {
    expect(processor.determineFunction('entrypoint').name).toEqual('processEntryPoint');
  });

  it('determine - VOLUMES', () => {
    expect(processor.determineFunction('volumes').name).toEqual('processVolumes');
  });

  it('determine - USER', () => {
    expect(processor.determineFunction('user').name).toEqual('processUser');
  });

  it('determine - WORKING_DIR', () => {
    expect(processor.determineFunction('working_dir').name).toEqual('processWorkDir');
  });

  it('determine - ARGS', () => {
    expect(processor.determineFunction('args').name).toEqual('processArgs');
  });

  it('determine - STOPSIGNAL', () => {
    expect(processor.determineFunction('stopsignal').name).toEqual('processStopSignal');
  });

  it('determine - SHELL', () => {
    expect(processor.determineFunction('shell').name).toEqual('processShell');
  });

  it('determine - COMMENT', () => {
    expect(processor.determineFunction('comment').name).toEqual('processComment');
  });
});
