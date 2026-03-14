/* eslint-disable max-len */
const {describe, it, expect} = require('@jest/globals');

const jsonProcessor = require('../lib/jsonProcessor');

describe('jsonProcessorTests - determineTests', () => {
  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('FROM nginx:latest');
    expect(foundFunction.name).toEqual('processFROM');
  });

  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('EXPOSE 80/tcp');
    expect(foundFunction.name).toEqual('processEXPOSE');
  });

  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('VOLUME /home/testuser');
    expect(foundFunction.name).toEqual('processVOLUME');
  });

  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('USER testuser');
    expect(foundFunction.name).toEqual('processUSER');
  });

  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('WORKDIR /work');
    expect(foundFunction.name).toEqual('processWORKDIR');
  });

  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('STOPSIGNAL sigterm');
    expect(foundFunction.name).toEqual('processSTOPSIGNAL');
  });

  it('determine - mutliple params (array)', () => {
    const resp = jsonProcessor.determineFunction('CMD ["test.cmd","-b","param"]');
    expect(resp.name).toEqual('processCMD');
  });

  it('determine - mutliple params (array)', () => {
    const resp = jsonProcessor.determineFunction('RUN ["test.run","-b","param"]');
    expect(resp.name).toEqual('processRUN');
  });

  it('determine - mutliple params (array)', () => {
    const resp = jsonProcessor.determineFunction('ENTRYPOINT ["test.run","-b","param"]');
    expect(resp.name).toEqual('processENTRYPOINT');
  });

  it('determine - mutliple params (array)', () => {
    const resp = jsonProcessor.determineFunction('ARG arg1');
    expect(resp.name).toEqual('processARG');
  });

  it('determine - mutliple params (simple params)', () => {
    const resp = jsonProcessor.determineFunction('COPY src dst');
    expect(resp.name).toEqual('processCOPY');
  });

  it('determine - key-value pair', () => {
    const resp = jsonProcessor.determineFunction('LABEL key=value');
    expect(resp.name).toEqual('processLABEL');
  });

  it('determine - key-value pair', () => {
    const resp = jsonProcessor.determineFunction('LABEL key=value');
    expect(resp.name).toEqual('processLABEL');
  });

  it('determine - key-value pair', () => {
    const resp = jsonProcessor.determineFunction('ENV key=value');
    expect(resp.name).toEqual('processENV');
  });
});

