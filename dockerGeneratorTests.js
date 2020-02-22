const { describe, it } = require('mocha');
const should = require('should');

const Generator = require('./lib/dockerGenerator');

describe('GeneratorTests', () => {
  it('Invalid JSON', () => {
    try {
      Generator.generateDockerFile({});
    } catch (error) {
      should.exists(error);
      should.equal(error.message, 'Input Validation error');
    }
  });

  it('Valid JSON - FROM', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' } });
    generateResult.should.equal('FROM nginx:latest\n');
  });

  it('Valid JSON - FROM with alias', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest', alias: 'http' } });
    generateResult.should.equal('FROM nginx:latest AS http\n');
  });

  it('Valid JSON - RUN in shell form', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, run: 'test_runnable.sh' });
    generateResult.should.equal('FROM nginx:latest\nRUN [ "test_runnable.sh" ]\n');
  });

  it('Valid JSON - RUN in exec form', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, run: ['test_runnable.sh', 'param1', 'param2'] });
    generateResult.should.equal('FROM nginx:latest\nRUN [ "test_runnable.sh", "param1", "param2" ]\n');
  });

  it('Valid JSON - FROM, ARG', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, args: ['arg1', 'arg2'] });
    generateResult.should.equal('FROM nginx:latest\nARG arg1\nARG arg2\n');
  });

  it('Valid JSON - FROM, CMD in shell form', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, cmd: 'test.cmd' });
    generateResult.should.equal('FROM nginx:latest\nCMD [ "test.cmd" ]\n');
  });

  it('Valid JSON - FROM, CMD in exec form', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, cmd: ['test.cmd', '-b'] });
    generateResult.should.equal('FROM nginx:latest\nCMD [ "test.cmd", "-b" ]\n');
  });

  it('Valid JSON - FROM, LABELS in object form', () => {
    const labels = {
      key1: 'value1',
      key2: 'value2',
    };
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, labels });
    generateResult.should.equal('FROM nginx:latest\nLABEL key1=value1\nLABEL key2=value2\n');
  });

  it('Valid JSON - FROM, LABELS in array form', () => {
    const labels = [];
    labels.key1 = 'value1';
    labels.key2 = 'value2';

    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, labels });
    generateResult.should.equal('FROM nginx:latest\nLABEL key1=value1\nLABEL key2=value2\n');
  });

  it('Valid JSON - FROM, EXPOSE', () => {
    const expose = ['80', '22', '443'];

    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, expose });
    generateResult.should.equal('FROM nginx:latest\nEXPOSE 80\nEXPOSE 22\nEXPOSE 443\n');
  });

  it('Valid JSON - FROM, ENV in object form', () => {
    const env = {
      key1: 'value1',
      key2: 'value2',
    };
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, env });
    generateResult.should.equal('FROM nginx:latest\nENV key1=value1\nENV key2=value2\n');
  });

  it('Valid JSON - FROM, ENV in array form', () => {
    const env = [];
    env.key1 = 'value1';
    env.key2 = 'value2';

    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, env });
    generateResult.should.equal('FROM nginx:latest\nENV key1=value1\nENV key2=value2\n');
  });

  it('Valid ARRAY', () => {
    const generateResult = Generator.generateDockerFileFromArray([{ from: { baseImage: 'nginx:latest' } }]);
    generateResult.should.equal('FROM nginx:latest\n');
  });

  it('Valid ARRAY - FROM, ARG', () => {
    const generateResult = Generator.generateDockerFileFromArray([{ from: { baseImage: 'nginx:latest' } }, { args: ['arg1', 'arg2'] }]);
    generateResult.should.equal('FROM nginx:latest\nARG arg1\nARG arg2\n');
  });

  it('Valid ARRAY - FROM, CMD', () => {
    const generateResult = Generator.generateDockerFileFromArray([{ from: { baseImage: 'nginx:latest' } }, { cmd: ['test.cmd', '-b'] }]);
    generateResult.should.equal('FROM nginx:latest\nCMD [ "test.cmd", "-b" ]\n');
  });

  it('Valid ARRAY - FROM, CMD', () => {
    const generateResult = Generator.generateDockerFileFromArray([
      {
        'from-1': { baseImage: 'nginx:latest' },
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
    generateResult.should.equal('FROM nginx:latest\nRUN [ "adduser", "--disabled-password", "-gecos", "", "testuser" ]\nVOLUME /home/testuser/app\nUSER testuser\nWORKDIR /home/testuser/app\nLABEL name=value\nENV env1=value1\nENV env2=value2\nADD test.run /home/testuser/app/test.run\nCOPY test.cmd /home/testuser/app/test.cmd\nENTRYPOINT [ "tail" ]\nCMD [ "-f", "/dev/null" ]\nEXPOSE 80/tcp\nARG value1\nARG value2\nSTOPSIGNAL stop\nSHELL [ "/bin/bash", "-c", "echo", "hello" ]\n');
  });


  it('Valid JSON, comment', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, comment: 'Some value' });
    generateResult.should.equal('FROM nginx:latest\n# Some value\n');
  });

  it('Valid JSON, invalid command', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, x: 'Some value' });
    generateResult.should.equal('FROM nginx:latest\n# Some value\n');
  });
});
