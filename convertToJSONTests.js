const fs = require('fs')
const mocha = require('mocha')
const should = require('should')

let generator = require('./')

describe.skip('convertToJSON tests', function () {

  it('convertToJSON', async function () {
    let expected = fs.readFileSync('./tests/all_element_test_input.json')
    let resp = await generator.convertToJSON(fs.createReadStream('./tests/all_element_test.out'))
    should.equal(JSON.stringify(JSON.parse(expected.toString())), JSON.stringify(resp))
  })
})