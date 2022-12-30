/* eslint-disable max-len */
const Stream = require('stream');
const {describe, it} = require('mocha');
const should = require('should');

const generator = require('../.');

describe('JSON To Dockerfile', () => {
  it('Empty JSON as input - Validation Error', async () => {
    try {
      await generator.generate({});
    } catch (err) {
      should.exist(err);
      err.message.should.equal('Input Validation error');
    }
  });

  it('JSON contains all element', async () => {
    const copyObject = [];
    copyObject.src1 = 'dst1';
    copyObject.src2 = 'dst2';

    const addObject = [];
    addObject.src1 = 'dst1';
    addObject.src2 = 'dst2';

    const inputJSON = {
      from: {baseImage: 'nginx:latest'},
      run: 'test.run',
      cmd: 'test.cmd',
      labels: {
        name: 'value',
      },
      env: {
        env1: 'value1',
        env2: 'value2',
      },
      add: addObject,
      copy: copyObject,
      expose: ['80/tcp'],
      entrypoint: '/home/test',
      volumes: ['/home/testvolume'],
      user: 'testuser',
      working_dir: '/home/app',
      args: ['value1', 'value2'],
      stopsignal: 'stop',
      shell: ['cmd', 'param1', 'param2'],
    };

    try {
      const respLiteral = 'FROM nginx:latest\nRUN [ "test.run" ]\nCMD [ "test.cmd" ]\nLABEL name=value\nENV env1=value1\nENV env2=value2\nADD src1 dst1\nADD src2 dst2\nCOPY src1 dst1\nCOPY src2 dst2\nEXPOSE 80/tcp\nENTRYPOINT [ "/home/test" ]\nVOLUME /home/testvolume\nUSER testuser\nWORKDIR /home/app\nARG value1\nARG value2\nSTOPSIGNAL stop\nSHELL [ "cmd", "param1", "param2" ]\n';
      const resp = await generator.generate(inputJSON);
      resp.should.equal(respLiteral);
    } catch (error) {
      should.not.exist(error);
    }
  });

  it('JSON contains all element - add/copy values are full path', async () => {
    const inputJSON = {
      from: {baseImage: 'nginx:latest'},
      run: 'test.run',
      cmd: 'test.cmd',
      labels: {
        name: 'value',
      },
      env: {
        env1: 'value1',
        env2: 'value2',
      },
      add: {
        '/home/src1': '/home/dst1',
        '/home/src2': '/home/dst2',
      },
      copy: {
        '/home/src1': 'dst1',
        '/home/src2': 'dst2',
      },
      expose: ['80/tcp'],
      entrypoint: '/home/test',
      volumes: ['/home/testvolume'],
      user: 'testuser',
      working_dir: '/home/app',
      args: ['value1', 'value2'],
      stopsignal: 'stop',
      shell: ['cmd', 'param1', 'param2'],
    };

    try {
      const respLiteral = 'FROM nginx:latest\nRUN [ "test.run" ]\nCMD [ "test.cmd" ]\nLABEL name=value\nENV env1=value1\nENV env2=value2\nADD /home/src1 /home/dst1\nADD /home/src2 /home/dst2\nCOPY /home/src1 dst1\nCOPY /home/src2 dst2\nEXPOSE 80/tcp\nENTRYPOINT [ "/home/test" ]\nVOLUME /home/testvolume\nUSER testuser\nWORKDIR /home/app\nARG value1\nARG value2\nSTOPSIGNAL stop\nSHELL [ "cmd", "param1", "param2" ]\n';
      const resp = await generator.generate(inputJSON);
      resp.should.equal(respLiteral);
    } catch (error) {
      should.not.exist(error);
    }
  });

  it('All element JSON to Dockerfile ', async () => {
    const inputJSON = {
      from: {baseImage: 'nginx:latest'},
      run: ['adduser', '--disabled-password', '-gecos', '', 'testuser'],
      volumes: ['/home/testuser/app'],
      user: 'testuser',
      working_dir: '/home/testuser/app',
      labels: {
        name: 'value',
      },
      env: {
        env1: 'value1',
        env2: 'value2',
      },
      add: {
        'test.run': '/home/testuser/app/test.run',
      },
      copy: {
        'test.cmd': '/home/testuser/app/test.cmd',
      },
      entrypoint: 'tail',
      cmd: ['-f', '/dev/null'],
      expose: ['80/tcp'],
      args: ['value1', 'value2'],
      stopsignal: 'stop',
      shell: ['/bin/bash', '-c', 'echo', 'hello'],
    };

    try {
      const respLiteral = 'FROM nginx:latest\nRUN [ "adduser", "--disabled-password", "-gecos", "", "testuser" ]\nVOLUME /home/testuser/app\nUSER testuser\nWORKDIR /home/testuser/app\nLABEL name=value\nENV env1=value1\nENV env2=value2\nADD test.run /home/testuser/app/test.run\nCOPY test.cmd /home/testuser/app/test.cmd\nENTRYPOINT [ "tail" ]\nCMD [ "-f", "/dev/null" ]\nEXPOSE 80/tcp\nARG value1\nARG value2\nSTOPSIGNAL stop\nSHELL [ "/bin/bash", "-c", "echo", "hello" ]\n';
      const resp = await generator.generate(inputJSON);
      resp.should.equal(respLiteral);
    } catch (error) {
      should.not.exist(error);
    }
  });
});

describe('Dockerfile TO JSON', () => {
  it('GenerateJSON - Full', async () => {
    const responseJSON = {
      from: {baseImage: 'nginx:latest'},
      run: ['adduser', '--disabled-password', '-gecos', '', 'testuser'],
      volumes: ['/home/testuser/app'],
      user: 'testuser',
      working_dir: '/home/testuser/app',
      labels: {
        name: 'value',
      },
      env: {
        env1: 'value1',
        env2: 'value2',
      },
      add: {
        'test.run': '/home/testuser/app/test.run',
      },
      copy: {
        'test.cmd': '/home/testuser/app/test.cmd',
      },
      entrypoint: ['tail'],
      cmd: ['-f', '/dev/null'],
      expose: ['80/tcp'],
      args: ['value1', 'value2'],
      stopsignal: 'stop',
      shell: ['/bin/bash', '-c', 'echo', 'hello'],
    };

    const respLiteral = 'FROM nginx:latest\nRUN [ "adduser", "--disabled-password", "-gecos", "", "testuser" ]\nVOLUME /home/testuser/app\nUSER testuser\nWORKDIR /home/testuser/app\nLABEL name=value\nENV env1=value1\nENV env2=value2\nADD test.run /home/testuser/app/test.run\nCOPY test.cmd /home/testuser/app/test.cmd\nENTRYPOINT [ "tail" ]\nCMD [ "-f", "/dev/null" ]\nEXPOSE 80/tcp\nARG value1\nARG value2\nSTOPSIGNAL stop\nSHELL [ "/bin/bash", "-c", "echo", "hello" ]\n';

    const buf = Buffer.from(respLiteral);
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(buf);

    const resp = await generator.convertToJSON(bufferStream);
    resp.should.eql(responseJSON);
  });
});
