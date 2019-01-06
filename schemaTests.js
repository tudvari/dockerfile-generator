const fs = require('fs')
const path = require('path')

const mocha = require('mocha')
const should = require('should')

const Validator = require('jsonschema').Validator
const v = new Validator()

const schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, './schema.json')))

describe('JSON schema Tests', function() {

  it('FROM is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest' }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('FROM is Number', function() {    
    validationResult = v.validate({ 'from' : 2 }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('FROM is Missing', function() {
    validationResult = v.validate({}, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('FROM is Object', function() {    
    validationResult = v.validate({ 'from' : {} }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('RUN is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run" }, schema).errors.length
    validationResult.should.be.equal(0)
  })
  it('RUN is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: ["echo", "-b", "command"] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('RUN is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: 2 }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('RUN is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: {} }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })
  
  it('CMD is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd"  }, schema).errors.length
    validationResult.should.be.equal(0)
  })
  it('CMD is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: ["echo", "-b", "command"], cmd: [ "executable", "param1", "param2" ] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('CMD is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: 2 }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('CMD is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: {} }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Label is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: "aaa"  }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Label is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: ["echo", "-b", "command"], cmd: [ "executable", "param1", "param2" ], labels: [] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Label is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: 2}, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Label is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: {} }, schema).errors.length
    validationResult.should.be.equal(0)
  })
  it('Expose is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: "80/tcp"}, schema).errors.length
    validationResult.should.be.not.equal(0)
  })
  it('Expose is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [ "80/tcp", "8080/tcp" ] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Expose is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: 2}, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Expose is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: {}, expose: {} }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })
 
  it('Env is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: "a" }, schema).errors.length
  })

  it('Env is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [ "80/tcp", "8080/tcp" ], env: [ key1="value1", key2="value2" ] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Env is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: 2}, schema).errors.length
  })

  it('Env is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: {}, expose: [], env: { key: "value" } }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Add is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: [], add: "a" }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Add is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [ "80/tcp", "8080/tcp" ], env: [ key1="value1", key2="value2" ], add: [src1="dest1", src2="dest2"] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Add is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: [], add: 2}, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Add is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: {}, expose: [], env: { key: "value" }, add: {} }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Copy is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: [], copy: "a" }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Copy is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [ "80/tcp", "8080/tcp" ], env: [ key1="value1", key2="value2" ], copy: [src1="dest1", src2="dest2"] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Copy is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: [], copy: 2}, schema).errors.length
    validationResult.should.be.not.equal(0)
  })  

  it('Copy is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: {}, expose: [], env: { key: "value" }, copy: {} }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Entrypoint is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', entrypoint: "/app/test" }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Entrypoint is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', entrypoint: [ "/app/test" ] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Entrypoint is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', entrypoint: 2 }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Entrypoint is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', entrypoint: {} }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Volumes is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', volumes: "/app/test" }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Volumes is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', volumes: [ "/app/test" ] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Volumes is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', volumes: 2 }, schema).errors.length
  })

  it('Volumes is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', volumes: {} }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('User is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', user: "testuser" }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('User is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', user: [ "/app/test" ] }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('User is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', user: 2 }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('User is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', user: {} }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })
 
  it('Working_dir is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', working_dir: "/app" }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Working_dir is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', working_dir: [ "/app/test" ] }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Working_dir is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', working_dir: 2 }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Working_dir is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', working_dir: {} }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Args is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', args: "/app" }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Args is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', args: [ arg1="arg1_value", args2="arg2_value" ] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Args is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', args: 2 }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Args is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', args: { arg1: "arg1_value", arg2: "arg2_value" } }, schema).errors.length
    validationResult.should.be.equal(0)
  })
  
  it('Onbuild is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', onbuild: "/app" }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Onbuild is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', onbuild: [ "param1", "param2" ] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Onbuild is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', onbuild: 2 }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Onbuild is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', onbuild: { } }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })
  
  it('Stopsignal is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', stopsignal: "/app" }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Stopsignal is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', stopsignal: [ "param1", "param2" ] }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Stopsignal is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', stopsignal: 2 }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Stopsignal is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', stopsignal: { } }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Shell is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', shell: "/app" }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Shell is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', shell: [ "param1", "param2" ] }, schema).errors.length
    validationResult.should.be.equal(0)
  })

  it('Shell is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', shell: 2 }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })

  it('Shell is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', shell: { } }, schema).errors.length
    validationResult.should.be.not.equal(0)
  })
})