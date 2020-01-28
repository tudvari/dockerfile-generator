const path = require('path');
const Stream = require('stream');


const jsonGenerator = require(path.resolve(`${__dirname}/lib/jsonGenerator`));

describe('JSONGenerator Tests', () => {
  it('Valid Dockerfile - FROM ', async () => {
    const buf = Buffer.from('FROM nginx:latest\n');
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(buf);

    const generateResult = await jsonGenerator.generateJSON(bufferStream);
    generateResult.should.eql({ from: 'nginx:latest' });
  });

  it('Valid JSON - FROM, CMD Array', async () => {
    const buf = Buffer.from('FROM nginx:latest\nCMD [ "test.cmd", "-b" ]\nCMD [ "test2.cmd", "-b2" ]\n');
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(buf);

    const generateResult = await jsonGenerator.generateJSON(bufferStream);
    generateResult.should.eql({ from: 'nginx:latest', cmd: ['test.cmd', '-b', 'test2.cmd', '-b2'] });
  });

  it('Valid JSON - FROM, ENV', async () => {
    const buf = Buffer.from('FROM nginx:latest\nENV env1=value1\nENV env2=value2\n');
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(buf);

    const generateResult = await jsonGenerator.generateJSON(bufferStream);
    const env = {};
    env.env1 = 'value1';
    env.env2 = 'value2';

    const resp = {};
    resp.from = 'nginx:latest';
    resp.env = env;

    generateResult.should.eql(resp);
  });

  it('Valid JSON - FROM, COMMENT', async () => {
    const buf = Buffer.from('FROM nginx:latest\n# Some Value\n');
    const bufferStream = new Stream.PassThrough();
    bufferStream.end(buf);

    const generateResult = await jsonGenerator.generateJSON(bufferStream);

    const expectedValue = 'Some Value';
    generateResult[Object.keys(generateResult)[1]].should.eql(expectedValue);
  });
});
