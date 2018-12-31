const fs = require('fs')
const path = require('path')

const mocha = require('mocha')
const should = require('should')

const Validator = require('jsonschema').Validator
const v = new Validator()

const schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, './schema.json')))

describe('JSON schema Tests', function() {

  it('FROM is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest' }, schema).valid
    validationResult.should.be.true()
  })

  it('FROM is Number', function() {    
    validationResult = v.validate({ 'from' : 2 }, schema).valid
    validationResult.should.be.false()
  })

  it('FROM is Missing', function() {
    validationResult = v.validate({}, schema).valid
    validationResult.should.be.false()
  })

  it('FROM is Object', function() {    
    validationResult = v.validate({ 'from' : {} }, schema).valid
    validationResult.should.be.false()
  })

  it('RUN is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run" }, schema).valid
    validationResult.should.be.true()
  })
  it('RUN is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: ["echo", "-b", "command"] }, schema).valid
    validationResult.should.be.true()
  })

  it('RUN is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: 2 }, schema).valid
    validationResult.should.be.false()
  })

  it('RUN is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: {} }, schema).valid
    validationResult.should.be.false()
  })
  
  it('CMD is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd"  }, schema).valid
    validationResult.should.be.true()
  })
  it('CMD is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: ["echo", "-b", "command"], cmd: [ "executable", "param1", "param2" ] }, schema).valid
    validationResult.should.be.true()
  })

  it('CMD is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: 2 }, schema).valid
    validationResult.should.be.false()
  })

  it('CMD is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: {} }, schema).valid
    validationResult.should.be.false()
  })

  it('Label is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: "aaa"  }, schema).valid
    validationResult.should.be.false()
  })

  it('Label is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: ["echo", "-b", "command"], cmd: [ "executable", "param1", "param2" ], labels: [] }, schema).valid
    validationResult.should.be.true()
  })

  it('Label is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: 2}, schema).valid
    validationResult.should.be.false()
  })

  it('Label is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: {} }, schema).valid
    validationResult.should.be.true()
  })
  it('Expose is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: "80/tcp"}, schema).valid
    validationResult.should.be.false()
  })
  it('Expose is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [ "80/tcp", "8080/tcp" ] }, schema).valid
    validationResult.should.be.true()
  })

  it('Expose is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: 2}, schema).valid
    validationResult.should.be.false()
  })

  it('Expose is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: {}, expose: {} }, schema).valid
    validationResult.should.be.false()
  })
 
  it('Env is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: "a" }, schema).valid
    validationResult.should.be.false()
  })

  it('Env is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [ "80/tcp", "8080/tcp" ], env: [ key1="value1", key2="value2" ] }, schema).valid
    validationResult.should.be.true()
  })

  it('Env is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: 2}, schema).valid
    validationResult.should.be.false()
  })

  it('Env is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: {}, expose: [], env: { key: "value" } }, schema).valid
    validationResult.should.be.true()
  })

  it('Add is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: [], add: "a" }, schema).valid
    validationResult.should.be.false()
  })

  it('Add is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [ "80/tcp", "8080/tcp" ], env: [ key1="value1", key2="value2" ], add: [src1="dest1", src2="dest2"] }, schema).valid
    validationResult.should.be.true()
  })

  it('Add is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: [], add: 2}, schema).valid
    validationResult.should.be.false()
  })

  it('Add is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: {}, expose: [], env: { key: "value" }, add: {} }, schema).valid
    validationResult.should.be.false()
  })

  it('Copy is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: [], copy: "a" }, schema).valid
    validationResult.should.be.false()
  })

  it('Copy is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [ "80/tcp", "8080/tcp" ], env: [ key1="value1", key2="value2" ], copy: [src1="dest1", src2="dest2"] }, schema).valid
    validationResult.should.be.true()
  })

  it('Copy is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: [], expose: [], env: [], copy: 2}, schema).valid
    validationResult.should.be.false()
  })

  it('Copy is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', run: "test.run", cmd: "test.cmd", labels: {}, expose: [], env: { key: "value" }, copy: {} }, schema).valid
    validationResult.should.be.false()
  })

  it('Entrypoint is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', entrypoint: "/app/test" }, schema).valid
    validationResult.should.be.true()
  })

  it('Entrypoint is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', entrypoint: [ "/app/test" ] }, schema).valid
    validationResult.should.be.true()
  })

  it('Entrypoint is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', entrypoint: 2 }, schema).valid
    validationResult.should.be.false()
  })

  it('Entrypoint is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', entrypoint: {} }, schema).valid
    validationResult.should.be.false()
  })

  it('Volumes is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', volumes: "/app/test" }, schema).valid
    validationResult.should.be.false()
  })

  it('Volumes is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', volumes: [ "/app/test" ] }, schema).valid
    validationResult.should.be.true()
  })

  it('Volumes is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', volumes: 2 }, schema).valid
    validationResult.should.be.false()
  })

  it('Volumes is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', volumes: {} }, schema).valid
    validationResult.should.be.false()
  })

  it('User is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', user: "testuser" }, schema).valid
    validationResult.should.be.true()
  })

  it('User is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', user: [ "/app/test" ] }, schema).valid
    validationResult.should.be.false()
  })

  it('User is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', user: 2 }, schema).valid
    validationResult.should.be.false()
  })

  it('User is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', user: {} }, schema).valid
    validationResult.should.be.false()
  })
 
  it('Working_dir is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', working_dir: "/app" }, schema).valid
    validationResult.should.be.true()
  })

  it('Working_dir is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', working_dir: [ "/app/test" ] }, schema).valid
    validationResult.should.be.false()
  })

  it('Working_dir is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', working_dir: 2 }, schema).valid
    validationResult.should.be.false()
  })

  it('Working_dir is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', working_dir: {} }, schema).valid
    validationResult.should.be.false()
  })

  it('Args is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', args: "/app" }, schema).valid
    validationResult.should.be.false()
  })

  it('Args is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', args: [ arg1="arg1_value", args2="arg2_value" ] }, schema).valid
    validationResult.should.be.true()
  })

  it('Args is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', args: 2 }, schema).valid
    validationResult.should.be.false()
  })

  it('Args is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', args: { arg1: "arg1_value", arg2: "arg2_value" } }, schema).valid
    validationResult.should.be.true()
  })
  
  it('Onbuild is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', onbuild: "/app" }, schema).valid
    validationResult.should.be.false()
  })

  it('Onbuild is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', onbuild: [ "param1", "param2" ] }, schema).valid
    validationResult.should.be.true()
  })

  it('Onbuild is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', onbuild: 2 }, schema).valid
    validationResult.should.be.false()
  })

  it('Onbuild is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', onbuild: { } }, schema).valid
    validationResult.should.be.false()
  })
  
  it('Stopsignal is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', stopsignal: "/app" }, schema).valid
    validationResult.should.be.true()
  })

  it('Stopsignal is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', stopsignal: [ "param1", "param2" ] }, schema).valid
    validationResult.should.be.false()
  })

  it('Stopsignal is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', stopsignal: 2 }, schema).valid
    validationResult.should.be.false()
  })

  it('Stopsignal is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', stopsignal: { } }, schema).valid
    validationResult.should.be.false()
  })

  it('Shell is String', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', shell: "/app" }, schema).valid
    validationResult.should.be.false()
  })

  it('Shell is Array', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', shell: [ "param1", "param2" ] }, schema).valid
    validationResult.should.be.true()
  })

  it('Shell is Number', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', shell: 2 }, schema).valid
    validationResult.should.be.false()
  })

  it('Shell is Object', function() {
    validationResult = v.validate({ 'from' : 'nginx:latest', shell: { } }, schema).valid
    validationResult.should.be.false()
  })
})