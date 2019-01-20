const fs = require('fs')
const Stream = require('stream')
const mocha = require('mocha')
const should = require('should')

const generator = require('.')

describe('JSON To Dockerfile', function () {

  it.skip('Empty JSON as input - Validation Error', async function () {
    try {
      let resp = await generator.generate({} )
    }
    catch (err) {
      should.exist(err)
      err.message.should.equal('Input Validation error')
    }
  })

  it.skip('JSON contains all element', async function () {

    let copyObject = []
    copyObject['src1'] = 'dst1'
    copyObject['src2'] = 'dst2'

    let addObject = []
    addObject['src1'] = 'dst1'
    addObject['src2'] = 'dst2'

    let inputJSON = {
      from: "nginx:latest",
      run: "test.run",
      cmd: "test.cmd",
      labels: {
        name: "value"
      },
      env: {
        env1: "value1",
        env2: "value2"
      },
      add: addObject,
      copy: copyObject,
      expose: ["80/tcp"],
      entrypoint: "/home/test",
      volumes: [ "/home/testvolume" ],
      user: "testuser",
      working_dir : "/home/app",
      args: [ "value1", "value2"],
      stopsignal: "stop",
      shell: [ "cmd", "param1", "param2" ]
       
    }

    try {
      let respLiteral = 'FROM nginx:latest\nRUN [ "test.run" ]\nCMD [ "test.cmd" ]\nLABEL name=value\nENV env1=value1\nENV env2=value2\nADD src1 dst1\nADD src2 dst2\nCOPY src1 dst1\nCOPY src2 dst2\nEXPOSE 80/tcp\nENTRYPOINT [ "/home/test" ]\nVOLUME /home/testvolume\nUSER testuser\nWORKDIR /home/app\nARG value1\nARG value2\nSTOPSIGNAL stop\nSHELL [ "cmd", "param1", "param2" ]\n'
      let resp = await generator.generate(inputJSON)
      resp.should.equal(respLiteral)
    }
    catch(error) {
      should.not.exist(error)
    }
  })

  it.skip('JSON contains all element - add/copy values are full path', async function () {

    let inputJSON = {
      from: "nginx:latest",
      run: "test.run",
      cmd: "test.cmd",
      labels: {
        name: "value"
      },
      env: {
        env1: "value1",
        env2: "value2"
      },
      add: {
        '/home/src1' : '/home/dst1',
        '/home/src2' : '/home/dst2'
      },
      copy:  {
        '/home/src1' : 'dst1',
        '/home/src2' : 'dst2'
      },
      expose: ["80/tcp"],
      entrypoint: "/home/test",
      volumes: [ "/home/testvolume" ],
      user: "testuser",
      working_dir : "/home/app",
      args: [ "value1", "value2"],
      stopsignal: "stop",
      shell: [ "cmd", "param1", "param2" ]
       
    }

    try {
      let respLiteral = 'FROM nginx:latest\nRUN [ "test.run" ]\nCMD [ "test.cmd" ]\nLABEL name=value\nENV env1=value1\nENV env2=value2\nADD /home/src1 /home/dst1\nADD /home/src2 /home/dst2\nCOPY /home/src1 dst1\nCOPY /home/src2 dst2\nEXPOSE 80/tcp\nENTRYPOINT [ "/home/test" ]\nVOLUME /home/testvolume\nUSER testuser\nWORKDIR /home/app\nARG value1\nARG value2\nSTOPSIGNAL stop\nSHELL [ "cmd", "param1", "param2" ]\n'
      let resp = await generator.generate(inputJSON)
      resp.should.equal(respLiteral)
    }
    catch(error) {
      should.not.exist(error)
    }
  })
  /*
  FROM nginx:latest
  RUN ["adduser", "--disabled-password", "-gecos", "", "testuser"]
  RUN ["mkdir", "/home/testuser/app"]
  VOLUME /home/testuser/app
  USER testuser
  WORKDIR /home/testuser/app
  LABEL name=value
  ENV env1=value1
  ENV env2=value2
  ADD test.run /home/testuser/app/test.run
  COPY test.cmd /home/testuser/app/test.cmd
  CMD ["tail", "-f", "/dev/null" ]
  EXPOSE 80/tcp
  ARG value1
  ARG value2
  STOPSIGNAL stop
  SHELL [ "/bin/bash", "-c", "echo hello"]
  */
  it('All element working example - 1 ', async function() {
    let inputJSON = {
      from: "nginx:latest",
      run: [ "adduser", "--disabled-password", "-gecos", "", "testuser" ],
      volumes: [ "/home/testuser/app" ],
      user: "testuser",
      working_dir: "/home/testuser/app",
      labels: {
        name: "value"
      },
      env: {
        env1: "value1",
        env2: "value2"
      },
      add: {
        'test.run' : '/home/testuser/app/test.run'
      },
      copy:  {
        'test.cmd' : '/home/testuser/app/test.cmd'
      },
      cmd: [ "tail", "-f", "/dev/null"],
      expose: ["80/tcp"],
      args: [ "value1", "value2"],
      stopsignal: "stop",
      shell: [ "/bin/bash", "-c", "echo hello" ]
    }

    try {
      let respLiteral = 'FROM nginx:latest\nRUN [ "adduser", "--disabled-password", "-gecos", "", "testuser" ]\nVOLUME /home/testuser/app\nUSER testuser\nWORKDIR /home/testuser/app\nLABEL name=value\nENV env1=value1\nENV env2=value2\nADD test.run /home/testuser/app/test.run\nCOPY test.cmd /home/testuser/app/test.cmd\nCMD [ "tail", "-f", "/dev/null" ]\nEXPOSE 80/tcp\nARG value1\nARG value2\nSTOPSIGNAL stop\nSHELL [ "/bin/bash", "-c", "echo hello" ]\n'
      let resp = await generator.generate(inputJSON)
      console.log(respLiteral)
      console.log(resp)
      resp.should.equal(respLiteral)
    }
    catch(error) {
      should.not.exist(error)
    }
  })
})

