const fs = require('fs')
const mocha = require('mocha')
const should = require('should')

const generator = require('./')

describe.skip('dockerfile-generator', function () {

  it('Invalid JSON', async function () {
    try {
    let resp = await generator.generate(fs.readFileSync('./tests/1_unparsable_input.json'))
    }
    catch (err) {
      should.exist(err)
    }
  })

  it('Full test with all element ok', async function () {
    let expected = fs.readFileSync('./tests/all_element_test.out')
    let resp = await generator.generate(fs.readFileSync('./tests/all_element_test_input.json'))
    should.equal(resp, expected.toString())
  })

  it('ImageName does not exist', async function () {
    try {
      let resp = await generator.generate(fs.readFileSync('./tests/3_parsable_input_imagename_missing.json'))
    }
    catch (err) {
      should.exist(err)
    }
  })

  it('ImageVersion does not exist', async function () {
    try {
      let resp = generator.generate(fs.readFileSync('./tests/4_parsable_input_imageversion_missing.json'))
    }
    catch (err) {
      should.exist(err)
    }
  })

  it('ImageName and imageVersion are missing', async function () {
    try {
      let resp = await generator.generate(fs.readFileSync('./tests/5_parsable_input_imageinfos_missing.json'))
    }
    catch (err) {
      should.exist(err)
      should.equal(err.message, 'Input JSON has a semantic error! (imagename or imageversion)')
    }
  })

  it('Copy element not array', async function () {
    try {
      let resp = await generator.generate(fs.readFileSync('./tests/6_parsable_input_copy_not_array.json'))
    }
    catch (err) {
      should.exist(err)
      should.equal(err.message, 'Input JSON has a semantic error! (copy)')
    }
  })

  it('Run element not array', async function () {
    try{
      let resp = await generator.generate(fs.readFileSync('./tests/7_parsable_input_run_not_array.json'))
    }
    catch(err) {  
      should.exist(err)
      should.equal(err.message, 'Input JSON has a semantic error! (run)')
    }
  })

  it('Expose not array', async function () {
    try {
      let resp = await generator.generate(fs.readFileSync('./tests/8_parsable_input_expose_not_array.json'))
    }
    catch (err) {
      should.exist(err)
      should.equal(err.message, 'Input JSON has a semantic error! (expose)')
    }
  })

  it('Expose missing', async function () {
    let expected = fs.readFileSync('./tests/9_expose_missing.out')
    let resp = await generator.generate(fs.readFileSync('./tests/9_expose_missing.json'))
    should.equal(resp, expected.toString())
  })

  it('Cmd args missing', async function () {
    let expected = fs.readFileSync('./tests/10_cmd_args_missing.out')
    let resp = await generator.generate(fs.readFileSync('./tests/10_cmd_args_missing.json'))
    should.equal(resp, expected.toString())
  })

  it('Cmd missing', async function () {
    try {
      let resp = await generator.generate(fs.readFileSync('./tests/11_cmd_missing.json'))
    }
    catch (err) {
      should.exist(err)
      should.equal(err.message, 'Input JSON has a semantic error! (cmd)')
    }
  })

  it('Cmd.command missing', async function () {
    try {
      let resp = generator.generate(fs.readFileSync('./tests/12_cmd_command_missing.json'))
    }
    catch (err) {
      should.exist(err)
      should.equal(err.message, 'Input JSON has a semantic error! (cmd.command)')
    }
  })

  it('env is not array', async function () {
    try {
      let resp = generator.generate(fs.readFileSync('./tests/13_env_not_array.json'))
    }
    catch (err) {
      should.exist(err)
      should.equal(err.message, 'Input JSON has a semantic error! (env)')
    }
  })
})
