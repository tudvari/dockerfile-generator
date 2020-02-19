const path = require('path');

const Generator = require(path.resolve(__dirname + '/lib/dockerGenerator'));

describe('GeneratorTests', () => {
  it('Invalid JSON', () => {
    try {
      Generator.generateDockerFile({});
    } catch (error) {
      should.exists(error);
      should.equal(error.message, 'Input Validation error');
    }
  });

  it('Valid JSON', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' } });
    generateResult.should.equal('FROM nginx:latest\n');
  });

  it('Valid JSON - FROM, ARG', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, args: ['arg1', 'arg2'] });
    generateResult.should.equal('FROM nginx:latest\nARG arg1\nARG arg2\n');
  });

  it('Valid JSON - FROM, CMD', () => {
    const generateResult = Generator.generateDockerFile({ from: { baseImage: 'nginx:latest' }, cmd: ['test.cmd', '-b'] });
    generateResult.should.equal('FROM nginx:latest\nCMD [ "test.cmd", "-b" ]\n');
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