describe.skip('Dockerfile TO JSON', function() {

  it('GenerateJSON - Full', async function() {
    let copyObject = {}
    copyObject['src1'] = 'dst1'
    copyObject['src2'] = 'dst2'
  
    let addObject = {}
    addObject['src1'] = 'dst1'
    addObject['src2'] = 'dst2'
  
    let responseJSON = {
      from: "nginx:latest",
      run: ["test.run"],
      cmd: ["test.cmd"],
      labels: {
        name: "value"
      },
      env: {
        env1: "value1",
        env2: "value2"
      },
      add: addObject,
      copy: copyObject,
      expose: ["80/tcp"],
      entrypoint: [ "/home/test" ],
      volumes: [ "/home/testvolume" ],
      user: "testuser",
      working_dir : "/home/app",
      args: [ "value1", "value2"],
      stopsignal: "stop",
      shell: [ "cmd", "param1", "param2" ]
       
    }
  
      let respLiteral = 'FROM nginx:latest\nRUN [ "test.run" ]\nCMD [ "test.cmd" ]\nLABEL name=value\nENV env1=value1\nENV env2=value2\nADD src1 dst1\nADD src2 dst2\nCOPY src1 dst1\nCOPY src2 dst2\nEXPOSE 80/tcp\nENTRYPOINT [ "/home/test" ]\nVOLUME /home/testvolume\nUSER testuser\nWORKDIR /home/app\nARG value1\nARG value2\nSTOPSIGNAL stop\nSHELL [ "cmd", "param1", "param2" ]\n'
  
      let buf = Buffer.from(respLiteral);
      let bufferStream = new Stream.PassThrough();
      bufferStream.end(buf);
  
      let resp = await generator.convertToJSON(bufferStream)
      resp.should.eql(responseJSON)
  })
})
