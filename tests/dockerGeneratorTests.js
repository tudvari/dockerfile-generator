/* eslint-disable max-len */
const {describe, it, expect} = require('@jest/globals');

const Generator = require('../lib/dockerGenerator');

describe('GeneratorTests', () => {
  it('Invalid JSON', () => {
    expect(() => Generator.generateDockerFile({})).toThrow('Input Validation error');
  });

  it('Valid JSON - FROM', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}});
    expect(generateResult).toEqual('FROM nginx:latest\n');
  });

  it('Valid JSON - FROM with alias', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest', alias: 'http'}});
    expect(generateResult).toEqual('FROM nginx:latest AS http\n');
  });

  it('Valid JSON - RUN in shell form', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, run: 'test_runnable.sh'});
    expect(generateResult).toEqual('FROM nginx:latest\nRUN [ "test_runnable.sh" ]\n');
  });

  it('Valid JSON - RUN in exec form', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, run: ['test_runnable.sh', 'param1', 'param2']});
    expect(generateResult).toEqual('FROM nginx:latest\nRUN [ "test_runnable.sh", "param1", "param2" ]\n');
  });

  it('Valid JSON - FROM, ARG', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, args: ['arg1', 'arg2']});
    expect(generateResult).toEqual('FROM nginx:latest\nARG arg1\nARG arg2\n');
  });

  it('Valid JSON - FROM, CMD in shell form', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, cmd: 'test.cmd'});
    expect(generateResult).toEqual('FROM nginx:latest\nCMD [ "test.cmd" ]\n');
  });

  it('Valid JSON - FROM, CMD in exec form', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, cmd: ['test.cmd', '-b']});
    expect(generateResult).toEqual('FROM nginx:latest\nCMD [ "test.cmd", "-b" ]\n');
  });

  it('Valid JSON - FROM, LABELS in object form', () => {
    const labels = {
      key1: 'value1',
      key2: 'value2',
    };
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, labels});
    expect(generateResult).toEqual('FROM nginx:latest\nLABEL key1=value1\nLABEL key2=value2\n');
  });

  it('Valid JSON - FROM, LABELS in array form', () => {
    const labels = [];
    labels.key1 = 'value1';
    labels.key2 = 'value2';

    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, labels});
    expect(generateResult).toEqual('FROM nginx:latest\nLABEL key1=value1\nLABEL key2=value2\n');
  });

  it('Valid JSON - FROM, EXPOSE', () => {
    const expose = ['80', '22', '443'];

    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, expose});
    expect(generateResult).toEqual('FROM nginx:latest\nEXPOSE 80\nEXPOSE 22\nEXPOSE 443\n');
  });

  it('Valid JSON - FROM, ENV in object form', () => {
    const env = {
      key1: 'value1',
      key2: 'value2',
    };
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, env});
    expect(generateResult).toEqual('FROM nginx:latest\nENV key1=value1\nENV key2=value2\n');
  });

  it('Valid JSON - FROM, ENV in array form', () => {
    const env = [];
    env.key1 = 'value1';
    env.key2 = 'value2';

    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, env});
    expect(generateResult).toEqual('FROM nginx:latest\nENV key1=value1\nENV key2=value2\n');
  });

  it('Valid JSON - FROM, ADD in array form', () => {
    const add = [];
    add.key1 = 'value1';
    add.key2 = 'value2';

    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, add});
    expect(generateResult).toEqual('FROM nginx:latest\nADD key1 value1\nADD key2 value2\n');

  });

  it('Valid JSON - FROM, ADD in object form', () => {
    const add = {};
    add.key1 = 'value1';
    add.key2 = 'value2';

    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, add});
    expect(generateResult).toEqual('FROM nginx:latest\nADD key1 value1\nADD key2 value2\n');
  });

  it('Valid JSON - FROM, COPY in array form', () => {
    const copy = [];
    copy.key1 = 'value1';
    copy.key2 = 'value2';

    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, copy});
    expect(generateResult).toEqual('FROM nginx:latest\nCOPY key1 value1\nCOPY key2 value2\n');
  });

  it('Valid JSON - FROM, COPY in object form', () => {
    const copy = {};
    copy.key1 = 'value1';
    copy.key2 = 'value2';

    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, copy});
    expect(generateResult).toEqual('FROM nginx:latest\nCOPY key1 value1\nCOPY key2 value2\n');
  });

  it('Valid JSON - FROM, ENTRYPOINT is a string', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, entrypoint: 'test_runnable.sh'});
    expect(generateResult).toEqual('FROM nginx:latest\nENTRYPOINT [ "test_runnable.sh" ]\n');
  });

  it('Valid JSON - FROM, ENTRYPOINT is a array', () => {
    const entrypoint = ['test_runnable.sh', 'param1', 'param2'];

    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, entrypoint});
    expect(generateResult).toEqual('FROM nginx:latest\nENTRYPOINT [ "test_runnable.sh", "param1", "param2" ]\n');
  });

  it('Valid JSON - FROM, VOLUMES is a array', () => {
    const volumes = ['/home/app/1', '/home/app/2'];

    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, volumes});
    expect(generateResult).toEqual('FROM nginx:latest\nVOLUME /home/app/1\nVOLUME /home/app/2\n');
  });

  it('Valid JSON - FROM, USER', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, user: 'username'});
    expect(generateResult).toEqual('FROM nginx:latest\nUSER username\n');
  });

  it('Valid JSON - FROM, WORKING_DIR', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, working_dir: '/home/app'});
    expect(generateResult).toEqual('FROM nginx:latest\nWORKDIR /home/app\n');
  });

  it('Valid JSON - FROM, ARGS', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, args: ['arg1', 'arg2']});
    expect(generateResult).toEqual('FROM nginx:latest\nARG arg1\nARG arg2\n');
  });

  it('Valid JSON - FROM, STOPSIGNAL', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, stopsignal: 'signal'});
    expect(generateResult).toEqual('FROM nginx:latest\nSTOPSIGNAL signal\n');
  });

  it('Valid JSON - FROM, SINGLE COMMENT', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, comment: 'single comment'});
    expect(generateResult).toEqual('FROM nginx:latest\n# single comment\n');
  });

  it('Valid JSON - FROM, MULTIPLE COMMENT', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, comment_1: 'first comment', comment_2: 'second comment'});
    expect(generateResult).toEqual('FROM nginx:latest\n# first comment\n# second comment\n');
  });

  it('Valid ARRAY', () => {
    const generateResult = Generator.generateDockerFileFromArray([{from: {baseImage: 'nginx:latest'}}]);
    expect(generateResult).toEqual('FROM nginx:latest\n');
  });

  it('Valid ARRAY - FROM, ARG', () => {
    const generateResult = Generator.generateDockerFileFromArray([{from: {baseImage: 'nginx:latest'}}, {args: ['arg1', 'arg2']}]);
    expect(generateResult).toEqual('FROM nginx:latest\nARG arg1\nARG arg2\n');
  });

  it('Valid ARRAY - FROM, CMD', () => {
    const generateResult = Generator.generateDockerFileFromArray([{from: {baseImage: 'nginx:latest'}}, {cmd: ['test.cmd', '-b']}]);
    expect(generateResult).toEqual('FROM nginx:latest\nCMD [ "test.cmd", "-b" ]\n');
  });

  it('Valid ARRAY - FROM, CMD', () => {
    const generateResult = Generator.generateDockerFileFromArray([
      {
        'from-1': {baseImage: 'nginx:latest'},
      },
      {
        run: ['adduser', '--disabled-password', '-gecos', '', 'testuser'],
      },
      {
        volumes: ['/home/testuser/app'],
      },
      {
        user: 'testuser',
      },
      {
        working_dir: '/home/testuser/app',
      },
      {
        labels: {
          name: 'value',
        },
      },
      {
        env: {
          env1: 'value1',
          env2: 'value2',
        },
      },
      {
        add: {
          'test.run': '/home/testuser/app/test.run',
        },
      },
      {
        copy: {
          'test.cmd': '/home/testuser/app/test.cmd',
        },
      },
      {
        entrypoint: 'tail',
      },
      {
        cmd: ['-f', '/dev/null'],
      },
      {
        expose: ['80/tcp'],
      },
      {
        args: ['value1', 'value2'],
      },
      {
        stopsignal: 'stop',
      },
      {
        shell: ['/bin/bash', '-c', 'echo', 'hello'],
      },
    ]);
    expect(generateResult).toEqual('FROM nginx:latest\nRUN [ "adduser", "--disabled-password", "-gecos", "", "testuser" ]\nVOLUME /home/testuser/app\nUSER testuser\nWORKDIR /home/testuser/app\nLABEL name=value\nENV env1=value1\nENV env2=value2\nADD test.run /home/testuser/app/test.run\nCOPY test.cmd /home/testuser/app/test.cmd\nENTRYPOINT [ "tail" ]\nCMD [ "-f", "/dev/null" ]\nEXPOSE 80/tcp\nARG value1\nARG value2\nSTOPSIGNAL stop\nSHELL [ "/bin/bash", "-c", "echo", "hello" ]\n');
  });


  it('Valid JSON, comment', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, comment: 'Some value'});
    expect(generateResult).toEqual('FROM nginx:latest\n# Some value\n');
  });

  it('Valid JSON, invalid command', () => {
    const generateResult = Generator.generateDockerFile({from: {baseImage: 'nginx:latest'}, x: 'Some value'});
    expect(generateResult).toEqual('FROM nginx:latest\n# Some value\n');
  });
});
