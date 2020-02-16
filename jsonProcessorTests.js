const path = require('path');

const jsonProcessor = require(path.resolve(__dirname + '/lib/jsonProcessor'));

describe('jsonProcessorTests - determineTests', () => {
  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('FROM nginx:latest');
    foundFunction.name.should.equal('processFROM');
  });

  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('EXPOSE 80/tcp');
    foundFunction.name.should.equal('processEXPOSE');
  });

  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('VOLUME /home/testuser');
    foundFunction.name.should.equal('processVOLUME');
  });

  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('USER testuser');
    foundFunction.name.should.equal('processUSER');
  });

  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('WORKDIR /work');
    foundFunction.name.should.equal('processWORKDIR');
  });

  it('determine - Single param', () => {
    const foundFunction = jsonProcessor.determineFunction('STOPSIGNAL sigterm');
    foundFunction.name.should.equal('processSTOPSIGNAL');
  });

  it('determine - mutliple params (array)', () => {
    const resp = jsonProcessor.determineFunction('CMD ["test.cmd","-b","param"]');
    resp.name.should.equal('processCMD');
  });

  it('determine - mutliple params (array)', () => {
    const resp = jsonProcessor.determineFunction('RUN ["test.run","-b","param"]');
    resp.name.should.equal('processRUN');
  });

  it('determine - mutliple params (array)', () => {
    const resp = jsonProcessor.determineFunction('ENTRYPOINT ["test.run","-b","param"]');
    resp.name.should.equal('processENTRYPOINT');
  });

  it('determine - mutliple params (array)', () => {
    const resp = jsonProcessor.determineFunction('ARG arg1');
    resp.name.should.equal('processARG');
  });

  it('determine - mutliple params (simple params)', () => {
    const resp = jsonProcessor.determineFunction('COPY src dst');
    resp.name.should.equal('processCOPY');
  });

  it('determine - key-value pair', () => {
    const resp = jsonProcessor.determineFunction('LABEL key=value');
    resp.name.should.equal('processLABEL');
  });

  it('determine - key-value pair', () => {
    const resp = jsonProcessor.determineFunction('LABEL key=value');
    resp.name.should.equal('processLABEL');
  });

  it('determine - key-value pair', () => {
    const resp = jsonProcessor.determineFunction('ENV key=value');
    resp.name.should.equal('processENV');
  });
});