describe('jsonProcessorTests - processTests', () => {
  it('process - FROM', () => {
    const foundFunction = jsonProcessor.determineFunction('FROM nginx:latest');
    expect(foundFunction.name).toEqual('processFROM');

    const respObject = foundFunction('FROM nginx:latest');

    expect(respObject.from.baseImage).toEqual('nginx:latest');
  });

  it('process - EXPOSE', () => {
    const foundFunction = jsonProcessor.determineFunction('EXPOSE 80/tcp');
    expect(foundFunction.name).toEqual('processEXPOSE');

    const respObject = foundFunction('EXPOSE 80/tcp');

    expect(respObject.expose).toEqual('80/tcp');
  });

  it('process - VOLUME', () => {
    const foundFunction = jsonProcessor.determineFunction('VOLUME /home/testvolume');
    expect(foundFunction.name).toEqual('processVOLUME');

    const respObject = foundFunction('VOLUME /home/testvolume');

    expect(respObject.volume).toEqual('/home/testvolume');
  });

  it('process - USER', () => {
    const foundFunction = jsonProcessor.determineFunction('USER testuser');
    expect(foundFunction.name).toEqual('processUSER');

    const respObject = foundFunction('USER testuser');

    expect(respObject.user).toEqual('testuser');
  });

  it('process - WORKDIR', () => {
    const foundFunction = jsonProcessor.determineFunction('WORKDIR /work');
    expect(foundFunction.name).toEqual('processWORKDIR');

    const respObject = foundFunction('WORKDIR /work');

    expect(respObject.workdir).toEqual('/work');
  });

  it('process - STOPSIGNAL', () => {
    const foundFunction = jsonProcessor.determineFunction('STOPSIGNAL sigterm');
    expect(foundFunction.name).toEqual('processSTOPSIGNAL');

    const respObject = foundFunction('STOPSIGNAL sigterm');

    expect(respObject.stopsignal).toEqual('sigterm');
  });

  it('process - ARG', () => {
    const foundFunction = jsonProcessor.determineFunction('ARG arg1');
    expect(foundFunction.name).toEqual('processARG');

    const respObject = foundFunction('ARG arg1');

    expect(respObject.arg).toEqual('arg1');
  });

  it('process - CMD', () => {
    const foundFunction = jsonProcessor.determineFunction('CMD ["test.cmd", "-b","param"]');
    expect(foundFunction.name).toEqual('processCMD');

    const respObject = foundFunction('CMD ["test.cmd", "-b", "param"]');

    const expectedArray = [];
    expectedArray.push('test.cmd');
    expectedArray.push('-b');
    expectedArray.push('param');

    expect(respObject.cmd).toEqual(expectedArray);
  });

  it('process - RUN', () => {
    const foundFunction = jsonProcessor.determineFunction('RUN ["test.run","-b","param"]');
    expect(foundFunction.name).toEqual('processRUN');

    const respObject = foundFunction('RUN ["test.run","-b","param"]');

    const expectedArray = [];
    expectedArray.push('test.run');
    expectedArray.push('-b');
    expectedArray.push('param');

    expect(respObject.run).toEqual(expectedArray);
  });

  it('process - SHELL', () => {
    const foundFunction = jsonProcessor.determineFunction('SHELL ["test.sh","-b","param"]');
    expect(foundFunction.name).toEqual('processSHELL');

    const respObject = foundFunction('SHELL ["test.sh","-b","param"]');

    const expectedArray = [];
    expectedArray.push('test.sh');
    expectedArray.push('-b');
    expectedArray.push('param');

    expect(respObject.shell).toEqual(expectedArray);
  });

  it('process - ENTRYPOINT', () => {
    const foundFunction = jsonProcessor.determineFunction('ENTRYPOINT ["test.run","-b","param"]');
    expect(foundFunction.name).toEqual('processENTRYPOINT');

    const respObject = foundFunction('ENTRYPOINT ["test.run","-b","param"]');

    const expectedArray = [];
    expectedArray.push('test.run');
    expectedArray.push('-b');
    expectedArray.push('param');

    expect(respObject.entrypoint).toEqual(expectedArray);
  });

  it('process - COPY', () => {
    const foundFunction = jsonProcessor.determineFunction('COPY src dst');
    expect(foundFunction.name).toEqual('processCOPY');

    const respObject = foundFunction('COPY src dst');

    const expectedArray = {};
    expectedArray.src = 'dst';

    expect(respObject.copy).toEqual(expectedArray);
  });

  it('process - ADD', () => {
    const foundFunction = jsonProcessor.determineFunction('ADD src dst');
    expect(foundFunction.name).toEqual('processADD');

    const respObject = foundFunction('ADD src dst');

    const expectedArray = {};
    expectedArray.src = 'dst';

    expect(respObject.add).toEqual(expectedArray);
  });

  it('process - LABEL', () => {
    const foundFunction = jsonProcessor.determineFunction('LABEL key=value');
    expect(foundFunction.name).toEqual('processLABEL');

    const respObject = foundFunction('LABEL key=value');

    const expectedArray = {};
    expectedArray.key = 'value';

    expect(respObject.label).toEqual(expectedArray);
  });

  it('process - ENV', () => {
    const foundFunction = jsonProcessor.determineFunction('ENV key=value');
    expect(foundFunction.name).toEqual('processENV');

    const respObject = foundFunction('ENV key=value');

    const expectedArray = {};
    expectedArray.key = 'value';

    expect(respObject.env).toEqual(expectedArray);
  });

  it('process - COMMENT', () => {
    const foundFunction = jsonProcessor.determineFunction('# Some value');
    expect(foundFunction.name).toEqual('processCOMMENT');

    const respObject = foundFunction('# Some value');
    const expectedValue = 'Some value';

    expect(respObject[Object.keys(respObject)[0]]).toEqual(expectedValue);
  });
});
