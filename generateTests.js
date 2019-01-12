const fs = require('fs')
const mocha = require('mocha')
const should = require('should')

const generator = require('./')

describe.skip('dockerfile-generator', function () {

  it('Empty JSON as input - Validation Error', async function () {
    try {
      let resp = await generator.generate({} )
    }
    catch (err) {
      should.exist(err)
      err.message.should.equal('Input Validation error')
    }
  })

  it('JSON contains all element', async function () {

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

  it('JSON contains all element - add/copy values are full path', async function () {

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
})