describe('jsonProcessorTests - processTests', () => {
  it('process - FROM', () => {
    const foundFunction = jsonProcessor.determineFunction('FROM nginx:latest');
    foundFunction.name.should.equal('processFROM');

    const respObject = foundFunction('FROM nginx:latest');

    respObject.from.should.be.equal('nginx:latest');
  });

  it('process - EXPOSE', () => {
    const foundFunction = jsonProcessor.determineFunction('EXPOSE 80/tcp');
    foundFunction.name.should.equal('processEXPOSE');

    const respObject = foundFunction('EXPOSE 80/tcp');

    respObject.expose.should.be.equal('80/tcp');
  });

  it('process - VOLUME', () => {
    const foundFunction = jsonProcessor.determineFunction('VOLUME /home/testvolume');
    foundFunction.name.should.equal('processVOLUME');

    const respObject = foundFunction('VOLUME /home/testvolume');

    respObject.volume.should.be.equal('/home/testvolume');
  });

  it('process - USER', () => {
    const foundFunction = jsonProcessor.determineFunction('USER testuser');
    foundFunction.name.should.equal('processUSER');

    const respObject = foundFunction('USER testuser');

    respObject.user.should.be.equal('testuser');
  });

  it('process - WORKDIR', () => {
    const foundFunction = jsonProcessor.determineFunction('WORKDIR /work');
    foundFunction.name.should.equal('processWORKDIR');

    const respObject = foundFunction('WORKDIR /work');

    respObject.workdir.should.be.equal('/work');
  });

  it('process - STOPSIGNAL', () => {
    const foundFunction = jsonProcessor.determineFunction('STOPSIGNAL sigterm');
    foundFunction.name.should.equal('processSTOPSIGNAL');

    const respObject = foundFunction('STOPSIGNAL sigterm');

    respObject.stopsignal.should.be.equal('sigterm');
  });

  it('process - ARG', () => {
    const foundFunction = jsonProcessor.determineFunction('ARG arg1');
    foundFunction.name.should.equal('processARG');
 
    const respObject = foundFunction('ARG arg1');

    respObject.arg.should.be.equal('arg1');
  });

  it('process - CMD', () => {
    const foundFunction = jsonProcessor.determineFunction('CMD ["test.cmd", "-b","param"]');
    foundFunction.name.should.equal('processCMD');

    const respObject = foundFunction('CMD ["test.cmd", "-b", "param"]');

    const expectedArray = [];
    expectedArray.push('test.cmd');
    expectedArray.push('-b');
    expectedArray.push('param');

    respObject.cmd.should.be.eql(expectedArray);
  });

  it('process - RUN', () => {
    const foundFunction = jsonProcessor.determineFunction('RUN ["test.run","-b","param"]');
    foundFunction.name.should.equal('processRUN');

    const respObject = foundFunction('RUN ["test.run","-b","param"]');

    const expectedArray = [];
    expectedArray.push('test.run');
    expectedArray.push('-b');
    expectedArray.push('param');

    respObject.run.should.be.eql(expectedArray);
  });

  it('process - SHELL', () => {
    const foundFunction = jsonProcessor.determineFunction('SHELL ["test.sh","-b","param"]');
    foundFunction.name.should.equal('processSHELL');

    const respObject = foundFunction('SHELL ["test.sh","-b","param"]');

    const expectedArray = [];
    expectedArray.push('test.sh');
    expectedArray.push('-b');
    expectedArray.push('param');

    respObject.shell.should.be.eql(expectedArray);
  });

  it('process - ENTRYPOINT', () => {
    const foundFunction = jsonProcessor.determineFunction('ENTRYPOINT ["test.run","-b","param"]');
    foundFunction.name.should.equal('processENTRYPOINT');

    const respObject = foundFunction('ENTRYPOINT ["test.run","-b","param"]');

    const expectedArray = [];
    expectedArray.push('test.run');
    expectedArray.push('-b');
    expectedArray.push('param');

    respObject.entrypoint.should.be.eql(expectedArray);
  });

  it('process - COPY', () => {
    const foundFunction = jsonProcessor.determineFunction('COPY src dst');
    foundFunction.name.should.equal('processCOPY');

    const respObject = foundFunction('COPY src dst');

    const expectedArray = {};
    expectedArray.src = 'dst';

    respObject.copy.should.be.eql(expectedArray);
  });

  it('process - ADD', () => {
    const foundFunction = jsonProcessor.determineFunction('ADD src dst');
    foundFunction.name.should.equal('processADD');

    const respObject = foundFunction('ADD src dst');

    const expectedArray = {};
    expectedArray.src = 'dst';

    respObject.add.should.be.eql(expectedArray);
  });

  it('process - LABEL', () => {
    const foundFunction = jsonProcessor.determineFunction('LABEL key=value');
    foundFunction.name.should.equal('processLABEL');

    const respObject = foundFunction('LABEL key=value');

    const expectedArray = {};
    expectedArray.key = 'value';

    respObject.label.should.be.eql(expectedArray);
  });

  it('process - ENV', () => {
    const foundFunction = jsonProcessor.determineFunction('ENV key=value');
    foundFunction.name.should.equal('processENV');

    const respObject = foundFunction('ENV key=value');

    const expectedArray = {};
    expectedArray.key = 'value';

    respObject.env.should.be.eql(expectedArray);
  });

  it('process - COMMENT', () => {
    const foundFunction = jsonProcessor.determineFunction('# Some value');
    foundFunction.name.should.equal('processCOMMENT');

    const respObject = foundFunction('# Some value');
    const expectedValue = 'Some value';

    respObject[Object.keys(respObject)[0]].should.be.eql(expectedValue);
  });
});
